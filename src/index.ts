import { BaileysClass } from '@bot-wa/bot-wa-baileys';

const botBaileys = new BaileysClass({});

botBaileys.on('auth_failure', async (error) => console.log("ERROR BOT: ", error));
botBaileys.on('qr', (qr) => console.log("NEW QR CODE: ", qr));
botBaileys.on('ready', async () => console.log('READY BOT'))

let awaitingResponse = false;
function endsWithWhatsAppNet(str: string): boolean {
  const regex = str.slice(12)
  return (regex === '@s.whatsapp.net')
}

botBaileys.on('message', async (message) => {
    console.log(message)
    if(message.body && message.type && endsWithWhatsAppNet(message.key.participant)){
      if (!awaitingResponse) {
          await botBaileys.sendPoll(message.from, 'Select an option', {
              options: ['text', 'media', 'file', 'sticker'],
              multiselect: true
          });
          awaitingResponse = true;
          } else {
            const command = message.body.toLowerCase().trim();
            switch (command) {
                case 'text':
                    await botBaileys.sendText(message.from, 'Hello world');
                case 'media':
                    await botBaileys.sendMedia(message.from, 'https://www.w3schools.com/w3css/img_lights.jpg', 'Hello world');
                    break;
                case 'file':
                    await botBaileys.sendFile(message.from, 'https://github.com/pedrazadixon/sample-files/raw/main/sample_pdf.pdf');
                case 'sticker':
                    await botBaileys.sendSticker(message.from, 'https://gifimgs.com/animations/anime/dragon-ball-z/Goku/goku_34.gif', { pack: 'User', author: 'Me' });
                default:
                    await botBaileys.sendText(message.from, 'Sorry, I did not understand that command. Please select an option from the poll.');
            }
            awaitingResponse = false;
          }}
        else{
        console.log("body not found in message")
      }
});



