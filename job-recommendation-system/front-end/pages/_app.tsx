import '../styles/globals.css';
import '../styles/auth/auth.css';
import type { AppProps } from 'next/app';
import { WorkspaceProfileProvider } from '../components/workspace/WorkspaceProfileProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WorkspaceProfileProvider>
      <Component {...pageProps} />
    </WorkspaceProfileProvider>
  );
}
