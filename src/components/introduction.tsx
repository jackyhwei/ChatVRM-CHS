import { useState, useCallback } from "react";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  koeiroMapKey: string;
  onChangeAiKey: (openAiKey: string) => void;
  onChangeKoeiromapKey: (koeiromapKey: string) => void;
};
export const Introduction = ({
  openAiKey,
  koeiroMapKey,
  onChangeAiKey,
  onChangeKoeiromapKey,
}: Props) => {
  const [opened, setOpened] = useState(true);

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleKoeiromapKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

  return opened ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-M_PLUS_2">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary ">
          关于此应用程序
          </div>
          <div>
          仅通过Web浏览器就可以享受与3D角色的对话，使用麦克风、文本输入、声音合成。也可以变更角色（VRM）、设定性格、调整声音。
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            技术介绍
          </div>
          <div>
          查看和操纵三维模型
            <Link
              url={"https://github.com/pixiv/three-vrm"}
              label={"@pixiv/three-vrm"}
            />
           、口语生成
            <Link
              url={
                "https://openai.com/blog/introducing-chatgpt-and-whisper-apis"
              }
              label={"ChatGPT API"}
            />
            、语音合成
            <Link url={"https://koemotion.rinna.co.jp/"} label={"Koemotion"} />
            の
            <Link
              url={
                "https://developers.rinna.co.jp/product/#product=koeiromap-free"
              }
              label={"Koeiromap API"}
            />
            中所述修改相应参数的值。详细情况请看这边的
            <Link
              url={"https://inside.pixiv.blog/2023/04/28/160000"}
              label={"技術解説記事"}
            />
            来修改标记元素的显示属性。
          </div>
          <div className="my-16">
          本演示在GitHub上发布源代码。请自由地尝试变更和改变！
            <br />
            代码仓库：
            <Link
              url={"https://github.com/jackyhwei/ChatVRM-CN"}
              label={"https://github.com/jackyhwei/ChatVRM-CN"}
            />
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
          使用上注意
          </div>
          <div>
          不要刻意诱导歧视性或暴力性发言、贬低特定人物的发言。同时，使用VRM模型替换登场人物的时候请遵从模型的使用条件。
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
          Koeiromap API密钥
          </div>
          <input
            type="text"
            placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={koeiroMapKey}
            onChange={handleKoeiromapKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
          <div>
          请从rinna Developers发行API密钥。
            <Link
              url="https://developers.rinna.co.jp/product/#product=koeiromap-free"
              label="了解更多信息"
            />
          </div>
        </div>
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            OpenAI API密钥
          </div>
          <input
            type="text"
            placeholder="sk-..."
            value={openAiKey}
            onChange={handleAiKeyChange}
            className="my-4 px-16 py-8 w-full h-40 bg-surface3 hover:bg-surface3-hover rounded-4 text-ellipsis"
          ></input>
          <div>
            API密钥
            <Link
              url="https://platform.openai.com/account/api-keys"
              label="OpenAI网站页面信息"
            />
            中所述修改相应参数的值。请在表单中输入获取的API密钥。
          </div>
          <div className="my-16">
            ChatGPT
            API是直接从浏览器访问的。另外，API密钥和对话内容不会保存在pictive服务器中。
            <br />
            ※使用的模型是ChatGPT API（GPT-3.5）。
          </div>
        </div>
        <div className="my-24">
          <button
            onClick={() => {
              setOpened(false);
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-24 py-8 rounded-oval"
          >
            输入API密钥开始
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
