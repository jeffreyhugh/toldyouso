import { useRouter } from "next/dist/client/router"

export async function getServerSideProps(ctx) {
    return {
        redirect: {
            destination: '/',
            permanent: true,
        }
    }
}

const pIndex = () => {
    return null
}

export default pIndex