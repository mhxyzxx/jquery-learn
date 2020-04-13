(function (window, undefined) {
    var njQuery = function (selector) {
        return new njQuery.prototype.init(selector);
    }

    njQuery.prototype = {
        constructor: njQuery,
        init: function (selector) {
            //  判断以下几种情况：
            //  1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
            //  2.字符串:
            //  代码片段:会将创建好的DOM元素存储到jQuery对象中返回
            //  选择器: 会将找到的所有元素存储到jQuery对象中返回
            //  3.数组:
            //  会将数组中存储的元素依次存储到jQuery对象中立返回
            //  4.除上述类型以外的:
            //  会将传入的数据存储到jQuery对象中返回

            // 0.去除字符串两端的空格
            selector = njQuery.trim(selector);

            // 1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
            if (!selector) {
                return this;
            }
            // 2.方法处理
            else if (njQuery.isFunction(selector)) {
                // console.log('是方法');
                njQuery.ready(selector);
            }
            // 3.字符串
            else if (njQuery.isString(selector)) {
                // 2.1 如果是代码片段，注意判断最短长度为3
                if (njQuery.isHTML(selector)) {
                    // console.log('代码片段')

                    // 1.根据代码片段创建所有的元素
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;
                    // console.log(temp);

                    /*
                    // 2.将创建好的一级元素添加到jQuery当中
                    console.log(temp.children) // 刚好符合官方的API,只找到一级元素放到jQuery对象中
                    for (var i = 0; i < temp.children.length; i++) {
                        this[i] = temp.children[i]
                    }
                    // 3.给jQuery对象添加length属性
                    this.length = temp.children.length;
                    */
                    [].push.apply(this, temp.children);
                    // 4.返回加工好的this(jQuery)
                    // 此时此刻的this是njQuery对象
                    // return this;
                }
                // 2.2判断是否是选择器
                else {
                    // 1.根据传入的选择器找到对应的元素
                    var res = document.querySelectorAll(selector);
                    // 2.将找到的元素添加到njQuery上
                    // for (var i = 0; i < res.length; i++) {
                    //     this[i] = res[i]
                    // }
                    // 3.给jQuery对象添加length属性
                    // this.length = res.length;
                    // 2和3合并可使用下面方法：
                    [].push.apply(this, res);
                    // 3.返回加工上的this
                    // return this;
                }
            }
            // 4. 数组
            // else if (typeof selector === "object" && "length" in selector && selector !== window) {
            else if (njQuery.isArray(selector)) {
                // console.log('是数组');
                /*
                // 3.1 真数组
                if(({}).toString.apply(selector) === "[object Array]"){
                    [].push.apply(this, selector);
                    return this;
                }
                // 3.2 伪数组
                else {
                    // 将自定义的伪数组转换为真数组
                    var arr = [].slice.call(selector);
                    // 将真数组转换为伪数组
                    [].push.apply(this, arr);
                    return this;
                }
                */
                // 将自定义的伪数组转换为真数组
                var arr = [].slice.call(selector);
                // 将真数组转换为伪数组
                [].push.apply(this, arr);
                // return this;
            }
            // 5.除上述类型以外
            else {
                this[0] = selector;
                this.length = 1;
                // return this;
            }

            return this;

        },
        jquery: "1.1.0",
        selector: "", // jQuery入口函数默认选择器为空
        length: 0,// jQuery对象默认长度为0
        // [].push找到数组的push方法
        // 冒号前面的push将来由njQuery对象调用
        // 相当于 [].push.apply(this);
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        toArray: function () {
            // 其实就是将伪数组转为真数组
            return [].slice.call(this);
        },
        get: function (num) {
            // 没有传递参数
            if (arguments.length === 0) {
                return this.toArray();
            }
            // 传递不是负数
            else if (num >= 0) {
                return this[num];
            }
            // 传递负数
            else {
                return this[this.length + num];
            }
        },
        eq: function (num) {
            // 没有传递参数
            if (arguments.length === 0) {
                // 也可return this
                // 也可重新创建一个新的jQuery对象
                return new njQuery();
            } else {
                return njQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (fn) {
            return njQuery.each(this, fn);
        }

    }

    njQuery.extend = njQuery.prototype.extend = function (obj) {
        for (var key in obj) {
            // console.log(this);
            this[key] = obj[key];
        }
    }
    // 工具方法
    njQuery.extend({
        isString: function (str) { // 判断是不是字符串
            return typeof str == 'string';
        },
        isHTML: function (str) { // 判断是不是代码片段
            return str.charAt(0) == '<' && str.charAt(str.length - 1) == ">" && str.length >= 3;
        },
        trim: function (str) { // 去除前后空格，并实现trim的兼容性问题；trim()方法兼容ie9+版本
            if (!njQuery.isString(str)) {
                return str;
            }
            // 判断是否支持trim方法
            if (str.trim) {
                return str.trim();
            } else { // 把正则表达式匹配到元素，替换成空字符串；
                return str.replace(/^\s+|\s+$/g, "");
            }
        },
        isObject: function (sele) {
            return typeof sele === "object"
        },
        isWindow: function (sele) {
            return sele === window;
        },
        isArray: function (sele) {
            if (njQuery.isObject(sele) &&
                !njQuery.isWindow(sele) &&
                "length" in sele) {
                return true;
            }
            return false;
        },
        isFunction: function (sele) {
            return typeof sele === "function";
        },
        ready: function (fn) {
            // 判断DOM是否加载完毕
            if (document.readyState == "complete") {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", function () {
                    fn();
                });
            } else {
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState == "complete") {
                        fn();
                    }
                });
            }
        },
        each: function (obj, fn) {
            // 1. 判断是否是数组
            if (njQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    // fn(i, obj[i]);
                    var res = fn.call(obj[i], i, obj[i]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            // 2. 判断是否为对象
            else if (njQuery.isObject(obj)) {
                for (var key in obj) {
                    // fn(key, obj[key]);
                    var res = fn.call(obj[key], key, obj[key]);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        map: function (obj, fn) {
            var res = [];
            // 1.判断是否是数组
            if (njQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var temp = fn(obj[i], i);
                    // res.push(temp); // 当有值时，才添加到新数组中
                    if (temp) {
                        res.push(temp);
                    }
                }

            }
            // 2.判断是否是对象
            else if (njQuery.isObject(obj)) {
                for (var key in obj) {
                    var temp = fn(obj[key], key);
                    // res.push(temp); // 当有值时，才添加到新数组中
                    if (temp) {
                        res.push(temp);
                    }
                }

            }
            return res;
        },
        // 来源: http://www.w3school.com.cn/xmldom/prop_node_nextsibling.asp
        get_nextsibling: function (n) {
            var x = n.nextSibling;
            while (x != null && x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        },
        get_previoussibling: function (n) {
            var x = n.previousSibling;
            while (x != null && x.nodeType != 1) {
                x = x.previousSibling;
            }
            return x;
        },
        getStyle: function (dom, styleName) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[styleName];
            } else {
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function (dom, name, callBack) {
            if (dom.addEventListener) {
                dom.addEventListener(name, callBack);
            } else {
                dom.attachEvent("on" + name, callBack);
            }
        }
    });
    // DOM操作相关方法
    njQuery.prototype.extend({
        empty: function () {
            // 1.遍历指定的元素
            this.each(function (key, value) {
                value.innerHTML = "";
            });
            // 2.方便链式编程
            return this;
        },
        remove: function (sele) {
            if (arguments.length === 0) {
                // 1.遍历指定的元素
                this.each(function (key, value) {
                    // 根据遍历到的元素找到对应的父元素
                    var parent = value.parentNode;
                    // 通过父元素删除指定的元素
                    parent.removeChild(value);
                });
            } else {
                var $this = this;
                // 1.根据传入的选择器找到对应的元素
                $(sele).each(function (key, value) {
                    // 2.遍历找到的元素, 获取对应的类型
                    var type = value.tagName;
                    // 3.遍历指定的元素
                    $this.each(function (k, v) {
                        // 4.获取指定元素的类型
                        var t = v.tagName;
                        // 5.判断找到元素的类型和指定元素的类型
                        if (t === type) {
                            // 根据遍历到的元素找到对应的父元素
                            var parent = value.parentNode;
                            // 通过父元素删除指定的元素
                            parent.removeChild(value);
                        }
                    });
                })
            }
            return this;
        },
        html: function (content) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            } else {
                this.each(function (key, value) {
                    value.innerHTML = content;
                })
            }
        },
        text: function (content) {
            if (arguments.length === 0) {
                var res = "";
                this.each(function (key, value) {
                    res += value.innerText;
                });
                return res;
            } else {
                this.each(function (key, value) {
                    value.innerText = content;
                });
            }
        },
        appendTo: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            // var $target = $(sele);
            // var $this = this; // 方法的调用者
            // // 1.遍历取出所有指定的元素
            // for (var i = 0; i < $target.length; i++) {
            //     var targetEle = $target[i];
            //     // 2.遍历取出所有的元素
            //     for (var j = 0; j < $this.length; j++) {
            //         var sourceEle = $this[j];

            //         // 3.判断当前是否是第0个指定的元素
            //         if (i === 0) {
            //             // 直接添加
            //             targetEle.appendChild(sourceEle);
            //         } else {
            //             // 先拷贝再添加
            //             var temp = sourceEle.cloneNode(true);
            //             targetEle.appendChild(temp);
            //         }
            //     }
            // }

            // 优化方法：
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this; // 方法的调用者
            var res = [];
            // 1.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        value.appendChild(v);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        value.appendChild(temp);
                        res.push(temp);
                    }
                });
            })
            // 3.返回所有添加的元素
            return $(res);
        },
        prependTo: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        value.insertBefore(v, value.firstChild);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        value.insertBefore(temp, value.firstChild);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        append: function (sele) {
            // 判断传入的参数是否是字符串
            if (njQuery.isString(sele)) {
                this[0].innerHTML += sele;
            } else {
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function (sele) {
            // 判断传入的参数是否是字符串
            if (njQuery.isString(sele)) {
                this[0].innerHTML = sele + this[0].innerHTML;
            } else {
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        parent.insertBefore(v, value);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, value);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        insertAfter: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                var nextNode = $.get_nextsibling(value);
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        parent.insertBefore(v, nextNode);
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, nextNode);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
        replaceAll: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if (key === 0) {
                        // 1.将元素插入到指定元素的前面
                        $(v).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(v);
                    } else {
                        // 先拷贝再添加
                        var temp = v.cloneNode(true);
                        // 1.将元素插入到指定元素的前面
                        $(temp).insertBefore(value);
                        // 2.将指定元素删除
                        $(value).remove();
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        }
    });
    // 筛选相关方法
    njQuery.prototype.extend({
        next: function (sele) {
            var res = [];
            if (arguments.length === 0) {
                // 返回所有找到的
                this.each(function (key, value) {
                    var temp = njQuery.get_nextsibling(value);
                    if (temp != null) {
                        res.push(temp);
                    }
                });
            } else {
                // 返回指定找到的
                this.each(function (key, value) {
                    var temp = njQuery.get_nextsibling(value)
                    $(sele).each(function (k, v) {
                        if (v == null || v !== temp) return true;
                        res.push(v);
                    });
                });
            }
            return $(res);
        },
        prev: function (sele) {
            var res = [];
            if (arguments.length === 0) {
                this.each(function (key, value) {
                    var temp = njQuery.get_previoussibling(value);
                    if (temp == null) return true;
                    res.push(temp);
                });
            } else {
                this.each(function (key, value) {
                    var temp = njQuery.get_previoussibling(value);
                    $(sele).each(function (k, v) {
                        if (v == null || temp !== v) return true;
                        res.push(v);
                    })
                });
            }
            return $(res);
        }
    });
    // 属性操作相关的方法
    njQuery.prototype.extend({
        attr: function (attr, value) {
            // 1.判断是否是字符串
            if (njQuery.isString(attr)) {
                // 判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return this[0].getAttribute(attr);
                } else {
                    this.each(function (key, ele) {
                        ele.setAttribute(attr, value);
                    });
                }
            }
            // 2.判断是否是对象
            else if (njQuery.isObject(attr)) {
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.setAttribute(key, value);
                    });
                });
            }
            return this;
        },
        prop: function (attr, value) {
            // 1.判断是否是字符串
            if (njQuery.isString(attr)) {
                // 判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return this[0][attr];
                } else {
                    this.each(function (key, ele) {
                        ele[attr] = value;
                    });
                }
            }
            // 2.判断是否是对象
            else if (njQuery.isObject(attr)) {
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele[key] = value;
                    });
                });
            }
            return this;
        },
        css: function (attr, value) {
            // 1.判断是否是字符串
            if (njQuery.isString(attr)) {
                // 判断是一个字符串还是两个字符串
                if (arguments.length === 1) {
                    return njQuery.getStyle(this[0], attr);
                } else {
                    this.each(function (key, ele) {
                        ele.style[attr] = value;
                    });
                }
            }
            // 2.判断是否是对象
            else if (njQuery.isObject(attr)) {
                var $this = this;
                // 遍历取出所有属性节点的名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.style[key] = value;
                    });
                });
            }
            return this;
        },
        val: function (content) {
            if (arguments.length === 0) {
                return this[0].value;
            } else {
                this.each(function (key, ele) {
                    ele.value = content;
                });
                return this;
            }
        },
        hasClass: function (name) {
            var flag = false;
            if (arguments.length === 0) {
                return flag;
            } else {
                this.each(function (key, ele) {
                    // 1.获取元素中class保存的值
                    var className = " " + ele.className + " ";
                    // 2.给指定字符串的前后也加上空格
                    name = " " + name + " ";
                    // 3.通过indexOf判断是否包含指定的字符串
                    if (className.indexOf(name) != -1) {
                        flag = true;
                        return false; // 循环中return false相当于break;
                    }
                });
                return flag;
            }
        },
        addClass: function (name) {
            if (arguments.length === 0) return this;

            // 1.对传入的类名进行切割
            var names = name.split(" ");
            // 2.遍历取出所有的元素
            this.each(function (key, ele) {
                // 3.遍历数组取出每一个类名
                $.each(names, function (k, value) {
                    // 4.判断指定元素中是否包含指定的类名
                    if (!$(ele).hasClass(value)) {
                        ele.className = ele.className + " " + value;
                    }
                });
            });
            return this;
        },
        removeClass: function (name) {
            if (arguments.length === 0) {
                this.each(function (key, ele) {
                    ele.className = "";
                });
            } else {
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if ($(ele).hasClass(value)) {
                            ele.className = (" " + ele.className + " ").replace(" " + value + " ", "");
                        }
                    });
                });
            }
            return this;
        },
        toggleClass: function (name) {
            if (arguments.length === 0) {
                this.removeClass();
            } else {
                // 1.对传入的类名进行切割
                var names = name.split(" ");
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断指定元素中是否包含指定的类名
                        if ($(ele).hasClass(value)) {
                            // 删除
                            $(ele).removeClass(value);
                        } else {
                            // 添加
                            $(ele).addClass(value);
                        }
                    });
                });
            }
            return this;
        }
    });
    // 事件操作相关的方法
    njQuery.prototype.extend({
        on: function (name, callBack) {
            // 1.遍历取出所有元素
            this.each(function (key, ele) {
                // 2.判断当前元素中是否有保存所有事件的对象
                if (!ele.eventsCache) {
                    ele.eventsCache = {};
                }
                // 3.判断对象中有没有对应类型的数组
                if (!ele.eventsCache[name]) {
                    ele.eventsCache[name] = [];
                    // 4.将回调函数添加到数据中
                    ele.eventsCache[name].push(callBack);
                    // 5.添加对应类型的事件
                    njQuery.addEvent(ele, name, function () {
                        njQuery.each(ele.eventsCache[name], function (k, method) {
                            // method(); // 也可使用下面方式调用
                            method.call(ele);
                        });
                    });
                } else {
                    // 6.将回调函数添加到数据中
                    ele.eventsCache[name].push(callBack);
                }
            });
            return this;
        },
    });

    njQuery.prototype.init.prototype = njQuery.prototype;
    window.njQuery = window.$ = njQuery;
})(window);