import React from 'react'
import Head from 'next/head'
import { UserContextWrap } from '../contexts/UserContext'
import reducer,{initialState} from "../contexts/userReducer"
import { SessionProvider } from "next-auth/react"
import Script from 'next/script'
import Router from "next/router"
import NProgress from "nprogress"
import { ChakraProvider } from '@chakra-ui/react'
// import "../styles/login.css"

function MyApp({ Component, pageProps}) {
  Router.events.on("routeChangeStart",(url)=>{
    NProgress.start()
  })

  Router.events.on("routeChangeComplete",(url)=>{
    NProgress.done(true)
  })

  return (
    <SessionProvider session={pageProps.session}>
      <UserContextWrap reducer={reducer} intialState={initialState} >
        <Head>
          <title>Agile Management</title>
          <link rel="icon" href="/agile.jpg" />
          {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous" /> */}
          {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" rel="stylesheet" /> */}
        </Head>
        <div>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </div>
        <>
          {/* <Script  src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossOrigin="anonymous"></Script> */}
          {/* <Script  src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossOrigin="anonymous"></Script> */}
          {/* <Script  src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossOrigin="anonymous"></Script> */}
        </>
      </UserContextWrap>
    </SessionProvider>
  )
}

export default MyApp
