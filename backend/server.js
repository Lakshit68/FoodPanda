require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db');

const port = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
});




