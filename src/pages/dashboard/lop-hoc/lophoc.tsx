import { CONFIG } from 'src/global-config';
import { ClassesView } from 'src/sections/classes/view/class-view';

// ----------------------------------------------------------------------

const metadata = { title: `Lớp học - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ClassesView />
        </>
    );
}
