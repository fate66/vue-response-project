class Dep {
    constructor() {
        this._l = []
    }

    addWatcher(w) {
        this._l.push(w)
    }

    notify(v) {
        this._l.forEach(w => {
            w.update(v)
        })
    }
}

class Watcher {
    constructor(render) {
        this._render = render
        Dep.target = this
    }

    update(v) {
        this._render(v)
    }
}

const _dep = new Dep()
const defineProperty = function (obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            if (Dep.target) {
                _dep.addWatcher(Dep.target)
            }
            Dep.target = null
            return obj[`_${key}`]
        },
        set: v => {
            console.log('---')
            obj[`_${key}`] = v
            _dep.notify(obj)
        }
    })
    obj[key] = val
    observer(val)
}

const observer = function (obj) {

    if (!obj || typeof obj !== 'object') {
        // console.log(obj, '不是对象')
        return
    }
    Object.keys(obj).forEach(key => {
        defineProperty(obj, key, obj[key])
    })
}


class Vue {
    constructor(option) {
        observer(option.data)
        let _w = new Watcher(option.render)
        _w.update(option.data)
    }
}

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
