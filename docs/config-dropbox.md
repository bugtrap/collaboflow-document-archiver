# Dropbox でアプリを作る

[Dropbox アプリコンソール](https://www.dropbox.com/developers/apps) でアプリを作ります。

| 項目                               | 設定値               |
| ---------------------------------- | -------------------- |
| Choose an API                      | Scoped access を選択 |
| Choose the type of access you need | App folder を選択    |
| Name your app                      | 任意                 |

## パーミッション

作成後に Permissions タブで以下のパーミッションを有効にします。

- files.content.write
- files.content.read

## アクセストークン生成

Settings タブに戻り、OAuth 2 項目の Generated access token にある「Generate」をクリックして生成します。
このアクセストークンは再表示出来ないようなので、メモしておきます。

# AWS Systems Manager パラメータストアに登録

安全な文字列タイプ (SecureString) として以下のパスで値を登録します。

- パス: `/document-archiver/dropbox-config`

```json
{ "accessToken": "メモしたアクセストークン文字列" }
```
