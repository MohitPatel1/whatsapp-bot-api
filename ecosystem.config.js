const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps : [{
    name: "whatsapp-bot",
    script: 'npm run start',
    instances: '1',
    exec_mode: 'cluster_mode',
    env: {
        ...process.env
    }
  },
  
]
};