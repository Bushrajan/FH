import axios from "axios"

// export const baseUrl = `http://localhost:2525/api/upload`
export const baseUrl = `https://fh-client-five.vercel.app/api/upload`

const apiUploadHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiUploadHandle
 