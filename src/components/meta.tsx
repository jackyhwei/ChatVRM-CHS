import { buildUrl } from "@/utils/buildUrl";
import Head from "next/head";
export const Meta = () => {
  const title = "小落同学 - ChatVRM-CN";
  const description = "仅通过Web浏览器就可以通过麦克风、文本输入、语音合成来享受与3D角色的对话。还可以更改角色（VRM）、设定性格、调整声音。";
  const imageUrl = "https://pixiv.github.io/ChatVRM/ogp.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

    </Head>
  );
};
