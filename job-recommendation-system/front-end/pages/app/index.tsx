import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/app/dashboard',
    permanent: false,
  },
});

export default function AppIndexRedirect() {
  return null;
}
