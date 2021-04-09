const express = require('express');
const _app = express();
const fs = require('fs')
const path = require('path')

_app.use(express.json());
const _matchRegExp = /\.mock\.\S+/;
const _port = 3000;
const _searchPath = './mock';

const matchNameFileSync = ({ searchPath, matchRegExp = /\.mock\.\S+/, callback }) => {
    const matchedFileInfo = [];
    const hanldeFile = (filePath, fileName) => {
        matchedFileInfo.push({ [path.resolve(filePath)]: fileName });

        if (filePath.match(matchRegExp)) {
            callback(fileName, path.resolve(filePath))
        }
    }

    const searchFile = (pathstr) => {
        const fileList = fs.readdirSync(pathstr);

        fileList.forEach((fileName) => {
            const filePath = path.join(pathstr, fileName);
            if (fs.statSync(filePath).isDirectory()) {
                searchFile(filePath);
            } else {
                hanldeFile(filePath, fileName)
            }
        })
    }

    searchFile(searchPath);

    return matchedFileInfo.length ? matchedFileInfo : null;
};

const legalMethodName = ['GET', 'POST', 'DELETE', 'PUT'];
function checkoutMethodName(methodName) {
    if (!legalMethodName.some(name => name === methodName)) {
        throw Error(`illegal metchod name ${apiTempMeta[0]}`);
    }
};

function generatorAPIUse(apiInfo, app) {
    try {
        Object.keys(apiInfo).forEach(function(key) {
            const apiTempMeta = key.split(' ');
            const responesData = apiInfo[key];

            let method = 'GET';
            let url = '';
    
            if( apiTempMeta.length > 1) {
                checkoutMethodName(apiTempMeta[0]);

                method = apiTempMeta[0];
                url = apiTempMeta[1];
            } else {
                url = apiTempMeta[0];
            }

            console.log(`MOCK: ${method} ${url}`)
            app[method.toLowerCase()](url, (req, res) => {
                console.log(`REQUEST: ${method} ${url}`)
                res.json(responesData);
            })
        })
    } catch (error) {
        console.error(error);
    }
};

const _boostrap = (app, option) => {
    matchNameFileSync({
        searchPath: option.searchPath,
        callback: (fileName, filePath) => {
            const apiInfo = require(filePath);
            generatorAPIUse(apiInfo, app);
        },
        matchRegExp: option.matchRegExp
    });

    app.listen(option.port || 3000, () => {
        console.log('Mock Server is running')
    });
};

function createMiddleware(app, option = {}) {
    if (!app || typeof app !== typeof _app ) {
        console.error('please give me a express instance.')
    }

    matchNameFileSync({
        searchPath: option.searchPath || _searchPath,
        callback: (fileName, filePath) => {
            const apiInfo = require(filePath);
            generatorAPIUse(apiInfo, app);
        },
        matchRegExp: option.matchRegExp || _matchRegExp
    });

    return function(req, res, next) {
        console.log('createMiddleware trigger')
        next();
    }
};

function attachMock(app, option = {}) {
    matchNameFileSync({
        searchPath: option.searchPath || _searchPath,
        callback: (fileName, filePath) => {
            const apiInfo = require(filePath);
            generatorAPIUse(apiInfo, app);
        },
        matchRegExp: option.matchRegExp || _matchRegExp
    });
};

const boostrap = (option = {}) => {
    const port = option.port || _port;
    const searchPath = option.searchPath || _searchPath;
    const matchRegExp = option.matchRegExp || _matchRegExp;
    _boostrap(_app, { port, searchPath, matchRegExp });
};

module.exports = { 
    boostrap,
    createMiddleware,
    attachMock,
    matchNameFileSync
};
