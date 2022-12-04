import { toBase64 } from "js-base64";

import { getSsmSecretString } from "./getSsmSecretString";

export type CollaboflowConfig = {
    endpoint: string;
    userId: string;
    apiKey: string;
};

export const getCollaboflowConfig = async (): Promise<CollaboflowConfig> => {
    const ssmPath = process.env.SSM_PATH_COLLABOFLOW;
    if (!ssmPath) {
        throw new Error("SSM_PATH_COLLABOFLOW is missing");
    }

    const text = await getSsmSecretString(ssmPath);
    if (!text) {
        throw new Error("Collaboflow Configuration is missing.");
    }

    return JSON.parse(text);
};

export const makeAuthHeader = (config: CollaboflowConfig) => {
    // cspell:ignoreRegExp \/apikey:
    return {
        "X-Collaboflow-Authorization":
            "base " + toBase64(`${config.userId}/apikey:${config.apiKey}`),
    };
};
