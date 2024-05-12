import { BaileysClass } from '@bot-wa/bot-wa-baileys';
import { fetchRequest } from './utils/fetchrequest';
import { whatsaphoneSettingMapping, whatsappAlert } from './utils/types';
import { getPollOptions } from './utils/getPoll';

const botBaileys = new BaileysClass({});
let phoneSettingMapping : Record<string,whatsaphoneSettingMapping>;
botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => {
  // get all phone numbers with og_id map
  phoneSettingMapping = await fetchRequest('/whatsapp/phoneSettingMapping');
  console.log({phoneSettingMapping})
  console.log('READY BOT');
})

let awaitingResponse = false;
function endsWithWhatsAppNet(str: string): boolean {
  const regex = str.slice(12)
  return (regex === '@s.whatsapp.net')
}

botBaileys.on('message', async (message) => {
    console.log(message)
    if(message.body && message.type && endsWithWhatsAppNet(message.from)){
      if (!awaitingResponse) {
        console.log(message.from.slice(2,12))
        const sender:whatsaphoneSettingMapping = phoneSettingMapping[message.from.slice(2,12)]
        console.log(sender)
        if(sender){
          const pollOptions:string[] = getPollOptions(sender.waAlertSettings);
          await botBaileys.sendPoll(message.from.slice(0,12), sender.name, {
            options: pollOptions,
            multiselect: false
        });
        }else{
          console.log("bot ")
          // send standard data
          // you don't have a licence to access smart agent bot
        }
          awaitingResponse = true;
          } else {
            let command = message.type;
            if( message.type === 'poll'){
              command = message.body
            }
            switch (command) {
                case 'Reminders':
                    // const message = await fetch(phone_number,og_id)
                    await botBaileys.sendText(message.from, 'Hello from mohit');
                    break;
                case 'Snap Shot':
                    await botBaileys.sendText(message.from, 'https://www.w3schools.com/w3css/img_lights.jpg');
                    break;
                default:
                    await botBaileys.sendText(message.from, 'www.smartagent.one');
            }
            awaitingResponse = false;
          }}
        else{
        console.log("body not found in message")
      }
});



