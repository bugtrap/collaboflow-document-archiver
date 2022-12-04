# コラボフローの設定

## フォームの準備

フォームを用意したら [オプション製品ガイド＞帳票出力オプション](https://collaboflow.zendesk.com/hc/ja/articles/360000420696) にある帳票設定で出力形式に PDF を設定した帳票を登録します。

## 経路の準備

上記フォームを利用した申請経路を作成します。続いて [経路の Webhook 設定](https://collaboflow.zendesk.com/hc/ja/articles/360001531035) を設定します。

設定内容は以下の通りです。

| 項目                | 設定値                                                          |
| ------------------- | --------------------------------------------------------------- |
| Webhook 名          | 任意                                                            |
| 通知先の Webhook 名 | `DocumentArchiver.WebhookURL` の値                              |
| 通知条件            | 経路終了時: 申請書の経路終了時に通知する のみにチェックを付ける |

## API キーの発行

[システム管理者ガイド＞環境設定](https://collaboflow.zendesk.com/hc/ja/articles/360000163355) の REST API 項目で API キーを発行します。
後ほど使うのでメモします。

# AWS Systems Manager パラメータストアに登録

安全な文字列タイプ (SecureString) として以下のパスで値を登録します。

- パス: `/document-archiver/collaboflow-config`

```json
{
  "endpoint": "https://cloud.collaboflow.com/{契約URL}/api/index.cfm",
  "userId": "APIの実行ユーザーID",
  "apiKey": "発行したAPIキー"
}
```
