import Head from "next/head"
import AdSense from "react-adsense"

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
                By using told-you.so (referred to as "the service"), you affirm you are at least 18 years of age.
                You may not use this service if you are under 18 years of age.
                <div className={"mt-8"} />
                The email address provided must be owned by you or a recipient who consents to receive an email from us on your behalf.
                Emails are sent from <code>i@told-you.so</code>.
                <div className={"mt-8"} />
                For each message, I store a unique message ID, submission time, IP address(es), the message itself, and analytical statistics.
                If the message is unencrypted, <span className={"font-bold"}>it is stored in plaintext in the DB</span>.
                I highly recommend encrypting the data client-side by setting a password.
                <div className={"mt-8"} />
                I will not sell data collected while using the service.
                However, I must collect it to cooperate fully with law enforcement, should the need arise.
                Law enforcement may send requests for data to <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="mailto:q@queue.bot">q@queue.bot</a>.
                Feel free to use my GPG key at <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="https://queue.bot/#gpg">https://queue.bot/#gpg</a>
                <div className={"mt-8"} />
                told-you.so does not store cookies.
                <div className={"mt-8"} />
                Ads are served by Google AdSense, and they reserve the right to collect data, store cookies, and more outlined by the <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="https://www.google.com/adsense/new/localized-terms">AdSense Privacy Policy</a>.
                <div className={"mt-8"} />
                For any questions about these terms, please email <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="mailto:toldyouso@queue.bot">toldyouso@queue.bot</a>.
            </div>
            <div className={"flex md:justify-center overflow-hidden w-full"} style={{ height: 200 }} aria-hidden >
                <AdSense.Google
                    client={"ca-pub-7806885462809506"}
                    slot={"1008878077"}
                    style={{ width: 350, height: 200 }}
                    format=''
                />
            </div>
        </>
    )
}

export default Privacy