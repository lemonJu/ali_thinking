/**
 * 拦截所有forbidden路径的请求
 */

/* part = 私有部分
--------------------------------------------*/
var url,forbidden;

/* part = 共有部分
--------------------------------------------*/
module.exports = function(next) {
    url = this.request.url;

    for (i = 0; i < CONFIG.forbidden.length; i++) {
        fbdReg = Module.util.genReg(CONFIG.forbidden[i]);
        if (fbdReg.test(url)) {
        	//拦截非法请求
			this.response.code = 403;
            this.response.getWriter().print("403","403");
            return false;
        }
    }
    next();
}
