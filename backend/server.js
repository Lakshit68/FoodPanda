require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db');

const port = process.env.PORT || 3001;
app.use((req, res, next) => {
  // Allow popups from other origins (required for Google OAuth)
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
});





