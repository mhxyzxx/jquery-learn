(function (window, undefined) {
    var njQuery = function (selector) {
        // console.log(new njQuery.prototype.init(selector))
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
            // 2.字符串
            else if (njQuery.isString(selector)) {
                // 2.1 如果是代码片段，注意判断最短长度为3
                if (njQuery.isHTML(selector)) {
                    // console.log('代码片段')

                    // 1.根据代码片段创建所有的元素
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;
                    // console.log(temp);

                    // 2.将创建好的一级元素添加到jQuery当中
                    console.log(temp.children) // 刚好符合官方的API,只找到一级元素放到jQuery对象中
                    for (var i = 0; i < temp.children.length; i++) {
                        this[i] = temp.children[i]
                    }
                    // 3.给jQuery对象添加length属性
                    this.length = temp.children.length;
                    // 4.返回加工好的this(jQuery)
                    // 此时此刻的this是njQuery对象
                    return this;
                }
            }

        }
    }
    njQuery.isString = function (str) { // 判断是不是字符串
        return typeof str == 'string';
    }
    njQuery.isHTML = function (str) { // 判断是不是代码片段
        return str.charAt(0) == '<' && str.charAt(str.length - 1) == ">" && str.length >= 3;
    }
    njQuery.trim = function (str) { // 去除前后空格，并实现trim的兼容性问题；trim()方法兼容ie9+版本
        // 判断是否支持trim方法
        if (str.trim) {
            return str.trim();
        } else { // 把正则表达式匹配到元素，替换成空字符串；
            return str.replace(/^\s+|\s+$/g, "");
        }
    }

    njQuery.prototype.init.prototype = njQuery.prototype;
    window.njQuery = window.$ = njQuery;
})(window);