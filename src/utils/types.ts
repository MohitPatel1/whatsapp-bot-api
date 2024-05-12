export type whatsappAlert = {
    calculate_from:'Due Date' | 'Invoice Date' | 'Order Date',
    days_to_add: number,
}

export type waAlertSettings = {
    setting_name: string,
    whatsappAlert:whatsappAlert[]
}

export type whatsaphoneSettingMapping = {
    name:string,
    og_id:string,
    waAlertSettings: waAlertSettings[]
}