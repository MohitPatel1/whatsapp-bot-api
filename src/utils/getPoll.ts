import { waAlertSettings, whatsappAlert } from "./types";

const stringOboveOrBellow = (number:number) => {
    if(number > 0) return `Above ${number} Days`
    if(number < 0) return `Below ${number * (-1)} Days`
    return 'Today'
}

export const getPollOptions = (waAlertSettings:waAlertSettings[]): string[] => {
    const pollData:string[] = [];
    waAlertSettings.forEach((setting:waAlertSettings) => {
        if(setting.setting_name === 'whatsapp_invoice_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                if(alert.calculate_from == 'Invoice Date'){
                    pollData.push(`Invoice date ${stringOboveOrBellow(alert.days_to_add)}`)
                }else{
                    pollData.push(`Invoice Due ${stringOboveOrBellow(alert.days_to_add)}`)
                }
            })
        }
        else if(setting.setting_name === 'whatsapp_order_alerts'){
            setting.whatsappAlert && setting.whatsappAlert.forEach((alert:whatsappAlert) => {
                if(alert.calculate_from == 'Order Date'){
                    pollData.push(`Order date ${stringOboveOrBellow(alert.days_to_add)}`)
                }else{
                    pollData.push(`Order Due ${stringOboveOrBellow(alert.days_to_add)}`)
                }
            })
        }else{
            pollData.push('Reminders', 'Snap Shot')
        }

        return pollData
    });




    return ['Reminders', 'Snap Shot'] // 'Outstanding'
}