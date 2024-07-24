import '../styles/globals.css';
import type { AppProps } from 'next/app';
import "./globals.css";
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../app/chakra/theme';


function MyApp({ Component, pageProps }: AppProps) {
  return (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
  )
}

export default MyApp;