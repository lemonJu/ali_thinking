/* part = 模块引入
--------------------------------------------*/

var sessionBase = require("./session");
var md5 = require("./md5");

/* part = 私有部分
--------------------------------------------*/
var instance = null;

function sessionManager() {
    var tempSession, now, s, _this;
    this.auto_sessionContext = null;
    this.sessions = {};
    this.disabled = {};
    this.getSession = function(sid) {
        return this.sessions[sid]
    };
    this.createSession = function(sid) {
        //check max session
        if (this.sessions.length > this.auto_sessionContext.maxSession) {
            Module.log.print('max bind session =' + sid);
        }

        this.sessions[sid] = new sessionBase(sid);
        return this.sessions[sid];
    };
    this.destorySession = function(sid) {
        tempSession = this.sessions[sid];
        delete this.sessions[sid];
        if (this.auto_sessionContext.keepDestoried)
            this.destorySession[sid] = tempSession;
    };
    this.initSessionGCProcessor = function() {
        _this = this;
        time = this.auto_sessionContext.gcTime * 1000;

        setInterval(function() {
            now = Date.now();
            
            for (s in _this.sessions) {
                if (parseInt(_this.sessions[s].Sessionkey.lastTime) + parseInt(_this.auto_sessionContext.expireTime) * 1000 < now) {
                    _this.destorySession(s);
                }
            }
        }, time);
    };
    this.init = function(auto_sessionContext) {
        this.auto_sessionContext = auto_sessionContext;
        this.initSessionGCProcessor();
    }
}

/**
 * 就程序而言，session管理器类应该只存在一个实例
 * 因此使用单例模式进行管理
 */
function getInstance() {
    if(instance === null) {
        return instance = new sessionManager()
    }else{
        return instance
    }
}

module.exports = function(next) {
    var session;

    Module.sessionManager = getInstance();
    Module.sessionManager.init(CONFIG.sessionContext);

    lastTid = this.request.getCookie().tid;
    if (!lastTid || (lastTid && !Module.sessionManager.getSession(lastTid))) {
        tid = md5.hex_md5(Date.now().toString());
        this.response.setCookie("tid", tid, Date.now() + CONFIG.sessionContext.expireTime, "/").flushCookie();
        session = Module.sessionManager.createSession(tid);
    } else {
        session = Module.sessionManager.getSession(lastTid);
    }
    session.refreshLastTime();
    this.request.setSession(session);
    next();
}
