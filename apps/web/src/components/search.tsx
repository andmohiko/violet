import { useState } from 'react';
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
        let d: Date;
        // Timestamp型（toDateがある）ならDate型に変換
        if (
          typeof t.createdAt === 'object' &&
          t.createdAt !== null &&
          typeof (t.createdAt as { toDate?: unknown }).toDate === 'function'
        ) {
          d = (t.createdAt as { toDate: () => Date }).toDate();
        } else {
          d = new Date(t.createdAt as string | Date);
        }
        // 日付をyyyy-mm-dd形式に変換
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const targetDate = `${yyyy}-${mm}-${dd}`;
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
