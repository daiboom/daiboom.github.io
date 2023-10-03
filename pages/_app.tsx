import Layout from '@/components/layout/layout'
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'

import '@/pages/globals.scss'
import '@/pages/slide.scss'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider>
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </ChakraProvider>
  )
}
