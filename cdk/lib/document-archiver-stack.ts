import { join } from "path";

import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
    AccessLogFormat,
    EndpointType,
    LambdaIntegration,
    LogGroupLogDestination,
    MethodLoggingLevel,
    RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class DocumentArchiverStack extends Stack {
    private restApi: RestApi;
    private webhookLambda: NodejsFunction;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        this.buildWebhookIncomingLambda();
        this.buildApiGateway();

        // エンドポイントを出力
        new CfnOutput(this, "WebhookURL", {
            value: `${this.restApi.url}/webhook-event`,
        });
    }

    /**
     * コラボフローからの Webhook イベント受信・処理 Lambda の構築
     */
    private buildWebhookIncomingLambda() {
        const role = new Role(this, "WebhookLambdaRole", {
            assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
                ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
            ],
        });

        this.webhookLambda = new NodejsFunction(this, "WebhookLambda", {
            runtime: Runtime.NODEJS_16_X,
            entry: join(__dirname, "lambda/process-webhook.ts"),
            handler: "handler",
            timeout: Duration.seconds(25),
            role,
            logRetention: RetentionDays.ONE_WEEK,
            environment: {
                SSM_PATH_COLLABOFLOW: "/document-archiver/collaboflow-config",
                SSM_PATH_DROPBOX: "/document-archiver/dropbox-config",
            },
        });
    }

    /**
     * API Gateway HTTP API エンドポイントの構築
     */
    private buildApiGateway() {
        const accessLog = new LogGroup(this, "ApiAccessLog", {
            logGroupName: `${this.stackName}/ApiAccessLog`,
            retention: RetentionDays.ONE_WEEK,
        });

        const accessLogFormat = {
            requestId: "$context.requestId",
            requestTime: "$context.requestTime",
            ip: "$context.identity.sourceIp",
            httpMethod: "$context.httpMethod",
            resourcePath: "$context.resourcePath",
            status: "$context.status",
            protocol: "$context.protocol",
            responseLength: "$context.responseLength",
            integrationError: "$context.integration.error",
            integrationStatus: "$context.integration.status",
        };

        this.restApi = new RestApi(this, "Api", {
            endpointTypes: [EndpointType.REGIONAL],
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new LogGroupLogDestination(accessLog),
                accessLogFormat: AccessLogFormat.custom(JSON.stringify(accessLogFormat)),
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
        });

        // POST /webhook-event で受け付ける
        const webhookEvent = this.restApi.root.addResource("webhook-event");
        webhookEvent.addMethod(
            "POST",
            new LambdaIntegration(this.webhookLambda, {
                proxy: true,
                timeout: this.webhookLambda.timeout,
            })
        );
    }
}
