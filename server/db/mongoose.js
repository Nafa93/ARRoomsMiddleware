const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
}).then(() => {
  console.log('The connection to the DB has been established');
}).catch((e) => {
  console.log(`The connection to the DB couldn't be established`);
});

module.exports = { mongoose };