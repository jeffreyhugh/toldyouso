import 'tailwindcss/tailwind.css'
import Layout from "../components/layout";
import React, { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
const { DateTime } = require("luxon")
const aes256 = require("aes256")

const Index = () => {
    const router = useRouter()

    const messageForm = () => {
        const [showEmailInfo, setShowEmailInfo] = useState(false)
        const [showPasswordInfo, setShowPasswordInfo] = useState(false)
        const [buttonStatus, setButtonStatus] = useState(false)

        const storeMessage = async event => {
            event.preventDefault()

            setButtonStatus(_s => !_s)

            const res = await fetch("/api/store", {
                method: 'POST',
                body: JSON.stringify({
                    email: event.target.email.value,
                    message: event.target.password.value ? 
                                aes256.encrypt(event.target.password.value, event.target.message.value) :
                                event.target.message.value,
                    encrypted: event.target.password.value !== "",
                    availableAt: DateTime.fromISO(event.target.availableAt.value).toUTC().toISO(),
                    submittedAt: DateTime.now().toUTC().toISO(),
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
                        className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"}
                        id={"email"} type={"text"} placeholder={"my-name@jeff.com"} required disabled={buttonStatus} />
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
                    {showEmailInfo ? "We'll send you an email with a link to your prediction so you don't lose it (WIP)" : ""}
                </div>
                <div className={"mt-4"} />
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"message"}>Prediction (r)</label>
                <textarea
                    className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"}
                    id={"message"} placeholder={"I predict... (max 2000)"} maxLength={2000} rows={5} required disabled={buttonStatus} />
                <div className={"mt-3"} />
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"password"}>Password to encrypt my prediction</label>
                <div className={'relative'}>
                    <input
                        className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"}
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
                <label className={"w-full dark:text-white text-lg ml-2.5 lowercase select-none"} htmlFor={"availableAt"}>make my prediction available at (r)</label>
                <input className={"w-full px-3 py-2 focus:outline-none dark:text-white dark:bg-black rounded-lg focus:ring-fuchsia-400 focus:ring-4 focus:border-purple-600"} id={"availableAt"} defaultValue={DateTime.now().toLocal().plus({ hours: 24 }).startOf("minute").toISO({ includeOffset: false })} type={"datetime-local"} required />
                <div className={"mt-4"} />
                <button className={"w-full px-3 py-2 text-white rounded-lg bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase select-none disabled:cursor-not-allowed"} disabled={buttonStatus} type={"submit"} id={"sb"}>
                    {buttonStatus ? <i className={"fa fa-circle-o-notch fa-spin"} aria-hidden={true} /> : "✏️ Store my prediction"}
                </button>
            </form>
        )
    }

    return (
        <Layout>
            {messageForm()}
        </Layout>
    )
}

export default Index