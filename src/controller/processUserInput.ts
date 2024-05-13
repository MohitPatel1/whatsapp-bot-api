import { fetchRequest } from "../utils/fetchrequest";

export async function processString(inputString: string,og_id:string): Promise<string | string[]> {

        if(inputString === "Today's Snap Shot"){
            return fetchRequest(`/whatsapp/snapshot/${og_id}`);
        }
    // Check for presence of keywords using regular expressions
    const detectedKeywords: Record<string, boolean> = {
        invoice: /Invoice/.test(inputString),
        order: /Order/.test(inputString),
        due: /\b(Due|Dues|Dued)\b/i.test(inputString),
        ago:/Ago/.test(inputString),
        after:/After/.test(inputString)
    };

    const numberMatch = inputString.match(/\d+/);
    const number = numberMatch ? parseInt(numberMatch[0]) : 0;
    // the voucher was dued ago x number of days. so today after x number of days when voucher dued
    // the voucher will due after x number of days. so today is ago x number of days when voucher expired
    let data:Record<string,string> = {days:`${(detectedKeywords.after) ? number : Number(number) * (-1)}`}

    data = {
        ...data,
        dateOrDue: detectedKeywords.due ? "due" : "date",  
    };
    
    const queryString:string = new URLSearchParams(data).toString();
    console.log({queryString})

    switch (true) {
        case detectedKeywords.invoice:
            return fetchRequest(`/whatsapp/invoice/${og_id}?${queryString}`);
        case detectedKeywords.order :
            return fetchRequest(`/whatsapp/order/${og_id}?${queryString}`);
        default:
            return fetchRequest(`/whatsapp/snapshot/${og_id}`)
    };
}
