import axios from "axios";
import { toBase64 } from "js-base64";

import { CollaboflowConfig, getCollaboflowConfig } from "./getCollaboflowConfig";

// cspell:ignoreRegExp \/apikey:

const makeAuthHeader = (config: CollaboflowConfig) => {
    return {
        "X-Collaboflow-Authorization":
            "Basic " + toBase64(`${config.userId}/apikey:${config.apiKey}`),
    };
};

/**
 * 帳票出力（β版）
 * @param appCd アプリケーションコード
 * @param documentId 文書 ID
 * @param printId 帳票 ID
 */
export const fetchPdfDocument = async (
    appCd: number,
    documentId: number,
    printId: number
): Promise<ArrayBuffer> => {
    const config = await getCollaboflowConfig();

    // PDF のバイナリーデータが返る
    const response = await axios.post<ArrayBuffer>(
        `${config.endpoint}/v1/documents/${documentId}/prints/${printId}?app_cd=${appCd}`,
        null,
        {
            headers: {
                Accept: "application/pdf",
                ...makeAuthHeader(config),
            },
            responseType: "arraybuffer",
        }
    );

    return response.data;
};
