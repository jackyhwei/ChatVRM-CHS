import { IconButton } from "./iconButton";
import { Message } from "@/features/messages/messages";
import { KoeiroParam } from "@/features/constants/koeiroParam";
import { ChatLog } from "./chatLog";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Settings } from "./settings";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { AssistantText } from "./assistantText";

import { playAction } from "./playaction";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  koeiroParam: KoeiroParam;
  assistantMessage: string;
  koeiromapKey: string;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeAiKey: (key: string) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiromapParam: (param: KoeiroParam) => void;
  handleClickResetChatLog: () => void;
  handleClickResetSystemPrompt: () => void;
  onChangeKoeiromapKey: (key: string) => void;
  onChangeAction: (key: string) => void;
};
export const Menu = ({
  openAiKey,
  systemPrompt,
  chatLog,
  koeiroParam,
  assistantMessage,
  koeiromapKey,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onChangeKoeiromapParam,
  handleClickResetChatLog,
  handleClickResetSystemPrompt,
  onChangeKoeiromapKey,
  onChangeAction,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeSystemPrompt = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(event.target.value);
    },
    [onChangeSystemPrompt]
  );

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleChangeKoeiromapKey = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

  const handleChangeKoeiroParam = useCallback(
    (x: number, y: number) => {
      onChangeKoeiromapParam({
        speakerX: x,
        speakerY: y,
      });
    },
    [onChangeKoeiromapParam]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePlayAction = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      console.log("adfasdf");
    },
    [onChangeAction]
  );

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

  return (
    <>
      <div className="absolute z-10 m-24">
        <div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label="设定"
            isProcessing={false}
            onClick={() => setShowSettings(true)}
          ></IconButton>

          {/* <IconButton
            iconName="24/Menu"
            label="播放动作"
            isProcessing={false}
            onClick={() => handlePlayAction}
          ></IconButton> */}

          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label="对话历史"
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label="对话历史"
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}

          {
          /*
          <playAction onChangePlayAction = {()=> handlePlayAction()} />
          */
          }

        </div>
      </div>
      {showChatLog && <ChatLog messages={chatLog} />}
      {showSettings && (
        <Settings
          openAiKey={openAiKey}
          chatLog={chatLog}
          systemPrompt={systemPrompt}
          koeiroParam={koeiroParam}
          koeiromapKey={koeiromapKey}
          onClickClose={() => setShowSettings(false)}
          onChangeAiKey={handleAiKeyChange}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onChangeChatLog={onChangeChatLog}
          onChangeKoeiroParam={handleChangeKoeiroParam}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
          onChangeKoeiromapKey={handleChangeKoeiromapKey}
        />
      )}
      {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};
