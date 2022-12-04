import { SSM } from "@aws-sdk/client-ssm";

export const getSsmSecretString = async (path: string): Promise<string | undefined> => {
    const ssm = new SSM({});
    const output = await ssm.getParameter({
        Name: path,
        WithDecryption: true,
    });
    return output.Parameter?.Value ?? undefined;
};
