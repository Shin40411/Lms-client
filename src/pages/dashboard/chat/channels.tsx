import { CONFIG } from 'src/global-config';
import { ChatChannelsView } from 'src/sections/chat/view';


// ----------------------------------------------------------------------

const metadata = { title: `Kênh học tập trực tuyến - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ChatChannelsView />
    </>
  );
}
