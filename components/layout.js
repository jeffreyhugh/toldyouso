import 'tailwindcss/tailwind.css'
import React, {useState} from 'react'
import Link from "next/link";
import Head from "next/head";

const Layout = ({children, isDark, setDark}) => {
    return (
        <>
            <Head>
                <title>told-you.so - a message time capsule</title>
                <link rel="icon" href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/crystal-ball_1f52e.png" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.1.7/css/fork-awesome.min.css"
                  integrity="sha256-gsmEoJAws/Kd3CjuOQzLie5Q3yshhvmo7YNtBG7aaEY=" crossOrigin="anonymous"/>
            </Head>
            <div id="darkSelector" className={isDark ? "dark" : ""}>
                <div className={"min-h-screen min-w-screen bg-white dark:bg-black"}>
                    <div className={"flex items-center flex-col"}>
                        <div className={"flex w-full justify-end"}>
                            <button
                                className={"rounded-full h-8 w-8 bg-gray-200 ring-gray-300 dark:bg-gray-800 dark:ring-gray-900 m-2 ring-2 select-none"}
                                onClick={() => setDark(dark => !dark)}>
                                {isDark ? "🌑" : "☀️"}
                            </button>
                        </div>
                        <div className={"max-w-full m-2 md:max-w-screen-lg md:m-0 md:mt-2"}>
                            <div
                                className={"font-bold text-center font-sans leading-tight md:leading-snug text-transparent bg-clip-text bg-gradient-to-br text-6xl md:text-8xl from-fuchsia-600 to-purple-600 select-none"}>
                                <Link href={"/"}>
                                    <a>
                                        told-you.so
                                    </a>
                                </Link>
                            </div>
                            <div className={"text-center text-2xl dark:text-white lowercase select-none"}>
                                A message time capsule 🔮
                            </div>

                            <div className={"m-2"}/>
                            <div className={"flex flex-col md:flex-row items-center justify-center text-lg dark:text-white lowercase italic whitespace-nowrap overflow-y-scroll md:overflow-y-hidden select-none"}>
                                <Link href={"/"}>
                                    <a>
                                        Store a message
                                    </a>
                                </Link>
                                <div className={"hidden md:block px-2"}>&middot;</div>
                                <Link href={"/about"}>
                                    <a>
                                        About
                                    </a>
                                </Link>
                                <div className={"hidden md:block px-2"}>&middot;</div>
                                <Link href={"/privacy"}>
                                    <a>
                                        Privacy
                                    </a>
                                </Link>
                                <div className={"hidden md:block px-2"}>&middot;</div>
                                <Link href={"https://github.com/qbxt/toldyouso"}>
                                    <a>
                                        GitHub
                                    </a>
                                </Link>
                            </div>

                            <div className={"mt-10 mb-10"}/>

                            <div className={"w-auto m-8"}>
                                {children}
                            </div>

                            <div className={"m-8"} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Layout