import { useRouter } from "next/router";
import Layout from "../components/layout";
import Head from "next/head";
const { DateTime } = require("luxon")
import { useState } from 'react';

const Unsubscribe = () => {

    const unsubscribeForm = () => {
        const router = useRouter()

        const [buttonStatus, setButtonStatus] = useState(false)

        const handleUnsubscribe = async event => {
            event.preventDefault()

            setButtonStatus(_s => !_s)
            const res = await fetch("https://api.queue.bot/toldyouso/v1/unsubscribe", {
                method: 'POST',
                body: JSON.stringify({
                    token: router.query.token,
                })
            })

            if (res.status === 200) {
                router.push(`/unsubscribeSuccess`)
                return
            }

            setButtonStatus(_s => !_s)
        }

        return (
            <button className={"w-full px-3 py-2 text-white rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none disabled:cursor-not-allowed"} disabled={buttonStatus} type={"button"} onClick={handleUnsubscribe}>
                {buttonStatus ? <i className={"fa fa-circle-o-notch fa-spin"} aria-hidden={true} /> : "😡 Unsubscribe"}
            </button>
        )
    }

    return (
        <>
            {unsubscribeForm()}
        </>
    )
}

export default Unsubscribe
