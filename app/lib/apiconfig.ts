import axios from "axios";

export const Api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_BACKENDAPI ,
    withCredentials: true
});



Api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log("Error intercepted:", error);
    }
)