import type React from 'react';
import { Button } from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { formatDate } from '~/utils/formatDate';
import type { TranscriptTableProps } from '~/types/transcriptsTableProps';

const cellClass = 'px-6 py-3';

export const TranscriptTable: React.FC<TranscriptTableProps> = ({
  transcripts,
  audioUrls,
  onRowClick,
}) => {
  if (transcripts.length === 0) {
    return <p>該当するデータがありません</p>;
  }

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className={cellClass}>アップロード日時</TableHead>
          <TableHead className={cellClass}>アップロード者</TableHead>
          <TableHead className={cellClass}>文字起こし</TableHead>
          <TableHead className={cellClass}>音声ファイル</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transcripts.map((t) => (
          <TableRow
            key={t.id}
            onClick={() => onRowClick(t)}
            className="cursor-pointer hover:bg-gray-100 h-16"
          >
            <TableCell className={cellClass}>
              {formatDate(t.createdAt)}
            </TableCell>
            <TableCell className={cellClass}>{t.uploadedBy ?? '-'}</TableCell>
            <TableCell className={cellClass}>
              <div className="line-clamp-2 max-w-xs">{t.text}</div>
            </TableCell>
            <TableCell className={cellClass}>
              {audioUrls[t.id] ? (
                <Button
                  asChild
                  variant="secondary"
                  className="p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a href={audioUrls[t.id]}>ダウンロード</a>
                </Button>
              ) : (
                '-'
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
