const express = require('express');
const mockServer = require('./index');
const app = express();
const port = 4000;

app.use(express.json());
app.use(mockServer.createMiddleware(app));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});