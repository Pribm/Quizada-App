import axios from "axios";

export const Http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
})

export const HttpAuth = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})



HttpAuth.interceptors.request.use(
    async (config) => {
        config.headers.authorization = 'Bearer ' + await localStorage.getItem('access_token')
        return config
    },
)

HttpAuth.interceptors.response.use(response => {
    return response
}, error => {
    if(error.response){
        if(error.response.status === 401){
            localStorage.removeItem('access_token')
            window.location.replace('/')
        }
        return error.response
    }
})