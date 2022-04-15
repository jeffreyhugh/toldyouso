import '../styles/global.css';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import * as gtag from '../lib/gtag';
import Router from 'next/router';

export default function App({ Component, pageProps }) {
  const [isDark, setDark] = useState(true);

  // useEffect(() => {
  //     const handleRouteChange = (url) => {
  //         gtag.pageview(url);
  //     };
  //     Router.events.on('routeChangeComplete', handleRouteChange);
  //     return () => {
  //         Router.events.off('routeChangeComplete', handleRouteChange);
  //     };
  // }, []);

  return (
    <Layout isDark={isDark} setDark={setDark}>
      <Component {...pageProps} />
    </Layout>
  );
}
