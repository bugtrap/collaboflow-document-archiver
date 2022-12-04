import "source-map-support/register";
import { App } from "aws-cdk-lib";

import { DocumentArchiverStack } from "./lib/document-archiver-stack";

const app = new App({
    context: {
        appPrefix: "develop",
    },
});
new DocumentArchiverStack(app, "DocumentArchiver", {
    env: { region: "ap-northeast-1" },
});

app.synth();
