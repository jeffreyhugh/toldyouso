import 'tailwindcss/tailwind.css'
import React, { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/dist/client/link';
import Head from 'next/head';
const { DateTime } = require("luxon")
const aes256 = require("aes256")
import { useDetectAdBlock } from "adblock-detect-react";
import AdSense from 'react-adsense';
import Script from 'next/script';

const Index = () => {
    const router = useRouter()

    const messageForm = () => {
        const [showEmailInfo, setShowEmailInfo] = useState(false)
        const [showPasswordInfo, setShowPasswordInfo] = useState(false)
        const [buttonStatus, setButtonStatus] = useState(false)

        const ab = useDetectAdBlock()

        const storeMessage = async event => {
            event.preventDefault()

            setButtonStatus(_s => !_s)
            const res = await fetch("https://api.queue.bot/toldyouso/v1/store", {
                method: 'POST',
                body: JSON.stringify({
                    email: event.target.email.value,
                    message: event.target.password.value ?
                        aes256.encrypt(event.target.password.value, event.target.message.value) :
                        event.target.message.value,
                    encrypted: event.target.password.value !== "",
                    availableAt: DateTime.fromISO(event.target.availableAt.value).toUTC().toISO(),
                    submittedAt: DateTime.now().toUTC().toISO(),
                    ab: ab,
                })
            })

            const j = await res.json()

            if (res.status === 200) {
                router.push(`/p/${j.location}`)
                return
            }

            setButtonStatus(_s => !_s)
        }

        return (
            <form id={"storeForm"} className={"max-w-lg"} onSubmit={storeMessage}>
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"email"}>Email (r)</label>
                <div className={'relative'}>
                    <input
                        className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600 disabled:cursor-not-allowed"}
                        id={"email"} type={"email"} placeholder={"my-name@jeff.com"} required disabled={buttonStatus} />
                    <i className={"cursor-pointer fa fa-info-circle"} aria-hidden={true}
                        style={{
                            position: 'absolute',
                            height: 16,
                            width: 16,
                            top: 14,
                            right: 14,
                            color: 'gray',
                            zIndex: 1
                        }}
                        onClick={() => setShowEmailInfo(show => !show)} />
                </div>
                <div className={"w-full pl-2 pr-2 dark:text-white dark:bg-black lowercase select-none"} id={"emailInfo"}>
                    {showEmailInfo ? "We'll send you an email with a link to your message so you don't lose it" : ""}
                </div>
                <div className={"mt-4"} />
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"message"}>Message (r)</label>
                <textarea
                    className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600 disabled:cursor-not-allowed"}
                    id={"message"} placeholder={"Mark my words... (max 2000)"} maxLength={2000} rows={5} required disabled={buttonStatus} />
                <div className={"mt-3"} />
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"password"}>Optional password to encrypt message</label>
                <div className={'relative'}>
                    <input
                        className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600 disabled:cursor-not-allowed"}
                        id={"password"} type={"password"} placeholder={"secure-PASSWORD-1"} disabled={buttonStatus} />
                    <i className={"cursor-pointer fa fa-info-circle"} aria-hidden={true}
                        style={{
                            position: 'absolute',
                            height: 16,
                            width: 16,
                            top: 14,
                            right: 14,
                            color: 'gray',
                            zIndex: 1
                        }}
                        onClick={() => setShowPasswordInfo(show => !show)} />
                </div>
                <div className={"w-full pl-2 pr-2 dark:text-white dark:bg-black lowercase select-none"} id={"emailInfo"}>
                    {showPasswordInfo ? "If you set a password, your message will be encrypted client-side with AES256" : ""}
                </div>
                <div className={"mt-4"} />
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"availableAt"}>Make my message available at (r)</label>
                <input className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"} id={"availableAt"} defaultValue={DateTime.now().toLocal().plus({ hours: 0 }).startOf("minute").toISO({ includeOffset: false })} type={"datetime-local"} required />
                <div className={"mt-4"} />
                <div className={"w-full pl-2 pr-2 font-bold dark:text-white dark:bg-black lowercase select-none"}>
                    By storing a message, you affirm that you are at least 18 years of age, have read and agree to the{' '}
                    <Link href={"/legal"}>
                        <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} >Privacy Policy and ToS</a>
                    </Link>, and the recipient of the message is either yourself or an individual who consents to receiving an email on your behalf.
                </div>
                <div className={"mt-4"} />
                <div className={"w-full pl-2 pr-2 font-bold text-gray-700 dark:text-gray-500 dark:bg-black lowercase select-none"}>
                    (Submit button below this advertisement)
                </div>
                <div className={"flex md:justify-center overflow-hidden w-full"} style={{ height: 200 }} aria-hidden >
                    
                </div>
                <div className={"mt-4"} />
                <button type={"submit"} disabled className={"display-none"} />
                <button className={"w-full px-3 py-2 text-white rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none disabled:cursor-not-allowed"} disabled={buttonStatus} type={"submit"} id={"sb"}>
                    {buttonStatus ? <i className={"fa fa-circle-o-notch fa-spin"} aria-hidden={true} /> : "✏️ Store my message"}
                </button>
            </form>
        )
    }

    return (
        <>
            <Head>
                <meta name="og:title" content={"told-you.so"} />
                <meta name="og:description" content={"a time capsule for messages 🔮"} />
                <meta name="og:type" content={"website"} />
                <meta name="og:url" content={"https://told-you.so"} />
                <meta name="theme-color" content={"#7c3aed"} />
            </Head>
            {messageForm()}
        </>
    )
}

export default Index
