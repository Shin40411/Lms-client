import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'IIT: Phần mềm hỗ trợ dạy học',
  description:
    'Phát triển tri thức - Hiệu quả tuyệt đối',
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />

      <HomeView />
    </>
  );
}
