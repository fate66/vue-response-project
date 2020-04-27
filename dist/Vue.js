'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = function () {
    function Dep() {
        _classCallCheck(this, Dep);

        this._l = [];
    }

    _createClass(Dep, [{
        key: 'addWatcher',
        value: function addWatcher(w) {
            this._l.push(w);
        }
    }, {
        key: 'notify',
        value: function notify(v) {
            this._l.forEach(function (w) {
                w.update(v);
            });
        }
    }]);

    return Dep;
}();

var Watcher = function () {
    function Watcher(render) {
        _classCallCheck(this, Watcher);

        this._render = render;
        Dep.target = this;
    }

    _createClass(Watcher, [{
        key: 'update',
        value: function update(v) {
            this._render(v);
        }
    }]);

    return Watcher;
}();

var _dep = new Dep();
var defineProperty = function defineProperty(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function get() {
            if (Dep.target) {
                _dep.addWatcher(Dep.target);
            }
            Dep.target = null;
            return obj['' + key];
        },
        set: function set(v) {
            console.log('---');
            obj['' + key] = v;
            _dep.notify(obj);
        }
    });
    obj[key] = val;
    observer(val);
};

var observer = function observer(obj) {

    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        // console.log(obj, '不是对象')
        return;
    }
    Object.keys(obj).forEach(function (key) {
        defineProperty(obj, key, obj[key]);
    });
};

var Vue = function Vue(option) {
    _classCallCheck(this, Vue);

    observer(option.data);
    var _w = new Watcher(option.render);
    _w.update(option.data);
};

/**
 * 原理：
 * 1：有一个订阅者Dep，负责将通知发送给观察者
 * 2：有多个观察者watcher，当接收到订阅者发送的通知时，更新视图
 * 3：依赖收集：可以理解为将观察者注册进订阅者，在get中进行收集
 * 当修改data属性的值时，发送通知。也就是在set方法中发送通知
 * 整体流程：
 * 初始化vue对象时，当render函数生成后，创建观察者（watcher），然后将render函数传给观察者，用于更新视图。当watcher
 * 调用render时，会取data属性的值，这个时候会触发get方法，进行依赖收集。
 *
 * 例子使用方法：
 * 需要传两个参数，一个是data，一个是render函数，render函数接收一个参数，其实这个参数就是data，在函数中必须使用data中的属性
 * 只有这样，才会触发get方法，进而才可以进行依赖收集
 */