/*koeiromap Free v1的限制对应的声色*/
type ReducedTalkStyle = "talk" | "happy" | "sad";

/**
 * 为koeiromap Free v1限制声色参数
 */
export const reduceTalkStyle = (talkStyle: string): ReducedTalkStyle => {
  if (talkStyle == "talk" || talkStyle == "happy" || talkStyle == "sad") {
    return talkStyle;
  }

  return "talk";
};
