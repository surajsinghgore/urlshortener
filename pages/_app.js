import '@/styles/globals.css'
import { ToastProvider, useToasts } from 'react-toast-notifications';

export default function App({ Component, pageProps }) {

  return <ToastProvider><Component {...pageProps} /></ToastProvider>
}
