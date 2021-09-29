import '../styles/global.css'
import { useState } from 'react'
import Layout from "../components/layout";


export default function App({ Component, pageProps }) {
    const [isDark, setDark] = useState(true);
    return <Layout isDark={isDark} setDark={setDark}>
        <Component {...pageProps} />
    </Layout>
}