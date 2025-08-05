import { CONFIG } from 'src/global-config';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tổng quan - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <OverviewAppView />
    </>
  );
}
