'use client';
import { useState } from 'react';
import type { Transcript } from '~/types/transcripts';

export const useModalState = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<Transcript | null>(null);

  const openModal = (transcript: Transcript) => {
    setModalTarget(transcript);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTarget(null);
  };

  return {
    modalOpen,
    modalTarget,
    openModal,
    closeModal,
  };
};
