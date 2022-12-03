
import { start } from './src/server'

let port: number = 3001

if(process.env.PORT) {
  port = parseInt(process.env.PORT);
}

// const server = require('./src/server.js');
// const { db } = require('./src/models/index.js');
// const { seed } = require('./src/models/seed');

start(port);

// db.sync()
//   .then(async () => {
//     if (process.env.NODE_ENV === 'dev') {
//       await db.sync({ force: true });
//       await seed();
//     }
//     server.start(port);
//   })
//   .catch(console.error);
