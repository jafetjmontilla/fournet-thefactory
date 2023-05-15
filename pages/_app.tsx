import React from 'react'
import { AppProps } from 'next/app'
import '../styles/index.css'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
        body {
          overscroll-behavior: contain;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background: pink;
          border-radius: 6px;
          height: 50%;
        }
      `}
      </style>
    </>
  )
}
export default MyApp