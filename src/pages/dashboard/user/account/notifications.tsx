import { CONFIG } from 'src/global-config';

import { AccountNotificationsView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Thông báo - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AccountNotificationsView />
    </>
  );
}
