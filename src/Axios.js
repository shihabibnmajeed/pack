import axios from "axios";


export const api=axios.create({
    baseURL :`http://localhost:5272/api`
})

api.interceptors.request.use(config => {
    const token =localStorage.getItem("__token__")
    config.headers.Authorization =`Bearer ${token}`
    return config
})