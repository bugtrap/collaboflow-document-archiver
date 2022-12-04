# コラボフロー API 活用サンプル - Document Archiver

このリポジトリは [コラボフロー Advent Calendar 2022](https://qiita.com/advent-calendar/2022/collaboflow) の 5 日目で公開した記事のソースコード一式になります。

## 概要

[コラボフロー REST API ＞帳票出力](http://docs.collaboflow.com/api-docs/#/Document/outputPrint) の活用例として、申請が完了したら自動的に Dropbox に PDF ドキュメントとして保存するサンプル＋インフラ構築コードです。

### NOTE

- 帳票設定「帳票 ID:1」の形式で保存する決め打ち対応です。
- サンプル作成時点で β 版の API を利用しています。将来変更になる可能性があります。

## インフラ

AWS 上に API Gateway + Lambda で作るサーバーレス構成となっています。また、認証情報の設定に Systems Manager のパラメータストアを利用しています。

## AWS デプロイ

### 準備

- `npm install -g aws-cdk` で AWS CDK CLI をインストールします。
- [AWS アカウントのブーストラップ](https://aws.amazon.com/jp/getting-started/guides/setup-cdk/module-two/) を完了ます。

### コマンド

```shell
npm i
npm run bootstrap
npm run cdk:deploy
```

デプロイが完了すると `DocumentArchiver.WebhookURL` として Webhook を受け付ける URL が出力されます。
コラボフローの設定で利用するのでメモします。

## 各種設定

それぞれ以下のドキュメントを参照して準備します。

- [コラボフローの設定](./docs/config-collaboflow.md)
- [Dropbox アプリの作成](./docs/config-dropbox.md)
