const express = require('express');
const mockServer = require('./index');
const app = express();
const port = 5000;

mockServer.attachMock(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});