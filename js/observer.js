//设置一个监听器Observer
function Observer(data) {
    this.data = data;
    this.walk(data);
}
Observer.prototype = {
    walk: function(data) {
        var self = this;
        // 递归遍历所有子属性
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter () {
                //是否需要添加订阅者
                if (Dep.target) {
                    dep.addSub(Dep.target);//添加一个订阅者
                }
                return val;
            },
            set: function setter (newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();// 如果数据变化，通知所有订阅者
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

//创建一个可以容纳订阅者的消息订阅器Dep
function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            //函数用于将两个数据合并操作，有相同的就覆盖
            sub.update();
        });
    }
};
Dep.target = null;
