import { MessageInput } from "@/components/messageInput";
import { useState, useEffect, useCallback } from "react";

type Props = {
  isChatProcessing: boolean;
  onChatProcessStart: (text: string) => void;
};

/**
 * 提供文本输入和语音输入
 * 完成语音识别时自动发送，生成回复语句时禁用输入
 */
export const MessageInputContainer = ({
  isChatProcessing,
  onChatProcessStart,
}: Props) => {
  const [userMessage, setUserMessage] = useState("");
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition>();
  const [isMicRecording, setIsMicRecording] = useState(false);

  // 处理语音识别结果
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setUserMessage(text);

      // 发言结束时
      if (event.results[0].isFinal) {
        setUserMessage(text);
        // 开始生成回复语句
        onChatProcessStart(text);
      }
    },
    [onChatProcessStart]
  );

  // 持续无声时也结束
  const handleRecognitionEnd = useCallback(() => {
    setIsMicRecording(false);
  }, []);

  const handleClickMicButton = useCallback(() => {
    if (isMicRecording) {
      speechRecognition?.abort();
      setIsMicRecording(false);

      return;
    }

    speechRecognition?.start();
    setIsMicRecording(true);
  }, [isMicRecording, speechRecognition]);

  const handleClickSendButton = useCallback(() => {
    onChatProcessStart(userMessage);
  }, [onChatProcessStart, userMessage]);

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    // Firefox等SpeechRecognition非对应环境对策
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults=true;  //在识别过程中返回结果
    recognition.continuous=false;     //发言结束时结束认识

    recognition.addEventListener("result", handleRecognitionResult);
    recognition.addEventListener("end", handleRecognitionEnd);

    setSpeechRecognition(recognition);
  }, [handleRecognitionResult, handleRecognitionEnd]);

  useEffect(() => {
    if (!isChatProcessing) {
      setUserMessage("");
    }
  }, [isChatProcessing]);

  return (
    <MessageInput
      userMessage={userMessage}
      isChatProcessing={isChatProcessing}
      isMicRecording={isMicRecording}
      onChangeUserMessage={(e) => setUserMessage(e.target.value)}
      onClickMicButton={handleClickMicButton}
      onClickSendButton={handleClickSendButton}
    />
  );
};
