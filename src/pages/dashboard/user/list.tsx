import { CONFIG } from 'src/global-config';

import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Người dùng - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <UserListView />
    </>
  );
}
