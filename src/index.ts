import { BaileysClass } from '@bot-wa/bot-wa-baileys';
import { fetchRequest } from './utils/fetchrequest';
import { whatsaphoneSettingMapping, whatsappAlert } from './utils/types';
import { getPollOptions } from './utils/getPoll';
import { processString } from './controller/processUserInput';

const botBaileys = new BaileysClass({});
let phoneSettingMapping : Record<string,whatsaphoneSettingMapping>;
botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => {
  // get all phone numbers with og_id map
  phoneSettingMapping = await fetchRequest('/whatsapp/phoneSettingMapping');
  console.log('READY BOT');
})

let awaitingResponse = false;
function endsWithWhatsAppNet(str: string): boolean {
  const regex = str.slice(12)
  return (regex === '@s.whatsapp.net')
}

botBaileys.on('message', async (message) => {
    console.log(message)
    if(message.body && endsWithWhatsAppNet(message.from)){
      console.info({message}) // keep it here
      const intervalId = setInterval(() => {
        console.log("Getting phone registary");
      }, 1000);
    
      while (!phoneSettingMapping) {
          // Waiting for phoneSettingMapping to become present
      }
      
      // Clear the interval once phoneSettingMapping is present
      clearInterval(intervalId);

      const sender:whatsaphoneSettingMapping = phoneSettingMapping[message.from.slice(2,12)]
      if (!awaitingResponse && message.type != 'poll') {
        console.log(sender)
        if(sender && !awaitingResponse){
          const pollOptions:string[] = getPollOptions(sender.waAlertSettings);
          await botBaileys.sendPoll(message.from, `Hello, ${sender.name} Please selcet one of the options`, {
            options: pollOptions,
            multiselect: false
          })
        }else{
          await botBaileys.sendText(message.from, `you don't have a licence to access smart agent bot`);        
        }
        awaitingResponse = true;
      } else {    
        try{
          const resMsg = await processString(message.body,sender.og_id);
          if(Array.isArray(resMsg)){
            resMsg.forEach(async(msg:string) => {
              await botBaileys.sendText(message.from, msg);
            });
          }else{
            await botBaileys.sendText(message.from, resMsg);
          }
          awaitingResponse = false;
        }catch(e){
          console.error(e)
        }     
    }}
      else{
      console.log("body not found in message")
    }
});



