import type React from 'react';
import Modal from '~/components/modal/Modal';
import { TranscriptDetail } from '~/app/protected/list/TranscriptDetail';
import type { Transcript } from '~/types/transcripts';

type TranscriptModalProps = {
  open: boolean;
  transcript: Transcript | null;
  audioUrl?: string;
  onClose: () => void;
};

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
