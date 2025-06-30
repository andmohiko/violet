import type { NextPage } from 'next';
import { ModeToggle } from '~/components/ui/ModeToggle';
import { SimpleLayout } from '~/components/Layouts/SimpleLayout';

const IndexPage: NextPage = () => {
  return (
    <div className="bg-background text-foreground">
      <h1>テンプレート</h1>
      <p>だんらく</p>
      <span>すぱん</span>
      <span>すぱーん</span>
    </div>
  );
};

export default IndexPage;
