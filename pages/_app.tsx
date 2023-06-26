import React from 'react'
import { AppProps } from 'next/app'
import { DefaultLayout } from "../layouts/DefaultLayout";
import '../styles/index.css'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
      <style jsx global>
        {`
        body {
          overscroll-behavior: contain;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: #a99cbc;
          border-radius: 6px;
          height: 30%;
        }
      `}
      </style>
    </>
  )
}
export default MyApp