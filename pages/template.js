import Layout from "../components/layout"

const Template = () => {
    return (
        <div className={"bg-black min-h-screen min-w-screen p-8"}>
            <div className={"font-bold text-transparent bg-clip-text bg-gradient-to-br text-6xl from-fuchsia-600 to-purple-600 text-center"}>
                Your prediction has been stored!
            </div>
            <div className={"text-white text-center text-2xl mt-2"}>
                In 20 hours, everyone can see it at <a href="https://told-you.so/p/6mn7VL" className={"underline"}>https://told-you.so/p/6mn7VL</a> 🔮
            </div>
            <div className={"text-white text-center text-xl mt-2"}>
                A live countdown is available at your prediction's URL right now
            </div>
            <div className={"mt-12"} />
            <div className={"flex justify-center"}>
                <div className={"text-gray-400 max-w-lg text-justify"}>
                    If you want to stop receiving emails from us forever, <a href="https://told-you.so/unsubscribe?token=asdf" className={"underline"}>click here to unsubscribe</a> and be added to the email blacklist.
                    To resubscribe, send an email to <a href="mailto:toldyouso@queue.bot" className={"underline"}>toldyouso@queue.bot</a>
                </div>
            </div>
            <div className={"text-center text-gray-400 mt-8"}>
                <a href="https://told-you.so" className={"text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-purple-600"}>told-you.so</a> by QueueBot
            </div>
        </div>
    )
}

export default Template