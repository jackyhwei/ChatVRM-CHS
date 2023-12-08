import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";
/**
 * 控制视线的类
 *
 * 因为足球是在VRMLookAtSmoother中进行的
 * 想要将视线移动得更大时，在这里安装。
 */
export class AutoLookAt {
  private _lookAtTarget: THREE.Object3D;
  constructor(vrm: VRM, camera: THREE.Object3D) {
    this._lookAtTarget = new THREE.Object3D();
    camera.add(this._lookAtTarget);

    if (vrm.lookAt) vrm.lookAt.target = this._lookAtTarget;
  }
}
