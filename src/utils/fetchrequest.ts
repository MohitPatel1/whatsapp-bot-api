import { be_url } from "./config";
require('dotenv').config();

export const postOptions = (options: any, signal: AbortSignal): RequestInit => ({
    method: options?.method || 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "whatsappsecret": process.env.WHATSAPP_SECRET,
        ...options?.headers
    },
    body: typeof options?.body === "string" ? options.body : JSON.stringify(options.body),
    credentials: options?.credentials || "include",
    signal
});

export const fetchRequest = async (route: string, options: any = {}): Promise<any> => {
    let controller = new AbortController();
    let signal = controller.signal;

    // Cancel the fetch request in 20000ms;
    let abortTimeout = setTimeout(() => controller.abort(), options.waitTime || 20000);
    console.log(be_url);

    try {
        const response = await fetch(be_url + route, postOptions(options, signal));
        clearTimeout(abortTimeout);

        if (!response.ok || response.status >= 400) {
            throw response;
        }

        const responseData = await response.json() as { status: string; payload?: any; };
        console.log(responseData);

        if (responseData.status === 'error') {
            console.error("error occured in fetching data")
        } else {
            return responseData.payload ?? responseData;
        }
    } catch (err) {
        clearTimeout(abortTimeout);
        console.error({ route, err });
    }
};
