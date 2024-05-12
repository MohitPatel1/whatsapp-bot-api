import { be_url } from "./config";


let controller = new AbortController();
let signal = controller.signal;

export const postOptions = (options: any) => ({
    method: options?.method || 'GET',
    headers: {
        Accept: 'application.json',
        'Content-Type': 'application/json',
        "whatsappSecret": process.env.WHATSAPP_SECRET,
        ...options?.headers
    },
    body: typeof options?.body === "string" ? options.body : JSON.stringify(options.body),
    cache: options?.cache || 'no-store',
    credentials: options?.credentials || "include",
    data: options?.data ||null,
    signal
});

export const fetchRequest = async (route: string, options: any = {}) => {
    // Cancel the fetch request in 20000ms;
    // https://javascript.info/fetch-abort;
    let abortTimeout = setTimeout(() => controller.abort(), (options.waitTime || 20000));

    return await fetch(
        be_url + route, postOptions(options)
    )
    .then(async res => {
        clearTimeout(abortTimeout);
        if (!res || !res.ok || res.status >= 400 ) {
            throw res;
        };
        
        let response:any = await res.json();
        if (response.status === 'error') {
            throw response;
        } else {
            return response.payload ?? response;
        }
    })
    .catch((err)  => {
        console.error({ route, err }); 
        clearTimeout(abortTimeout);
        if (err.name == 'AbortError') { // handle abort()
            controller = new AbortController();
            signal = controller.signal;
            console.error("Aborted!");
            throw new Error("Server taking too long to respond. Please try again.");
        };
        throw err;
    });
};