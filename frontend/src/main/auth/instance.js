import axios from "axios";
import { enqueueSnackbar } from 'notistack';
const env = import.meta.env;

const path = env.VITE_SERVER_PATH;

const instance = axios.create({
    baseURL: path,
    withCredentials: true
});

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    enqueueSnackbar(formatError(error), { variant: "error" });
    return Promise.reject(error);
});

function formatError(error) {
    return error.response?.data || error.toString();
}

export default instance;