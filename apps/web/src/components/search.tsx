import React, { useState } from 'react';
import type { Transcript } from '~/types/transcripts';

type Props = {
  transcripts: Transcript[];
  onResult: (results: Transcript[]) => void;
};

const Search: React.FC<Props> = ({ transcripts, onResult }) => {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    let results = transcripts;

    // 文字起こし内容で検索
    if (keyword) {
      results = results.filter((t) =>
        t.text?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    // 日付で検索（yyyy-mm-dd形式で部分一致）
    if (date) {
      results = results.filter((t) => {
        if (!t.createdAt) return false;
        let targetDate: string;
        if (t.createdAt.toDate) {
          // Firestore Timestamp型
          const d = t.createdAt.toDate();
          targetDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else if (typeof t.createdAt === 'string') {
          // 文字列型
          targetDate = t.createdAt.slice(0, 10);
        } else {
          // その他
          const d = new Date(t.createdAt);
          targetDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }
        return targetDate === date;
      });
    }

    onResult(results);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="text"
        placeholder="文字起こし検索"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button type="button" onClick={handleSearch}>
        検索
      </button>
    </div>
  );
};

export default Search;
