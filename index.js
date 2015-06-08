var app = require("./thinking");
var interceptor = require("./lib/interceptor"),
    controller = require("./lib/controller"),
    forbidden = require("./lib/forbidden"),
    session = require("./lib/sessionManager");

app.use(session).use(forbidden).use(interceptor).use(controller);

app.use(function(next) {
    this.response.getWriter().print("hi,nodejs!")
});

app.init("web.json", __dirname);