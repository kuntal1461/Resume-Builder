import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/signup',
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}

