import { Configuration, OpenAIApi } from "openai";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = req.body.apiKey || process.env.OPEN_AI_KEY;

  if (!apiKey) {
    res
      .status(400)
      .json({ message: "API密钥错误或未设置。" });

    return;
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);
  const model = "gpt-3.5-turbo"; //Qwen-7B-Chat, gpt-3.5-turbo
  const { data } = await openai.createChatCompletion({
    model: model,
    messages: req.body.messages,
  });

  const [aiRes] = data.choices;
  const message = aiRes.message?.content || "发生错误1";

  res.status(200).json({ message: message });
}
