import type React from 'react';
import { Button } from '~/components/ui/button';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const TranscriptModal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  // 背景クリックで閉じる
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // モーダル本体をクリックした場合は閉じない
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents://モーダルを閉じるだけなので、キーボード操作は考慮しない
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[800px] max-h-[600px] overflow-y-auto relative">
        <Button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </Button>
        {children}
      </div>
    </div>
  );
};

export default TranscriptModal;
