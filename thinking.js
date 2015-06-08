/* part = 模块引入
--------------------------------------------*/
var server = require("./lib/server"),

    verification = require("./lib/verification"),
    qs = require('querystring'),
    print = require("./lib/print");

var next = require("./lib/next");
var fns = [];

/* part = 私有部分
--------------------------------------------*/
var app = exports = module.exports = {};
var tid,
    controllers = {},
    filter = [],
    i,
    session,
    lastTid;

global.APP_DIR = __dirname + "/";
global.USER_DIR = "";
global.PAGE = "";
global.LIB = global.APP_DIR + "/lib/";
global.APP = require(global.LIB + "application");
global.CONFIG = require(global.LIB + "setting");
global.Module = {
    fs: require("fs"),
    path: require("path"),
    log: require("./lib/log"),
    util: require("./lib/hutil"),
    //sessionManager: require("./lib/sessionManager").getInstance()
}

function startServer() {
    server.start(CONFIG.server, function(request, response, queryData) {
        if (request.url == "/") request.url += CONFIG.welcomePage;
        //初始化表单参数
        request.setParams(qs.parse(queryData));
        //注入模板
        response.setTemplate(print);
        new next(fns, request, response);
    })
}


/* part = 共有部分
--------------------------------------------*/
app.init = function(setFile, addr) {
    var data;
    //初始化用户路径
    global.USER_DIR = addr + "/" || global.APP_DIR;
    global.PAGE = global.USER_DIR + "/pages/";
    setFile = global.USER_DIR + setFile || global.USER_DIR + "./web.json";
    data = JSON.parse(Module.fs.readFileSync(setFile, {encoding: 'utf8'}));
    Module.util.overRide(CONFIG, data, true);
    //验证配置文件
    if (verification.do(CONFIG) === false) return;
    //初始化log
    Module.log.init(CONFIG.log);
    //初始化sessionManager
    //Module.sessionManager.init(CONFIG.sessionContext);
    //启动服务器
    startServer()
}


app.use = function(fn) {
    if(Module.util.isFunction(fn))
        fns.push(fn)
    return this;
};