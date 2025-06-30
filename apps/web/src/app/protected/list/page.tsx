'use client';
import { TranscriptModal } from '~/components/TranscriptModal';
import { TranscriptTable } from '~/components/TranscriptTable';
import { useTranscripts } from '~/hooks/useTranscripts';
import { useSearchTranscripts } from '~/hooks/useSearchTranscripts';
import { useModalState } from '~/hooks/useModalState';
import { TranscriptsSearchForm } from '~/components/TranscriptsSearchForm';

const ListPage = () => {
  const { audioUrls, transcripts, loading, error } = useTranscripts();
  const {
    keyword,
    setKeyword,
    date,
    setDate,
    filtered,
    searched,
    handleSearch,
    resetSearch,
  } = useSearchTranscripts(transcripts);
  const { modalOpen, modalTarget, openModal, closeModal } = useModalState();

  // 検索結果がある場合はフィルタリングされた結果を表示、なければ全てのtranscriptを表示
  const displayTranscripts = searched ? filtered : transcripts;

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="flex justify-between">
      {/* Transcripts一覧 */}
      <div className="mr-4">
        <TranscriptTable
          transcripts={displayTranscripts}
          audioUrls={audioUrls}
          onRowClick={openModal}
        />
      </div>
      {/* 検索 */}
      <div className="ml-10">
        <TranscriptsSearchForm
          keyword={keyword}
          setKeyword={setKeyword}
          date={date}
          setDate={setDate}
          onSearch={handleSearch}
          onReset={resetSearch}
        />
      </div>
      {/* モーダル */}
      <TranscriptModal
        open={modalOpen}
        transcript={modalTarget}
        audioUrl={modalTarget ? audioUrls[modalTarget.id] : undefined}
        onClose={closeModal}
      />
    </div>
  );
};

export default ListPage;
