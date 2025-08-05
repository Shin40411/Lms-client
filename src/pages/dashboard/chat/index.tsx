import { CONFIG } from 'src/global-config';

import { ChatView } from 'src/sections/chat/view';

// ----------------------------------------------------------------------

const metadata = { title: `Trò chuyện trực tuyến - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ChatView />
    </>
  );
}
