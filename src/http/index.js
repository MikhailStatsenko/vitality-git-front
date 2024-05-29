import axios from 'axios';

export const API_URL = "http://78.24.221.217:8080/api";
// export const API_URL = "http://localhost:8080/api";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        // 'Access-Control-Allow-Origin': "*",
        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        // 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json',
    }
})


$api.interceptors.request.use((config) => {
    let token = localStorage.getItem('token')
    if (token !== null) {
        config.headers.Authorization = `Bearer ${token})}`
    }
    return config;
} )

export default $api;