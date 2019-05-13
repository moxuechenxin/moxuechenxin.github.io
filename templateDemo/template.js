(function(root){
  // 对象扩展函数 (浅拷贝)
  function extend () {
    var target = arguments[0] || {};
    var len = arguments.length;
    var i = 1;
    var options, key;
    if (typeof target !== "object") {
      target = {};
    }
    // 遍历 templateSettings settings
    for (; i<len; i++) {
      if ((options = arguments[i]) != null) {
        for (key in options) {
          console.log(key);
          target[key] = options[key];
        }
      }
    }
    return target;
  }
  // 解析规则
  var templateSettings = {
    // 通过正则表达式解析
    /**
     * 可以匹配文档中任何一个位置。
     * \s 空白符
     * \S 非空白符
     * [\s\S]任意字符
     * [\s\S]* 0个到任意多个字符
     * [\s\S]*? 0个字符，匹配任何字符前的位置 
     */
    evalute: /<%([\s\S]+?)%>/g, // 逻辑
    interpolate: /<%=([\s\S]+?)%>/g, // 变量
    escape: /<%-([\s\S]+?)%>/g // 逃逸的字符
  };
  // 设置逃逸字符类
  var escape = {

  };
  escapeExp = /正则/; // 正则,替换字符串
  /** 
   * text: 带渲染模板
   * settings: 用户自定义规则
  */
  var template = function (text, settings) {  
    settings = extend({}, templateSettings, settings); // {} 表示赋值需要返回的内容 => 函数先遍历templateSettings赋值 => 然后遍历settings覆盖；若直接写templateSettings, settings，则函数直接遍历settings => 然后覆盖templateSettings
    // new RegExp(); // => 创建正则对象
    var matcher = RegExp([
      settings.escape.source,
      settings.interpolate.source,
      settings.evalute.source // js逻辑匹配放在最后 => 变量的写法也符合js逻辑的正则判断，所以先判断是否为变量，，不是才判断是否为js逻辑
    ].join("|"), "g"); // 返回正则模式
    console.log(matcher, 'matcher');
    var source = "_p+='"; // 执行头
    var index = 0;
    text.replace(matcher, (match, escape, interpolate, evalute, offset) => { // replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。offset => 下标
      source += text.slice(index, offset);
      index = offset + match.length
      // console.log(match, 'match', escape, 'escape', interpolate, 'interpolate', evalute, 'evalute', offset, 'offset')
      if (escape) {
        console.log(escape, 'escape')
      }else if (interpolate) {
        source += "'+\n((_t=("+interpolate+")) === null ? '' : _t)+\n'";
      }else if (evalute) {
        source += "';\n"+evalute+"\n_p+='";

      }
    });
    source += "';"
    source = "with(obj||{}){\n" + source +"}\n"
    source = "var _t,_p='';" + source + "return _p;\n";
    console.log(source, 'source');
    // var fn = new Function ("name", "alert(1)"); // 等价于函数function fn (name) {alert(1);}
    var render = new Function ("obj", source);
    // 预编译 缓存模板
    var template = function (data) {
      console.log(data)
      return render.call(this, data);
    }
    return template;
  };
  root.template = template; // 模板引擎核心函数
})(this);
