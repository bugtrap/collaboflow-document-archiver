import { APIGatewayProxyEventV2 } from "aws-lambda";
import { fromBase64 } from "js-base64";

export const parseBody = <T>(event: APIGatewayProxyEventV2): T | null => {
    if (event.body) {
        if (event.isBase64Encoded) {
            const text = fromBase64(event.body);
            return JSON.parse(text) as T;
        }
        return JSON.parse(event.body) as T;
    }
    return null;
};
