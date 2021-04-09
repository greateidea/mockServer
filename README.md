# mockServer
a very simple mock server of nodeJs.

it will search the response content exported by the file named `*.mock.js` in `./mock`,
you can change this behavior by pass a option.

## Installing

```sh
npm install @bigorange/mock-server
```
## Example
### response content
Note the `mock` folder and server file should be in the same level.

```js
// ./mock/data.mock.js
module.exports = {
    "GET /api/mock/test": {
        "state": "SUCCESS",
        data: true
    },
}
```


### start a mock server directly
```js
const server = require('@bigorange/mock-server');
server.boostrap();
```

### use it as a middleware
```js
const express = require('express');
const mockServer = require('@bigorange/mock-server');
const app = express();
const port = 4000;

app.use(express.json());
app.use(mockServer.createMiddleware(app));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
```

### add mock feature if you are alreary use express
```js
const express = require('express');
const mockServer = require('@bigorange/mock-server');
const app = express();
const port = 5000;

mockServer.attachMock(app); // now your express have the mock feature

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
```

### option
```js
server.boostrap(option);
app.use(mockServer.createMiddleware(app, option));
mockServer.attachMock(app, option);

option: {
    port: number, // the server listening port, be invalid in createMiddleware and attachMock
    searchPath: string, // the search path of response content, defaut './mock'
    matchRegExp: RegExp, // the suffix of file export response content, default '.mock.js'
}

```
