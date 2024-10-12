import axios from "axios";
import { enqueueSnackbar } from 'notistack';
import i18n from "../../i18n";
const env = import.meta.env;

const path = env.VITE_SERVER_PATH;
const translationNamespace = "error messages";

const instance = axios.create({
    baseURL: path,
    withCredentials: true
});

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    const message = formatError(error);
    showTranslatedError(message);
    return Promise.reject(error);
});

function formatError(error) {
    return error.response?.data || error.toString();
}

async function showTranslatedError(message) {
    let translated;
    try {
        await i18n.loadNamespaces(translationNamespace);
        translated = i18n.t(message,{ns:translationNamespace});
    }
    catch (err) {
        console.error(err);
        translated = message;
    }
    enqueueSnackbar(translated, { variant: "error" });
}

export default instance;