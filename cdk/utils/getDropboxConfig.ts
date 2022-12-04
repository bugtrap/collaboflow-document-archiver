import { getSsmSecretString } from "./getSsmSecretString";

type DropboxConfig = {
    accessToken: string;
};

export const getDropboxConfig = async (): Promise<DropboxConfig> => {
    const ssmPath = process.env.SSM_PATH_DROPBOX;
    if (!ssmPath) {
        throw new Error("SSM_PATH_DROPBOX is missing");
    }

    const text = await getSsmSecretString(ssmPath);
    if (!text) {
        throw new Error("Dropbox Configuration is missing.");
    }

    return JSON.parse(text);
};
