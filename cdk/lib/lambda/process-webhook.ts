import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";

import { CollaboflowWebhookPayload } from "./collaboflow-types";
import { fetchPdfDocument } from "@/utils/fetchPdfDocument";
import { parseBody } from "@/utils/parseBody";
import { uploadDropbox } from "@/utils/uploadDropbox";

/**
 * API Gateway 呼び出し
 */
export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
    const payload = parseBody<CollaboflowWebhookPayload>(event);

    console.debug("Webhook Incoming", {
        payload,
    });

    if (!payload) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Payload is missing",
            }),
        };
    }

    // 申請完了イベント以外は処理対象外
    if (payload.action_type !== "end") {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Action '${payload.action_type}' is unsupported`,
            }),
        };
    }

    const filePath = `/${payload.document_number}.pdf`;

    console.info("Fetch PDF", { documentId: payload.document_id });
    // 帳票設定「帳票ID:1」決め打ち
    const printId = 1;
    const pdfData = await fetchPdfDocument(payload.app_cd, payload.document_id, printId);

    console.info("Upload Dropbox");
    const fileId = await uploadDropbox(filePath, pdfData);

    console.info("Upload Success", { filePath, fileId });

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    };
};
