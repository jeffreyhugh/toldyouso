import Layout from "../components/layout"

const About = () => {
    return (
        <Layout>
            <div className={"w-full dark:text-white text-lg"}>
                told-you.so was a quick project to learn TailwindCSS and Next.js/Vercel serverless functions.
                Unfortunately, the serverless functions didn't make it into the final build because I couldn't figure out how to reuse existing DB connections.
                After about 4-5 test predictions, AWS RDS would inform me that the remaining connections were reserved for administrative use, leaving me to realize the serverless instances were 1) not sharing connections, and 2) not ending the connection after the function finished executing.
                To work around this issue, I just spun up an API in Go and hosted it on my own server.
                <div className={"mt-8"} />
                Password encryption is done client-side with AES-256. The cyphertext is sent and stored on the server, and the server never stores (or knows) the password.
                Prediction receivers should be sent the password over another channel, otherwise they will not be able to see the prediction.
                <div className={"mt-8"} />
                For the ultimate "I told you so," use <a href="https://web.archive.org" className={"underline"}>archive.org</a> after getting redirected to the prediction.
                Archive.org will not be able to see the prediction, but the time it was submitted will remain part of history forever.
                <div className={"mt-8"} />
                The code is available on GitHub (link under the tagline).
                Please submit a pull request if you think there's something missing.
            </div>
        </Layout>
    )
}

export default About