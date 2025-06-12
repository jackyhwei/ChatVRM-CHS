import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseStream } from "@/features/chat/openAiChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("sk-cCwAxfqbrU2DlKVIA6B36b75B4924eE09e9eCbD378B7B3Be");
  const [koeiromapKey, setKoeiromapKey] = useState("");
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("chatVRMParams")) {
      const params = JSON.parse(
        window.localStorage.getItem("chatVRMParams") as string
      );
      setSystemPrompt(params.systemPrompt ?? SYSTEM_PROMPT);
      setKoeiroParam(params.koeiroParam ?? DEFAULT_PARAM);
      setChatLog(params.chatLog ?? []);
    }
  }, []);

  useEffect(() => {
    process.nextTick(() =>
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, koeiroParam, chatLog })
      )
    );
  }, [systemPrompt, koeiroParam, chatLog]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  /*
  const changeAction = useCallback (
    (key: string) => {
      console.log("action:", key);
    },
  );
  */

  /**
   *按语句串行请求语音并播放
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, viewer, koeiromapKey, onStart, onEnd);
    },
    [viewer, koeiromapKey]
  );

  /**
   *与助理对话
   */
  const handleSendChat = useCallback(
    async (text: string) => {
      console.log("openAiKey: ", openAiKey);

      if (!openAiKey) {
        setAssistantMessage("未输入API密钥");
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      setChatProcessing(true);
      //添加并显示用户发言
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      // Chat GPT聊天
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messageLog,
      ];

      const stream = await getChatResponseStream(messages, openAiKey).catch(
        (e) => {
          console.error(e);
          return null;
        }
      );
      if (stream == null) {
        setChatProcessing(false);
        return;
      }

      const reader = stream.getReader();
      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedMessage += value;

          console.log("received message: ", receivedMessage);

          // 检测回复内容的标记部分
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            receivedMessage = receivedMessage.slice(tag.length);
          }

          console.log("received message [after sliced]: ", receivedMessage);

          //以一句话为单位进行回答处理。
          // 如果满足下面两个条件之一，就断句：
          //  1. 句子中包括了句号（ 。），点（.），感叹号(!), 问号(?)，换行符（\n）
          //  2. 句子中匹配至少10个任意字符（除了换行符），然后是逗号（,）或顿号（、）之一
          const sentenceMatch = receivedMessage.match(/^(.+[。．！？\n]|.{10,}[、,])/);

          if (sentenceMatch && sentenceMatch[0]) {
            console.log("sentence: ", sentenceMatch, "sentenceMatch[0]:", sentenceMatch[0]);
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage.slice(sentence.length).trimStart();

            //不需要说话/不可能的字符串时跳过 
            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;

            console.log("reply 1: ", aiText);

            const aiTalks = textsToScreenplay([aiText], koeiroParam);
            aiTextLog += aiText;

            //为每个句子生成和播放声音，显示回复 
            const currentAssistantMessage = sentences.join(" ");
            handleSpeakAi(aiTalks[0], () => {
              setAssistantMessage(currentAssistantMessage);
            });
          } else {

          }


        }
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      //将助手回复添加到日志
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      console.log("aiTextLog=", aiTextLog);

      setChatLog(messageLogAssistant);
      setChatProcessing(false);
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam]
  );

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      <Introduction
        openAiKey={openAiKey}
        koeiroMapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeKoeiromapKey={setKoeiromapKey}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        koeiromapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        onChangeKoeiromapKey={setKoeiromapKey}
        onChangeAction={() => {console.log("adfas")}}
      />
      
      <GitHubLink />
    </div>
  );
}
