import type React from 'react';
import Modal from '~/components/Modal';
import { TranscriptDetail } from '~/components/TranscriptDetail';
import type { Transcript } from '~/types/transcripts';

interface TranscriptModalProps {
  open: boolean;
  transcript: Transcript | null;
  audioUrl?: string;
  onClose: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  open,
  transcript,
  audioUrl,
  onClose,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {transcript && (
        <TranscriptDetail transcript={transcript} audioUrl={audioUrl} />
      )}
    </Modal>
  );
};
