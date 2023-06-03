import '@/styles/global.scss'
import type { AppProps } from 'next/app'
import MiTheme from '@/styles/MiTheme'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@mui/material/styles'
import { useScrollTrigger } from '@mui/material'
import { SessionProvider } from "next-auth/react"

import ScrollToTop from './components/ScrollToTop'
import BaseLayout from './components/Layout'
import "reflect-metadata"

export default function App({
                                Component,
                                pageProps: {
                                    session,
                                    ...pageProps
                                }
}: AppProps) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100
    })
  return (
      <ThemeProvider theme={MiTheme}>
        <SessionProvider session={session}>
            <ToastContainer />
            <BaseLayout
                backgroundImageUrl={
                    '/images/Fantasy_World.png'
                }>
                <ScrollToTop show={trigger} />
                <Component {...pageProps} />
            </BaseLayout>
        </SessionProvider>
      </ThemeProvider>
  )
}

