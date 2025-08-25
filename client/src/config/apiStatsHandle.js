import axios from "axios"
 
export const baseUrl = `https://hackathonserver-production.up.railway.app/api/auth` 
// export const baseUrl = `http://localhost:2525/api/auth` 

export const apiStatsHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})