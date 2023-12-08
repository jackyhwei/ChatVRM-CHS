import getConfig from "next/config";

/**
 *为了在发布到github pages时导入资产
 *查看环境变量并将存储库名称添加到URL
 */
export function buildUrl(path: string): string {
  const {
    publicRuntimeConfig,
  }: {
    publicRuntimeConfig: { root: string };
  } = getConfig();

  return publicRuntimeConfig.root + path;
}
