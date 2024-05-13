import { waAlertSettings, whatsappAlert } from "./types";

const stringOboveOrBefore = (number:number) => {
    if(number > 0) return `After ${number} Days`
    if(number < 0) return `Before ${number * (-1)} Days`
    return 'Today'
}

export const getPollOptions = (waAlertSettings:waAlertSettings[]): string[] => {
    const pollData:string[] = [];
    waAlertSettings.forEach((setting:waAlertSettings) => {
        if(setting.setting_name === 'whatsapp_invoice_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                if(alert.calculate_from == 'Invoice Date'){
                    pollData.push(`Invoice Date ${stringOboveOrBefore(alert.days_to_add)}`)
                }else{
                    pollData.push(`Invoice Due ${stringOboveOrBefore(alert.days_to_add)}`)
                }
            })
        }
        else if(setting.setting_name === 'whatsapp_order_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                if(alert.calculate_from == 'Order Date'){
                    pollData.push(`Order Date ${stringOboveOrBefore(alert.days_to_add)}`)
                }else{
                    pollData.push(`Order Due ${stringOboveOrBefore(alert.days_to_add)}`)
                }
            })
        }
    });
    pollData.push("Today's Snap Shot") // 'Outstanding'        

    return pollData 
}