import axios from "axios"

// export const baseUrl = `http://localhost:2525/api/upload`
export const baseUrl = `https://final-hackathon-server-ten.vercel.app/api/upload`

const apiUploadHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiUploadHandle
 