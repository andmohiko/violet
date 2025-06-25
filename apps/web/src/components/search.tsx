import React, { useState } from 'react';

type Transcript = {
  id: string;
  audioUrl: string;
  text: string;
  createdAt?: any;
  uploadedBy?: string;
};

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
        const d =
          typeof t.createdAt === 'string'
            ? t.createdAt
            : t.createdAt.toDate
              ? t.createdAt.toDate().toISOString()
              : new Date(t.createdAt).toISOString();
        return d.startsWith(date);
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
      <button onClick={handleSearch}>検索</button>
    </div>
  );
};

export default Search;
