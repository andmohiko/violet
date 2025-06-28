'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useFirestore } from '~/providers/DbProvider';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/lib/firebase';
import type { Transcript } from '~/types/transcripts';
import Search from '~/components/search';
import Modal from '~/components/Modal';
import { Button } from '~/components/ui/button';
import { useAuthGuard } from '~/hooks/useAuthGuard';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const cellClass = 'px-6 py-3';

const ListPage = () => {
  const { getAllDocuments } = useFirestore();
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [filtered, setFiltered] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [id: string]: string }>({});
  const [searched, setSearched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<Transcript | null>(null);

  const getAudioDownloadUrl = useCallback(async (path: string) => {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  }, []);

  const handleSearch = (results: Transcript[]) => {
    setFiltered(results);
    setSearched(true);
    setOpenId(null);
  };

  const formatDate = (date?: { toDate?: () => Date } | Date | string) => {
    if (!date) return '-';
    if (
      typeof date === 'object' &&
      date !== null &&
      'toDate' in date &&
      typeof date.toDate === 'function'
    ) {
      // Timestamp型
      return date.toDate().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    }
    if (date instanceof Date) {
      // Date型
      return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    }
  };
  useEffect(() => {
    const fetchTranscripts = async () => {
      setLoading(true);
      const docs = await getAllDocuments('transcripts');
      const data = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transcript[];
      setTranscripts(data);
      setLoading(false);
    };
    fetchTranscripts();
  }, [getAllDocuments]);

  useEffect(() => {
    // transcriptsが変わるたびにURLを取得
    const fetchUrls = async () => {
      const urls: { [id: string]: string } = {};
      for (const t of transcripts) {
        if (t.storagePath) {
          try {
            urls[t.id] = await getAudioDownloadUrl(t.storagePath);
          } catch {
            urls[t.id] = '';
          }
        }
      }
      setAudioUrls(urls);
    };
    fetchUrls();
  }, [transcripts, getAudioDownloadUrl]);

  useEffect(() => {
    if (!searched) setFiltered(transcripts);
  }, [transcripts, searched]);

  return (
    <div className="flex justify-between">
      <div className="mr-4">
        {(searched ? filtered : transcripts).length === 0 ? (
          <p>該当するデータがありません</p>
        ) : (
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
              {(searched ? filtered : transcripts).map((t) => (
                <TableRow
                  key={t.id}
                  onClick={() => {
                    setModalTarget(t);
                    setModalOpen(true);
                  }}
                  className={`cursor-pointer ${modalTarget?.id === t.id && modalOpen ? 'bg-gray-100' : ''} h-16 `}
                >
                  <TableCell className={cellClass}>
                    {formatDate(t.createdAt)}
                  </TableCell>
                  <TableCell className={cellClass}>
                    {t.uploadedBy ?? '-'}
                  </TableCell>
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
        )}
      </div>
      <div className="ml-10">
        <Search transcripts={transcripts} onResult={handleSearch} />
      </div>
      {/* モーダル */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalTarget && (
          <div>
            <div className="mb-2 font-bold">アップロード日時</div>
            <div className="mb-4">{formatDate(modalTarget.createdAt)}</div>
            <div className="mb-2 font-bold">アップロード者</div>
            <div className="mb-4">{modalTarget.uploadedBy ?? '-'}</div>
            <div className="mb-2 font-bold">文字起こし</div>
            <div className="mb-4 whitespace-pre-line leading-loose">
              {modalTarget.text}
            </div>
            <div className="mb-2 font-bold">音声ファイル</div>
            <Button
              asChild
              variant="secondary"
              className="p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {audioUrls[modalTarget.id] ? (
                <a
                  href={audioUrls[modalTarget.id]}
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
        )}
      </Modal>
    </div>
  );
};

export default ListPage;
