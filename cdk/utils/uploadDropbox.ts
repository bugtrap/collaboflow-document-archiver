import { Dropbox } from "dropbox";

import { getDropboxConfig } from "./getDropboxConfig";

/**
 * Dropbox にアップロード
 * @param path アップロードのファイルパス
 * @param contents バイナリーデータ
 * @returns ファイル ID
 */
export const uploadDropbox = async (path: string, contents: ArrayBuffer): Promise<string> => {
    const config = await getDropboxConfig();
    const dbx = new Dropbox({ accessToken: config.accessToken });
    const response = await dbx.filesUpload({
        path,
        contents,
    });
    return response.result.id;
};
