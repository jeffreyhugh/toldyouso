const UnsubscribeSuccess = () => {
    return (
        <>
            <div className={"w-full dark:text-white font-bold text-lg text-center"}>
                You have been successfully unsubscribed.
            </div>
            <div className={"mt-8"} />
            <div className={"w-full dark:text-white text-lg text-center"}>
                If you want to resubscribe, please email <a className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600 hover:from-fuchsia-800 hover:to-purple-800"} href="mailto:toldyouso@queue.bot">toldyouso@queue.bot</a>. 
            </div>
        </>
    )
}

export default UnsubscribeSuccess