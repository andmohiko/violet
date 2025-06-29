<!-- @format -->

# Firestore 設計

- [transcripts](#transcripts)

## transcripts

### 概要

```
/transcripts/{transcriptId}
```

- 音声データの書き起こし、要約データ
- ID: 自動生成
- permission
  - read: client
  - create: client
  - update: client
  - delete: client

### 詳細

- createdAt: Timestamp DBに保存された日時
- id: string {transcriptId（自動生成、ドキュメントIDと一致）}
- storagePath: string Storage上でトリガーされたファイルのフルパス
- text: string 書き起こしデータ
- transcriptTotalTokens: number 書き起こし時に使用したgeminiAPIトークン数
- uploadedBy: string アップロードしたUserのuid
- summary: 書き起こしの要約データ
- summaryTotalTokens: Number 要約時に使用したgeminiAPIトークン数
- TotalTokens: Number 書き起こし＋要約時に使用したgeminiAPIトークン数
