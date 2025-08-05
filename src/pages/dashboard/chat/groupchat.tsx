import { CONFIG } from 'src/global-config';
import { ChatGroupView } from 'src/sections/chat/view/chat-group-view';
// ----------------------------------------------------------------------

const metadata = { title: `Nhóm chat trực tuyến - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ChatGroupView />
    </>
  );
}
