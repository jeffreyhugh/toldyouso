import Head from "next/head"
import Layout from "../components/layout"

const Privacy = () => {
    return (
        <>
            <Head>
                <meta name="og:title" content={"told-you.so"} />
                <meta name="og:description" content={"a time capsule for messages 🔮"} />
                <meta name="og:type" content={"website"} />
                <meta name="og:url" content={"https://told-you.so"} />
                <meta name="theme-color" content={"#7c3aed"} />
            </Head>
            <div className={"w-full dark:text-white text-lg"}>
                By using this website, you affirm you are at least 18 years of age and agree to let me do whatever I want with your data. If you do not want me to read your data, encrypt it before you send it.
                <div className={"mt-8"} />
                I store message ID, submission times, IP addresses, and the message itself. If the message is unencrypted, <span className={"font-bold"}>it is stored in plaintext in the DB</span>.
                <div className={"mt-8"} />
                I cooperate fully with law enforcement. Such requests can be emailed to <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="mailto:q@queue.bot">q@queue.bot</a>.
            </div>
        </>
    )
}

export default Privacy