import axios from "axios"

// export const baseUrl = `http://localhost:2525/api/hijab` 
export const baseUrl = `https://fh-client-five.vercel.app/api/hijab` 

export const apiHijabHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})