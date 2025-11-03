import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/workspace/overview',
    permanent: false,
  },
});

export default function AppIndexRedirect() {
  return null;
}
