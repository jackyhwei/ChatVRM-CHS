import { Configuration, OpenAIApi } from "openai";
import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  // ブラウザからAPIを叩くときに発生するエラーを無くすworkaround
  // https://github.com/openai/openai-node/issues/6#issuecomment-1492814621
  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);

  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", // Qwen-7B-Chat, gpt-3.5-turbo
    messages: messages,
  });

  const [aiRes] = data.choices;
  const message = aiRes.message?.content || "发生错误2";

  return { message: message };
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string
) {
  if (!apiKey) {
    console.log("Invalid API Key");
    apiKey = "sk-jEVBsZOasELDM8ROWhYoDsPp3uaFKcac1XDuHtkibhfwhzBB";
    //throw new Error("Invalid API Key");
  }

  console.log("adfasdfasdf");

  // 通义千问
  //apiKey = "sk-cCwAxfqbrU2DlKVIA6B36b75B4924eE09e9eCbD378B7B3Be";
  //const url = "http://58.215.177.171:6020/v1/chat/completions"; //"https://openkey.cloud/v1/chat/completions"; //https://api.openai.com/v1/chat/completions
  //const model = "Qwen-7B-Chat";

  // ChatGPT
  apiKey = "sk-jEVBsZOasELDM8ROWhYoDsPp3uaFKcac1XDuHtkibhfwhzBB";
  const url = "https://openkey.cloud/v1/chat/completions"; //https://api.openai.com/v1/chat/completions
  const model = "gpt-3.5-turbo"; // "Qwen-7B-Chat", gpt-3.5-turbo, gpt-3.5-turbo-3.5-turbo

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const res = await fetch(url, {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      model: model, 
      messages: messages,
      stream: true,
      max_tokens: 200,
    }),
  });

  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }

  console.log("adfasdfas");

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            console.log("json=%s", chunk);

            const messagePiece = json.choices[0].delta.content;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}

export async function getChatResponseStream2(
  messages: Message[],
  apiKey: string
) {
  if (!apiKey) {
    //throw new Error("Invalid API Key");
    console.log("Invalid API Key");
    apiKey = "sk-jEVBsZOasELDM8ROWhYoDsPp3uaFKcac1XDuHtkibhfwhzBB";
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const url = "https://openkey.cloud/v1/chat/completions"; //https://api.openai.com/v1/chat/completions
  const res = await fetch(url, {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo", //Qwen-7B-Chat, gpt-3.5-turbo, gpt-3.5-turbo-3.5-turbo
      messages: messages,
      stream: true,
      max_tokens: 200,
    }),
  });

  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            const messagePiece = json.choices[0].delta.content;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
