import type React from 'react';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/utils/formatDate';
import type { Transcript } from '~/types/transcripts';

type TranscriptDetailProps = {
  transcript: Transcript;
  audioUrl?: string;
};

export const TranscriptDetail: React.FC<TranscriptDetailProps> = ({
  transcript,
  audioUrl,
}) => {
  return (
    <div>
      <div className="mb-2 font-bold">アップロード日時</div>
      <div className="mb-4">{formatDate(transcript.createdAt)}</div>

      <div className="mb-2 font-bold">アップロード者</div>
      <div className="mb-4">{transcript.uploadedBy ?? '-'}</div>

      <div className="mb-2 font-bold">文字起こし</div>
      <div className="mb-4 whitespace-pre-line leading-loose">
        {transcript.text}
      </div>

      <div className="mb-2 font-bold">音声ファイル</div>
      <Button
        type="button"
        asChild
        variant="secondary"
        className="p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {audioUrl ? (
          <a
            href={audioUrl}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            ダウンロード
          </a>
        ) : (
          '-'
        )}
      </Button>
    </div>
  );
};
