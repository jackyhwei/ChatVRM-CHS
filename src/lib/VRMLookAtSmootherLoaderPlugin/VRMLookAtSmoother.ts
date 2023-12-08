import { VRMHumanoid, VRMLookAt, VRMLookAtApplier } from "@pixiv/three-vrm";
import * as THREE from "three";

/** 扫视最小间隔 */
const SACCADE_MIN_INTERVAL = 0.5;

/**
 * 扫视触发阀值
 */
const SACCADE_PROC = 0.05;

/** 扫视的范围半径。传递给lookAt的值，因为不是实际的眼球移动半径，所以稍微大一点。 in degrees */
const SACCADE_RADIUS = 5.0;

const _v3A = new THREE.Vector3();
const _quatA = new THREE.Quaternion();
const _eulerA = new THREE.Euler();

/**
 *`VRMLookAt`中添加以下功能：
 *
 * 如果指定了-`userTarget`，则在用户方向上平滑
 * - 不只是眼睛，也适合头部旋转
 * - 添加眼球足球运动
 */
export class VRMLookAtSmoother extends VRMLookAt {
  /** 平滑系数 */
  public smoothFactor = 4.0;

  /** 面向用户的极限角度 in degree */
  public userLimitAngle = 90.0;

  /** 面向用户。本来就存在的`target`用于动画 */
  public userTarget?: THREE.Object3D | null;

  /** 启用/禁用扫视 */
  public enableSaccade: boolean;

  /** 扫视：Yaw */
  private _saccadeYaw = 0.0;

  /** 扫视：pitch */
  private _saccadePitch = 0.0;

  /** 该计时器等于SACCADE_IN。如果超过INTERVAL，则SACCADE_PROC的阀值 */
  private _saccadeTimer = 0.0;

  /** yaw阻尼 */
  private _yawDamped = 0.0;

  /** pitch阻尼 */
  private _pitchDamped = 0.0;

  /** firstPersonBone 旋转 Quaternion */
  private _tempFirstPersonBoneQuat = new THREE.Quaternion();

  public constructor(humanoid: VRMHumanoid, applier: VRMLookAtApplier) {
    super(humanoid, applier);

    this.enableSaccade = true;
  }

  public update(delta: number): void {
    if (this.target && this.autoUpdate) {
      // 动画视线
      // `_yaw`和`_更新pitch`
      this.lookAt(this.target.getWorldPosition(_v3A));

      // 动画指定的yaw/pitch。在此函数中保持不变
      const yawAnimation = this._yaw;
      const pitchAnimation = this._pitch;

      // 将在该帧中最终使用yaw/pitch
      let yawFrame = yawAnimation;
      let pitchFrame = pitchAnimation;

      // 面向用户
      if (this.userTarget) {
        // `_yaw`和`_更新pitch`
        this.lookAt(this.userTarget.getWorldPosition(_v3A));

        // 角度限制。如果超出`userLimitAngle`，则朝向动画中指定的方向
        if (
          this.userLimitAngle < Math.abs(this._yaw) ||
          this.userLimitAngle < Math.abs(this._pitch)
        ) {
          this._yaw = yawAnimation;
          this._pitch = pitchAnimation;
        }

        // yawDamped / pitchDamped 平滑
        const k = 1.0 - Math.exp(-this.smoothFactor * delta);
        this._yawDamped += (this._yaw - this._yawDamped) * k;
        this._pitchDamped += (this._pitch - this._pitchDamped) * k;

        // 与动画混合
        // 如果动画面向侧面的话，会尊重此结果
        const userRatio =
          1.0 -
          THREE.MathUtils.smoothstep(
            Math.sqrt(
              yawAnimation * yawAnimation + pitchAnimation * pitchAnimation
            ),
            30.0,
            90.0
          );

        // yawFrame / pitchFrame 代入
        yawFrame = THREE.MathUtils.lerp(
          yawAnimation,
          0.6 * this._yawDamped,
          userRatio
        );
        pitchFrame = THREE.MathUtils.lerp(
          pitchAnimation,
          0.6 * this._pitchDamped,
          userRatio
        );

        // 头脑灵活
        _eulerA.set(
          -this._pitchDamped * THREE.MathUtils.DEG2RAD,
          this._yawDamped * THREE.MathUtils.DEG2RAD,
          0.0,
          VRMLookAt.EULER_ORDER
        );
        _quatA.setFromEuler(_eulerA);

        const head = this.humanoid.getRawBoneNode("head")!;
        this._tempFirstPersonBoneQuat.copy(head.quaternion);
        head.quaternion.slerp(_quatA, 0.4);
        head.updateMatrixWorld();
      }

      if (this.enableSaccade) {
        // 扫视的移动方向
        if (
          SACCADE_MIN_INTERVAL < this._saccadeTimer &&
          Math.random() < SACCADE_PROC
        ) {
          this._saccadeYaw = (2.0 * Math.random() - 1.0) * SACCADE_RADIUS;
          this._saccadePitch = (2.0 * Math.random() - 1.0) * SACCADE_RADIUS;
          this._saccadeTimer = 0.0;
        }

        this._saccadeTimer += delta;

        // 扫视的移动量
        yawFrame += this._saccadeYaw;
        pitchFrame += this._saccadePitch;

        // 生效
        this.applier.applyYawPitch(yawFrame, pitchFrame);
      }

      // 因为apply已经做了，所以不需要更新
      this._needsUpdate = false;
    }

    // target不控制lookAt场景
    if (this._needsUpdate) {
      this._needsUpdate = false;
      this.applier.applyYawPitch(this._yaw, this._pitch);
    }
  }

  /** render之后再敲，把脑袋转回来*/
  public revertFirstPersonBoneQuat(): void {
    if (this.userTarget) {
      const head = this.humanoid.getNormalizedBoneNode("head")!;
      head.quaternion.copy(this._tempFirstPersonBoneQuat);
    }
  }
}
