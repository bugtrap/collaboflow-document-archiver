// cspell:ignore takeback loginid

type ISODateTime = string;

/** 申請の進行状況 */
export type WebhookFlowStatus = "flow" | "decision" | "remand" | "reject" | "takeback";

/** 通知種別 */
export type WebhookActionType =
    | "request"
    | "takeback"
    | "receive"
    | "accept"
    | "confirm"
    | "deny"
    | "reject"
    | "remand"
    | "end";

export type RequestUser = {
    id: string;
    loginid: string;
    name: string;
    email?: string;
};

export type RequestGroup = {
    id: string;
    code: string;
    name: string;
};

type PartsData = {
    type: string;
    value?: string;
    label?: string;
    checked?: boolean;
    link?: string;
};

type WebhookContents = {
    [partsId: string]: PartsData;
};

/**
 * Webhook 申請状況の通知 Webhook ペイロード
 */
export type CollaboflowWebhookPayload = {
    /** 通知 ID */
    id: string;
    /** 申請の進行状況 */
    flow_status: WebhookFlowStatus;
    /** 通知種別 */
    action_type: WebhookActionType;
    /** コラボフローのアプリケーションコード */
    app_cd: number;
    /** 経路 ID */
    process_id: number;
    /** フォーム ID */
    form_id: number;
    /** フォームの版番号 */
    form_version: number;
    /** 文書ID */
    document_id: number;
    /** 文書番号 */
    document_number: string;
    /** 文書タイトル */
    document_title: string;
    /** 作成日時 */
    request_date: ISODateTime;
    /** 完了日時 */
    end_date: ISODateTime;
    /** 申請者 */
    request_user: RequestUser;
    /** 申請部署 */
    request_group: RequestGroup;
    /** 申請書データ */
    contents?: WebhookContents;
};
