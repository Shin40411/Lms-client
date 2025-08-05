import { CONFIG } from 'src/global-config';
import { CourseListView } from 'src/sections/course/view/course-list-view';


// ----------------------------------------------------------------------

const metadata = { title: `Khóa học - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CourseListView />
    </>
  );
}
