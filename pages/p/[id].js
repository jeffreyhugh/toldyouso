import { useRouter } from "next/dist/client/router"
import Countdown from "react-countdown"
import useSWR from "swr"
import aes256 from "aes256"
import Head from "next/head"
import AdSense from "react-adsense"
import { useState } from "react"

const { DateTime } = require("luxon")

// export async function getServerSideProps(ctx) {
//     const { id } = ctx.query
//     const res = await fetch(`http://localhost:3000/api/fetch?id=${id}`)
//     const j = await res.json()
//     return {
//         props: {
//             availableAt: j.availableAt,
//             message: j.message,
//             encrypted: j.encrypted,
//         }
//     }
// }

const ID = () => {
    const router = useRouter()
    const { id } = router.query

    const [buttonStatus, setButtonStatus] = useState(false)

    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error } = useSWR(`https://api.queue.bot/toldyouso/v1/fetch?id=${id}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
    })

    const decryptMessage = event => {
        event.preventDefault()
        if (data) {
            const decryptedMessage = aes256.decrypt(event.target.password.value, data.message)
            document.getElementById('prediction').innerHTML = decryptedMessage
        }
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <>
                    <div>Available now!</div>
                    <button onClick={() => router.reload()} className={"px-3 py-2 text-white rounded-lg text-2xl bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none "}>Click to refresh</button>
                </>
            )

        } else {
            return (
                <>
                    <div>Available in {' '}</div>
                    <div className={"font-bold text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600"}>
                        {days > 0 ? `${days}d` : ""} {hours > 0 ? `${hours}h` : ""} {minutes > 0 ? `${minutes}m` : ""} {seconds > 0 ? `${seconds}s` : ""}
                    </div>
                </>

            )
        }
    }

    if (error) {
        return (
            <>
                <div className={"w-full dark:text-white text-4xl lowercase select-none text-center"}>error 😥</div>
            </>
        )
    } else if (!data) {
        return (
            <>
                <div className={"w-full dark:text-white text-4xl lowercase select-none text-center"}>loading <i className={"fa fa-circle-o-notch fa-spin"} aria-hidden={true} /></div>
            </>
        )
    } else {
        const aA = DateTime.fromISO(data.availableAt).toLocal()

        return (
            <>
                <Head>
                    <title>{`told-you.so - ${id}`}</title>
                    <meta name="og:title" content={"told-you.so"} />
                    <meta name="og:description" content={DateTime.fromISO(data.submittedAt).diffNow('seconds').as('seconds') > 0 ? `view this message in ${DateTime.fromISO(data.submittedAt).toLocal().toRelative()} 🔮` : `this message was stored ${DateTime.fromISO(data.submittedAt).toLocal().toRelative()} 🔮`} />
                    <meta name="og:type" content={"website"} />
                    <meta name="og:url" content={`https://told-you.so/p/${id}`} />
                    <meta name="theme-color" content={"#7c3aed"} />
                </Head>
                {
                    aA.diffNow('seconds').as('seconds') > 0 ?
                        <div className={"w-full dark:text-white text-4xl lowercase select-none text-center"}>
                            <div id={"countdown"}>
                                <Countdown date={aA.toJSDate()} renderer={renderer} />
                            </div>
                        </div>
                        :
                        <div className={"w-11/12 max-w-sm md:w-96 ml-auto mr-auto"}>
                            <div id={"prediction"} className={"w-auto break-words dark:text-white text-2xl text-left"}>
                                {data.message}
                            </div>
                            {
                                data.encrypted ?
                                    <>
                                        <div className={"mt-8"} />
                                        <form onSubmit={decryptMessage}>
                                            <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"password"}>Message password</label>
                                            <input
                                                className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"}
                                                id={"password"} type={"password"} placeholder={"secure-PASSWORD-1"} />
                                            <div className={"mt-4"} />
                                            <button className={"w-full px-3 py-2 text-white rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none disabled:cursor-not-allowed"} type={"submit"} id={"sb"}>
                                                🗝️ Decrypt
                                            </button>
                                        </form>
                                    </> :
                                    <></>
                            }
                        </div>
                }
                <div className={"mt-8"} />
                <div id={"submittedAt"} className={"w-full dark:text-white text-xl lowercase select-none text-center"}>
                    Submitted {DateTime.fromISO(data.submittedAt).toLocal().toRelative()}
                </div>
                <div className={"mt-8"} />
                <div className={"flex justify-center"}>
                    <button className={"w-content px-3 py-2 text-white rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none disabled:cursor-not-allowed"} disabled={buttonStatus} type={"button"} onClick={() => {
                        // put current URL in clipboard
                        navigator.clipboard.writeText(`https://told-you.so/p/${id}`)
                        setButtonStatus(true)
                        // wait 2 seconds before setting button status
                        setTimeout(() => {
                            setButtonStatus(false)
                        }, 2000)
                        fetch(`https://api.queue.bot/stats/v1/store`, {
                            method: 'POST',
                            body: JSON.stringify({
                                tags: [
                                    "toldyouso-messageCopy",
                                ]
                            }),
                        })
                    }}>
                        {buttonStatus ? "👍 Copied" : "🔗 Copy Link"}
                    </button>
                </div>
                <div className={"flex md:justify-center overflow-hidden w-full"} style={{ height: 200 }} aria-hidden >
                    <AdSense.Google
                        client={"ca-pub-7806885462809506"}
                        slot={"2733023289"}
                        style={{ width: 350, height: 200 }}
                        format=''
                    />
                </div>
            </>
        )
    }
}

export default ID
