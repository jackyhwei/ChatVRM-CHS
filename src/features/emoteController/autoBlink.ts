import { VRMExpressionManager } from "@pixiv/three-vrm";
import { BLINK_CLOSE_MAX, BLINK_OPEN_MAX } from "./emoteConstants";

/**
 * 控制自动眨眼的类
 */
export class AutoBlink {
  private _expressionManager: VRMExpressionManager;
  private _remainingTime: number;
  private _isOpen: boolean;
  private _isAutoBlink: boolean;

  constructor(expressionManager: VRMExpressionManager) {
    this._expressionManager = expressionManager;
    this._remainingTime = 0;
    this._isAutoBlink = true;
    this._isOpen = true;
  }

  /**
   * 打开/关闭自动眨眼。
   *
   * 闭着眼睛（blink是1）的时候放入感情表现的话会变得不自然
   * 返回到眼睛睁开为止的秒，等待那个时间之后适用感情表现。
   * @param isAuto
   * @returns眼睛打开前的秒
   */
  public setEnable(isAuto: boolean) {
    this._isAutoBlink = isAuto;

    // 闭着眼睛时，返回到眼睛睁开为止的时间
    if (!this._isOpen) {
      return this._remainingTime;
    }

    return 0;
  }

  public update(delta: number) {
    if (this._remainingTime > 0) {
      this._remainingTime -= delta;
      return;
    }

    if (this._isOpen && this._isAutoBlink) {
      this.close();
      return;
    }

    this.open();
  }

  private close() {
    this._isOpen = false;
    this._remainingTime = BLINK_CLOSE_MAX;
    this._expressionManager.setValue("blink", 1);
  }

  private open() {
    this._isOpen = true;
    this._remainingTime = BLINK_OPEN_MAX;
    this._expressionManager.setValue("blink", 0);
  }
}
