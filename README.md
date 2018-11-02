
模拟mvvm响应式，使用es6的语法，需要使用babel转换

1、clone 项目

git clone https://github.com/fate66/vue-response-project

2、安装依赖

npm install

3、构建项目

npm run build

4、运行

使用浏览器打开 index.html


例子：
创建对象，需要传两个参数，一个是data，一个是render函数，render函数接收一个参数，其实这个参数就是data，在函数中必须使用data中的属性
只有这样，才会触发get方法，进而才可以进行依赖收集

  <script type="text/javascript" src="dist/Vue.js"></script>

    new Vue({
        data: {a: 2},
        render: function (v) {
            console.log(v.a, '视图取值')
        }
    })
  手动在浏览器控制台改变属性a的值即可

原理：

1：有一个订阅者Dep，负责将通知发送给观察者

2：有多个观察者watcher，当接收到订阅者发送的通知时，更新视图

3：依赖收集：可以理解为将观察者注册进订阅者，在get中进行收集

当修改data属性的值时，发送通知。也就是在set方法中发送通知
整体流程：
初始化vue对象时，当render函数生成后，创建观察者（watcher），然后将render函数传给观察者，用于更新视图。当watcher
调用render时，会取data属性的值，这个时候会触发get方法，进行依赖收集。

