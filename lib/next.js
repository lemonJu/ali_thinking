
var app = next.prototype;

function next(arr, request, response) {
    this.fns = arr.slice();
    this.index = -1;
    this.request = request;
    this.response = response;
    this.triggerNext();
}


app.triggerNext = function() {
    var _this = this;
    if(this.index + 1 < this.fns.length) {
        this.index ++;
        this.fns[this.index].call(this, function() {
            app.triggerNext.call(_this)
        });
    }
}

module.exports = next;