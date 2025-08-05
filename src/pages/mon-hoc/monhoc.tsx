import { CONFIG } from 'src/global-config';
import { SubjectListView } from 'src/sections/subjects/view/subject-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Môn học - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <SubjectListView />
        </>
    );
}
