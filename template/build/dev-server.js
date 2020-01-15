var refmodsRegister = require('./refmods-register');
refmodsRegister.run();
var autoRouter=require('./auto-router');
autoRouter.run(true);
var autoBuildRemoteVues=require('./build-remotes');
autoBuildRemoteVues.run(true);

var config = require('../config');
const Webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const WebpackDevServer = require('webpack-dev-server');

const compiler = Webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer);
const server = new WebpackDevServer(compiler, devServerOptions);

server.listen(devServerOptions.port);
