'use client';
import { TranscriptModal } from '~/app/protected/list/TranscriptModal';
import { TranscriptTable } from '~/app/protected/list/TranscriptTable';
import { useTranscripts } from '~/hooks/useTranscripts';
import { useSearchTranscripts } from '~/hooks/useSearchTranscripts';
import { useModalState } from '~/hooks/useModalState';
import { TranscriptsSearchForm } from '~/app/protected/list/TranscriptsSearchForm';

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
    <div className="flex flex-col w-full">
      {/* 検索 */}
      <div className="w-full px-8 mb-8">
        <TranscriptsSearchForm
          keyword={keyword}
          setKeyword={setKeyword}
          date={date}
          setDate={setDate}
          onSearch={handleSearch}
          onReset={resetSearch}
        />
      </div>
      {/* Transcripts一覧 */}
      <div className="w-full px-8">
        <TranscriptTable
          transcripts={displayTranscripts}
          audioUrls={audioUrls}
          onRowClick={openModal}
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
