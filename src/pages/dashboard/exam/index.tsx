import { CONFIG } from 'src/global-config';
import { ExamListView } from 'src/sections/exam/view/exam-list-view';
// ----------------------------------------------------------------------

const metadata = { title: `Bài thi - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ExamListView />
    </>
  );
}
