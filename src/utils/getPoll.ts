import { waAlertSettings, whatsappAlert } from "./types";

const stringOboveOrBefore = (days:number,calculate_from:string,type:string) => {
    if(type === 'invoice'){
        if(days > 0){
            return (calculate_from === 'Invoice Date') ? `Invoice Entered ${days} Days Ago` : `Invoice Dued ${days} Days Ago`
        }else if(days < 0){
            return (calculate_from === 'Invoice Date') ? `Invoice Entry ${days * -1} Days After` : `Invoice Dues ${days * -1} Days After`
        }else{
            return "Invoice Entered Today"
        }
    }else if(type === 'order'){
        if(days > 0){
            return (calculate_from === 'Order Date') ? `Order Entered ${days} Days Ago` : `Order Dued ${days} Days Ago`
        }else if(days < 0){
            return (calculate_from === 'Order Date') ? `Order Entry ${days * -1} Days After` : `Order Dues ${days * -1} Days After`
        }else{
            return "Order Entered Today"
        }
    }else{
        return "invalid setting"
    }
}

export const getPollOptions = (waAlertSettings:waAlertSettings[]): string[] => {
    const pollData:string[] = [];
    waAlertSettings.forEach((setting:waAlertSettings) => {
        if(setting.setting_name === 'whatsapp_invoice_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                    pollData.push(`${stringOboveOrBefore(alert.days_to_add,alert.calculate_from,"invoice")}`)
            })
        }
        else if(setting.setting_name === 'whatsapp_order_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                pollData.push(`${stringOboveOrBefore(alert.days_to_add,alert.calculate_from,"order")}`)
            })
        }
    });
    pollData.push("Today's Snap Shot") // 'Outstanding'        

    return pollData 
}