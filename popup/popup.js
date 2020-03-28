(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : factory();
}(this, (function () { 'use strict';

  var popup = {
    sa:{},
    //基本信息
    info:{},
    lib_version: '0.1',
    //获取的配置和参数
    defaultPara:{
      platform: 'H5'    
    },
   //服务器数据   注意：不要修改这个数据，修改会导致引用类型错误！！！这个数据只能在ajax后直接赋值更新！！！
    serverData:{},
    //所有的本地规则数据，注意：这是一个引用的数据！！！后人不要随意修改这个数据，且在使用前必须先判断 localData 是否是空对象，如果是空的，就不要执行了。
    localData: {
      // 本地新增的数据
      global_popup_count: [],
      //本地更新时间，用来定时更新数据
      local_update_time: null
    },
    /**
     * 监控事件对应的规则映射，格式如下
     * {
     * '$pageview':[{plan:plan,rule:[matcher1,matcher1]},{plan2:plan2,rule:[]}]
     * }
     */
    eventRule: {},
    convertPlans:[],
    log: function(){
      try{
        console.log.apply(console,arguments);
      }catch(e){}  }


  };

  /**
   * @link https://github.com/taylorhakes/promise-polyfill/blob/master/dist/polyfill.min.js
   */
  !function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n();}(0,function(){function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(e){return !(!e||"undefined"==typeof e.length)}function t(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],c(e,this);}function r(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value);}catch(r){return void f(n.promise,r)}i(n.promise,o);}else(1===e._state?i:f)(n.promise,e._value);})):e._deferreds.push(n);}function i(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof o)return e._state=3,e._value=n,void u(e);if("function"==typeof t)return void c(function(e,n){return function(){e.apply(n,arguments);}}(t,n),e)}e._state=1,e._value=n,u(e);}catch(r){f(e,r);}}function f(e,n){e._state=2,e._value=n,u(e);}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value);});for(var n=0,t=e._deferreds.length;t>n;n++)r(e,e._deferreds[n]);e._deferreds=null;}function c(e,n){var t=!1;try{e(function(e){t||(t=!0,i(n,e));},function(e){t||(t=!0,f(n,e));});}catch(o){if(t)return;t=!0,f(n,o);}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,n){var o=new this.constructor(t);return r(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t;}(e,n,o)),o},o.prototype["finally"]=e,o.all=function(e){return new o(function(t,o){function r(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var u=n.then;if("function"==typeof u)return void u.call(n,function(n){r(e,n);},o)}i[e]=n,0==--f&&t(i);}catch(c){o(c);}}if(!n(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u]);})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e);})},o.reject=function(e){return new o(function(n,t){t(e);})},o.race=function(e){return new o(function(t,r){if(!n(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)o.resolve(e[i]).then(t,r);})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e);}||function(e){a(e,0);},o._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=o;});

  var _ = {
    visibility:function (obj){
      obj = obj || {};
      var visibly = {
          // document.hidden name
          hidden:undefined,
          // visibilityChange name
          visibilityChange:undefined,

          isSupported: function () {
              return (typeof this.hidden !== "undefined");
          },
          _visible: obj.onVisible,
          _hidden: obj.onHidden,
          _nativeSwitch: function () {
              ((document[this.hidden]) === true) ? this._hidden() : this._visible();
          },
          listen: function () {
            try { /*if no native page visibility support found..*/
                if (!(this.isSupported())) {
                    if (document.addEventListener) { /*for browsers without focusin/out support eg. firefox, opera use focus/blur*/
  /*window used instead of doc as Opera complains otherwise*/
                        window.addEventListener('foucus', this._visible, 1);
                        window.addEventListener('blur', this._hidden, 1);
                    } else { /*IE <10s most reliable focus events are onfocusin/onfocusout*/
                        document.attachEvent('onfocusin', this._visible);
                        document.attachEvent('onfocusout', this._hidden);
                    }
                } else { /*switch support based on prefix*/
                    document.addEventListener(this.visibilityChange, function () {
                        visibly._nativeSwitch.apply(visibly, arguments);
                    }, 1);
                }
            } catch (e) {}        },
          init: function () {
              if (typeof document.hidden !== "undefined") {
                  this.hidden = "hidden";
                  this.visibilityChange = "visibilitychange";
              } else if (typeof document.mozHidden !== "undefined") {
                  this.hidden = "mozHidden";
                  this.visibilityChange = "mozvisibilitychange";
              } else if (typeof document.msHidden !== "undefined") {
                  this.hidden = "msHidden";
                  this.visibilityChange = "msvisibilitychange";
              } else if (typeof document.webkitHidden !== "undefined") {
                  this.hidden = "webkitHidden";
                  this.visibilityChange = "webkitvisibilitychange";
              }
              this.listen();
          }
      };

      visibly.init();

    },
    getRgba: function (value) {
      if (typeof value !== "object") {
        return value;
      }
      return "rgba(" + value.r + "," + value.g + "," + value.b + "," + value.a + ")";
    },
    conversionNum: function (value) {
      if (!value) {
        return
      }

      if (/^[0|1]?\.\d+$/.test(value)) {
        return Number(value) * 100 + "%";
      }

      var regVal = /^(-?\d+(\.\d+)?)px$/.exec(value);
      if (regVal) {
        return ((Number(regVal[1]) / 375) * window.screen.width).toFixed(2) + "px";
      }

      return value;
    },
    boxModel: function (type) {
      return function (val) {
        if (typeof val !== "object") {
          return val;
        }
        var str = "";
        for (var key in val) {
          str += type + "-" + key + ":" + _.conversionNum(val[key]) + ";";
        }
        return str;
      };
    },
    localStorage: {
      get: function (name) {
        return window.localStorage.getItem(name);
      },

      parse: function (name) {
        var storedValue = null;
        try {
          storedValue = JSON.parse(_.localStorage.get(name)) || null;
        } catch (err) {
        }
        return storedValue;
      },

      set: function (name, value) {
        window.localStorage.setItem(name, value);
      },

      remove: function (name) {
        window.localStorage.removeItem(name);
      },

      isSupport: function () {
        var supported = true;
        try {
          var key = '__sensorsdatasupport__';
          var val = 'testIsSupportStorage';
          _.localStorage.set(key, val);
          if (_.localStorage.get(key) !== val) {
            supported = false;
          }
          _.localStorage.remove(key);
        } catch (err) {
          supported = false;
        }
        return supported;
      }
    },
    /**
     * 处理事件监听
     * @param {*} element 
     * @param {*} type 
     * @param {*} handler 
     */
    addEvent: function (element, type, handler) {
      if (element && element.addEventListener) {
        element.addEventListener(
          type,
          function (e) {
            handler.call(this, e);
          },
          false
        );
      } else {
        var ontype = "on" + type;
        element[ontype] = function (e) {
          if (!e) {
            return undefined;
          }
          e.target = e.target || e.srcElement;
          handler.call(element, e);
        };
      }
    },
    // 普通的extend，不能到二级
    extend: function (obj) {
      var slice = Array.prototype.slice;
      _.each(slice.call(arguments, 1), function (source) {
        for (var prop in source) {
          if (source[prop] !== void 0) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    },
    each: function (obj, iterator, context) {
      var nativeForEach = Array.prototype.forEach;
      var breaker = {};
      if (obj == null) {
        return false;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
            return false;
          }
        }
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) {
              return false;
            }
          }
        }
      }
    },
    xhr: function (cors) {
      if (cors) {
        if (typeof window.XMLHttpRequest !== 'undefined' && ("withCredentials" in new XMLHttpRequest())) {
          return new XMLHttpRequest();
        } else if (typeof XDomainRequest !== "undefined") {
          return new XDomainRequest();
        } else {
          return null;
        }
      } else {
        if (typeof window.XMLHttpRequest !== 'undefined') {
          return new XMLHttpRequest();
        }
        if (window.ActiveXObject) {
          try {
            return new ActiveXObject('Msxml2.XMLHTTP')
          } catch (d) {
            try {
              return new ActiveXObject('Microsoft.XMLHTTP')
            } catch (d) {
            }
          }
        }
      }
    },
    ajax: function (para) {
      para.timeout = para.timeout || 20000;

      para.credentials = (typeof para.credentials) === 'undefined' ? true : para.credentials;
      function getJSON(data) {
        if (!data) {
          return '';
        }
        try {
          return JSON.parse(data);
        } catch (e) {
          return {};
        }
      }

      var g = _.xhr(para.cors);

      if (!g) {
        return false;
      }

      if (!para.type) {
        para.type = para.data ? 'POST' : 'GET';
      }
      para = _.extend({
        success: function () { },
        error: function () { }
      }, para);

      try {
        if (typeof g === 'object' && ('timeout' in g)) {
          g.timeout = para.timeout;
        } else {
          setTimeout(function () {
            g.abort();
          }, para.timeout + 500);
        }
      } catch (e) {
        try {
          setTimeout(function () {
            g.abort();
          }, para.timeout + 500);
        } catch (e2) { }    }
      g.onreadystatechange = function () {
        try {
          if (g.readyState == 4) {
            if ((g.status >= 200 && g.status < 300) || g.status == 304) {
              para.success(getJSON(g.responseText));
            } else {
              para.error(getJSON(g.responseText), g.status);
            }
            g.onreadystatechange = null;
            g.onload = null;
          }
        } catch (e) {
          g.onreadystatechange = null;
          g.onload = null;
        }
      };

      g.open(para.type, para.url, true);

      try {
        if (para.credentials) {
          g.withCredentials = true;
        }
        if (_.isObject(para.header)) {
          for (var i in para.header) {
            g.setRequestHeader(i, para.header[i]);
          }
        }

        if (para.data) {
          if (!para.cors) {
            g.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          }
          if (para.contentType === 'application/json') {
            g.setRequestHeader("Content-type", "application/json; charset=UTF-8");
          } else {
            g.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          }

        }
      } catch (e) { }
      g.send(para.data || null);

    },
    getUuid: function () {
      var T = function () {
        var d = 1 * new Date(), i = 0;
        while (d == 1 * new Date()) {
          i++;
        }
        return d.toString(16) + i.toString(16);
      };

      var R = function () {
        return Math.random().toString(16).replace('.', '');
      };


      return function () {
        var val = (T() + '-' + R() + '-' + R());
        if (val) {
          return val;
        } else {
          return (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15);
        }
      };
    },
    trim: function (str) {
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    isEmptyObject: function (obj) {
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      if (_.isObject(obj)) {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    filter: function (arr, fn, self) {
      var hasOwn = Object.prototype.hasOwnProperty;
      if (arr.filter) {
        return arr.filter(fn);
      }
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        if (!hasOwn.call(arr, i)) {
          continue;
        }
        var val = arr[i];
        if (fn.call(self, val, i, arr)) {
          ret.push(val);
        }
      }
      return ret;
    },
    isObject: function (obj) {
      if (obj == null) {
        return false;
      } else {
        return (Object.prototype.toString.call(obj) == '[object Object]');
      }
    },
    isArray: Array.isArray || function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    },
    isString: function(obj) {
      return Object.prototype.toString.call(obj) == '[object String]';
    },
    isDate: function(obj) {
      return Object.prototype.toString.call(obj) == '[object Date]';
    },
    isBoolean:function(obj) {
      return Object.prototype.toString.call(obj) == '[object Boolean]';
    },
    isNumber: function(obj) {
      return (Object.prototype.toString.call(obj) == '[object Number]' && /[\d\.]+/.test(String(obj)));
    },
    isFunction: function(f) {
      if(!f){
        return false;
      }
      try {
        return /^\s*\bfunction\b/.test(f);
      } catch (x) {
        return false;
      }
    },
    getURLSearchParams: function(queryString) {
      queryString = queryString || "";
      var decodeParam = function(str) {
        return decodeURIComponent(str);
      };
      var args = {};                             // Start with an empty object
      var query = queryString.substring(1);  // Get query string, minus '?'
      var pairs = query.split("&");              // Split at ampersands
      for(var i = 0; i < pairs.length; i++) {    // For each fragment
        var pos = pairs[i].indexOf('=');       // Look for "name=value"
        if (pos === -1) continue;               // If not found, skip it
        var name = pairs[i].substring(0,pos);  // Extract the name
        var value = pairs[i].substring(pos+1); // Extract the value
        name = decodeParam(name);       // Decode the name
        value = decodeParam(value);     // Decode the value
        args[name] = value;                    // Store as a property
      }
      return args;                               // Return the parsed arguments
    },
    /**
   * 解析URL
   * @param {string} url
   * @return {Object} 一个 URL 对象或者普通JS对象
   *
   * @example
   * var url = _.URL('http://www.domain.com:8080/path/index.html?project=testproject&query1=test&silly=willy&field[0]=zero&field[2]=two#test=hash&chucky=cheese');
   *
   * url.hostname; // => www.domain.com
   * url.searchParams.get('project'); // => testproject
   */
    URL: function(url) {
      var result = {};
      var basicProps = ['hash', 'host', 'hostname', 'href', 'origin', 'password', 'pathname', 'port', 'protocol', 'search', 'username'];
      // Some browsers allow objects to be created via URL constructor, but instances do not have the expected url properties.
      // See https://www.caniuse.com/#feat=url
      var isURLAPIWorking = function() {
        var url;
        try {
          url = new URL('http://modernizr.com/');
          return url.href === 'http://modernizr.com/';
        } catch (e) {
          return false;
        }
      };
      if (typeof window.URL === 'function' && isURLAPIWorking()) {
        result = new URL(url);
        if (!result.searchParams) {
          result.searchParams = (function(){
            var params = _.getURLSearchParams(result.search);
            return {
              get: function(searchParam) {
                return params[searchParam];
              }
            };
          })();
        }
      } else {
        var _regex = /^https?:\/\/.+/;
        if(_regex.test(url) === false) {
          throw 'Invalid URL';
        }
        var link = document.createElement('a');
        link.href = url;
        for (var i = basicProps.length - 1; i >= 0; i--) {
          var prop = basicProps[i];
          result[prop] = link[prop];
        }
        if (result.hostname && typeof result.pathname === "string" && result.pathname.indexOf('/') !== 0) {
          result.pathname = '/' + result.pathname;
        }
        result.searchParams = (function(){
          var params = _.getURLSearchParams(result.search);
          return {
            get: function(searchParam) {
              return params[searchParam];
            }
          };
        })();
      }
      return result;
    }
  };

  popup._ = _;

  /**
   * @file render.js
   * @date 2020/02/22
   * @description 根据配置渲染弹框
   */


  var IMAGE_MAP={
    close:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAe1BMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////NgkbwAAAAKHRSTlMA5if6t/B0UjMSxpAtJB4MBfTr30oY6NjV0r2loZ6XkoaBenFp3UA/LNePaQAAAsxJREFUWMOsltlygzAMRRXMZsAsAZJmX9v6/7+wg1QXpjGxCDkvyWTIQZauDcCgzKLrPtnUSyGW9SbZX6OshDcQh36lH6j8MJ7pTZd6lGX6sr0IP7SDj7CA6chLoBkEFzm14nM1/P/2eGti1RZFq+LmdtwGw7afJ1Ue1dogcGCW4QptqCO2OPe1IbnL0Y7dE23wc2bJgSn44MFTvIMwLeMUXqZGfGKUkp+MPC2dwUjMGhWwUL7pnXRUsdbIIpow84VG1k9Xmf1e5U8Kq/R/68memAPqcggTCQUNc9SdL+iCL5jMd0B1j/RErh3LYrRyLa2po2x8KngJ9Uk5sWUwpZoVvIiiulNLhMwgHDhDED2MEH8X3zCDL4HV/R8lRTOEWYS0KWzt8GEm/mNLihpHKOeqJY6yLqDnbO42F1r9eXCzitMOfkuqfvkXTId6h1phSi5/ncbgneAtnDCAxTAzIn+POhfDFOObzAEsNLu0HXO06a4BCwd89wEk1h2ezdwl0rObvS5nNreHurg/lxKwsNPoHjXrHVhI+lMK3xjvMH4YelYzCSzc8V3zrx9CWtu5MG67eWEdhBSmI+GT7eIZt+Nny7YJ+y8ON9/cF1tWVL7LzTdTi6sSMtw9AE432wwl7u6MzqotMNwcM7Glc/TafRyB4+aa4dhdcoV993EDlptphlt3zZ72TgM8N88MDe3vDQWE5V6tWGaKyAbwqaiA5+aZQeETkk6QFtxuvhlaOkVwwxfgdq/IvHKbocBj6ac5OzYCIASBKGo10n+HBgakMswbaYDgTmX3fzgafhD4G+Hhg1cGXnT4PMFHVayCdVcBXGBu7cKwACOOC2YwTsIQ7KI7LBywJrlyByupK9Kw/lto4VFLAqLdmRwJiBDWwjDOI0QPPhPXRn3yTlyrILND4w7oOw3h5AlTPk5U/ddrZSk4RWW+C9hp2rgru6GiP/678n2UFPV1AAAAAElFTkSuQmCC'
  };

  var ERROR_CODE ={
    1000: "图片加载失败，请重新扫码"
  };

  var NODE_NAME_MAP = {
    // row 横向布局，设置flex布局
    row: "div",
    column: "div",
    // 标题和内容，使用pre，可以识别换行符
    label: "pre",
    image: "img",
    button: "button",
    // link只返回了height，没有lineheight, 所有切换成button，可以自动撑满 height，或者可以使用p，必须要加上line-height
    link: "button",
    image_button: "img"
  };

  var NODE_STYLE_MAP= {
    textAlign: "text-align",
    lineHeight: "line-height",
    font: "font-size",
    backgroundColor: "background-color",
    borderWidth: function(val){
     return "border-width: "+ val + ";border-style: solid;";
    },
    borderColor: "border-color",
    cornerRadius: "border-radius",
    backgroundImage: function(val) {
      return "background-image:url(" + val + ") no-repeat;";
    },
    margin: _.boxModel("margin"),
    padding: _.boxModel("padding"),
    maxHeight: "max-height",
    maxWidth: "max-width"
  };

  /**
   * @constructor
   * @class
   * @param {Object} data 配置文件
   */
  function ElementRender(data) {
    this.properties = data.properties;
    this.template = data.template;
    // 遮罩层元素
    this.maskEle = null;
    // 弹框元素
    this.containerEle = null;
    // 是否渲染弹框
    this.isRender = true;
    // 埋点使用的
    this.msg = { 
      $sf_msg_title: "",
      $sf_msg_content: "",
      $sf_msg_image_url: "",
      $sf_succeed: "",
      $sf_fail_reason: "",
      $sf_msg_id: "",
      plan: {},
    };
  }

  ElementRender.prototype = {
    constructor: ElementRender,
    /**
     * 入口函数
     * @param {*} callback 
     */
    render: function(callback) {
      var that = this;
      return that.loadHeadImage(that.template).then(function (message) {
        _.extend(that.msg, message);
        // 创建遮罩层
        if (that.properties.maskColor && that.isRender) {
          that.maskEle = that.getElement({
            nodeName: "div",
            style: that.getStyle({
              position: "fixed",
              width: "100%",
              height: "100%",
              top: "0px",
              left: "0px",
              backgroundColor: _.getRgba(that.properties.maskColor),
              "z-index": 9999
            })
          });
          document.body.appendChild(that.maskEle);
        }

        //设置根元素属性
        that.template.isRoot = true;

        // 创建弹框元素
        that.containerEle = that.createView(that.template);

        // 弹框绑定点击事件
        _.addEvent(that.containerEle, "click", function(e) {
          if (typeof callback === "function") {
            callback(e);
          }
        });

        
        // 遮罩层绑定点击事件
        if(that.properties.maskCloseEnabled && that.isRender){
            _.addEvent(that.maskEle, "click", function(e) {
              popup.track.maskClick(that);
            });
        }
        // 弹框插入页面中
        if(that.isRender){
          var plan_id = that.msg.plan.plan_id || "";

          document.body.appendChild(that.containerEle);
          that.msg.$sf_succeed = true;
          popup.track.popupDisplay(that);
          popup.info.popup_listener.onLoadSuccess(plan_id);
        }
      }, function(message){
        var plan_id = that.msg.plan.plan_id || "";
        _.extend(that.msg, message);
        that.msg.$sf_succeed = false;
        that.msg.$sf_fail_reason = ERROR_CODE[1000];
        popup.track.popupDisplay(that);
        popup.info.popup_listener.onLoadFailed(plan_id, 1000, ERROR_CODE[1000]);
      })
    },
    /**
     * 根据样式，属性，子节点，action创建元素，返回创建的元素
     * @param {*} obj 
     */
    getElement: function(obj) {
      var nodeName = obj.nodeName || "div";
      var style = obj.style;
      var attr = obj.attr;
      var child = obj.child;
      var action = obj.action;
      var element_info = obj.element_info;
      var ele = document.createElement(nodeName);   
      // 设置样式
      if (style) {
        ele.style = style;
      } 
      // 设置src，或者innertext
      if (attr) {
        _.each(attr,function(value,key){
           if(value){
             ele[key] = value;
           }
        });
      }
      // 插入子节点
      if (child && child.length) {
        _.each(child, function(value){
          if(!value){
            return false;
          }
          ele.appendChild(value);
        });
      }
      // 将action挂载到元素属性上
      if (action && action.H5 && action.H5.length) {
        ele.setAttribute("data-action", JSON.stringify(action.H5));
      }
      // 将元素类型挂载到元素属性上，埋点使用
      if(element_info){
        ele.setAttribute("data-ele-info", JSON.stringify(element_info));
      }
      return ele;
    },
    /**
     * 设置元素的样式
     * @param {*} style 
     */
    getStyle: function(style) {
      var styleStr = "";
      var arr = ['msgType','text','image','name','isHidden','align','localImageName'];
      _.each(style, function(value, key){
        var value = _.conversionNum(value);
        var keyMap = NODE_STYLE_MAP[key];

        if(arr.indexOf(key) >= 0){
          return false;
        }

        if (_.isString(keyMap)) {
          styleStr += keyMap + ":" + _.getRgba(value) + ";";
        } else if (_.isFunction(keyMap)) {
          styleStr += keyMap(value) + ";";
        } else {
          styleStr += key + ":" + _.getRgba(value) + ";";
        }

      });
      return styleStr;
    },
    /**
     * 递归创建弹框DOM节点
     * @param {*} template 
     */
    createView: function(template) {
      var child = [];
      var style = {
          "box-sizing": "border-box",
          display: "block",
          overflow: "hidden"
      };
      var attr = {};
      var nodeName = NODE_NAME_MAP[template.type] || null;
      // 最外层盒子没有properties，兼容处理
      template.properties = template.properties || {};

      if(template.properties.isHidden || !template.layout){
        return false;
      }
         
      if (template.properties.text) {
        attr.innerText = template.properties.text;
      } else if (template.properties.image) {
        if( template.properties.localImageName){
          attr.src = IMAGE_MAP[template.properties.localImageName];
        }else {
          attr.src = template.properties.image;
        }
      }
      

      // 根节点增加z-index属性
      if (template.isRoot) {
        style.position = "relative";
        style["z-index"] = 10000;
      }

      // 设置不同节点的样式
      switch(template.type){
        case "row":
          style.display = "flex";
          break;
        case "link":
          _.extend(style,{
            "text-decoration": "underline",
            outline: "none"
          });
          break;
        case "label":
          _.extend(style, {
            "white-space": "pre-wrap",
            "word-wrap": "break-word"
          });
          break;
        case "button":
          // 去除button的外边框
          style.outline = "none";
          break;
      }

      // 合并样式
      _.extend(style, template.layout, template.properties);
     
      // 创建子元素
      if (template.subviews && template.subviews.length > 0) {
        _.each(template.subviews, function(value) {
          child.push(this.createView(value));
        }, this);
      }

      // 创建元素
      var element = this.getElement({
        element_info: {
          $sf_msg_element_type: template.type,
          $sf_msg_element_content: template.properties.text || ""
        },
        nodeName: nodeName,
        attr: attr,
        style: this.getStyle(style),
        child: child,
        action: template.action
      });
      
      // 左对齐、右对齐，居中使用flex布局处理
      if(template.layout.align) {
          var alignMap = {
             "center":"center",
             "left":"flex-start",
             "right":"flex-end",
          };
          var container = document.createElement("div");
          // 当前是关闭按钮，并且点击遮罩层开启关闭
          if(template.properties.msgType === 'close' && this.properties.maskCloseEnabled){
            container.setAttribute("data-mask-close", 'true');
          }
          container.style = "display:flex;justify-content:"+ alignMap[template.layout.align] + ";";
          container.appendChild(element);
          return container;
      }

      return element;

    },
    /**
     * 关闭弹框
     */
    destory: function() {
      var plan_id = this.msg.plan.plan_id || "";

      popup.info.popup_listener.onClose(plan_id);
      document.body.removeChild(this.maskEle);
      document.body.removeChild(this.containerEle);
    },
    /**
     * 加载弹框中的图片
     * @param {*} template 
     */
    loadHeadImage: function (template) {
      var message = {
        $sf_msg_image_url : "",
        $sf_msg_title : "",
        $sf_msg_content : "",
      };

      function getImgSrc(template){
        _.each(template.subviews, function(temp){
          var properties = temp.properties;
          if(!properties){
            return false;
          }

          if(properties.msgType === "title"){
            message.$sf_msg_title = properties.text;
          }else if(properties.msgType === "content"){
            message.$sf_msg_content = properties.text;
          }else if(temp.type === "image"){
            message.$sf_msg_image_url = properties.image;
          }
          
          if(temp.subviews){
            getImgSrc(temp); 
          }
        });
      }
      getImgSrc(template);

      if (!message.$sf_msg_image_url) {
        return Promise.resolve(message);
      }

      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = message.$sf_msg_image_url;

        img.onload = function () {
          resolve(message);
        };

        img.onerror = function () {
          reject(message);
        };
      });
      
    }
  };

  popup.track = {
    /**
     * 获取埋点公共属性
     * @param {*} plan 
     * @param {*} uuid 
     */
    getPublicProps:function(msg){
      var plan = msg.plan;
     // 弹框埋点事件公共属性
     var publicProps = {
      // 弹框版本号
      $sf_popup_version: popup.lib_version,
      // 计划类型 服务端给
      $sf_plan_type: "运营计划",
      // 弹窗触达
      $sf_channel_service_name: "SENSORS_FOCUS",
      //弹窗分类
      $sf_channel_category: "POPUP",
      // 区分 PC WEB 和 H5
      $sf_platform_tag: popup.info.platform,
      // 消息ID
      $sf_msg_id: msg.$sf_msg_id
     };
   
      if(_.isEmptyObject(plan)){
        return publicProps;
      } else {
        // 计划 ID 服务端给
        publicProps.$sf_plan_id = plan.plan_id;
        // 对照组 服务端给 是对照组-1，不是对照组0
        publicProps.$sf_plan_strategy_id = plan.is_control_group ? -1 : 0;
        // 受众 ID 服务端给，受众为全部用户时，服务器端不返回受众id，受众 ID SDK 不上报
        if(plan.audience_id){
          publicProps.$sf_audience_id = plan.audience_id;
        }
      }
     
      return  publicProps
    },
    /**
     * 弹框展示
     * @param {*} ele 
     */
    popupDisplay: function(ele){
      var publicProps = popup.track.getPublicProps(ele.msg);
      var params = {
        $sf_msg_title: ele.msg.$sf_msg_title || "",
        $sf_msg_content: ele.msg.$sf_msg_content || "",
        $sf_succeed: ele.msg.$sf_succeed,
        $sf_fail_reason: ele.msg.$sf_fail_reason
      };
      _.extend(params, publicProps);
       popup.sa.track('$PlanPopupDisplay',params);
    },
    /**
     * 弹框点击
     * @param {*} params 
     */
    popupClick: function(params, ele){
      var publicProps = popup.track.getPublicProps(ele.msg);
      _.extend(params, publicProps);
      popup.sa.track('$PlanPopupClick',params);
    },
    /**
     * 遮罩层点击
     */
    maskClick: function (ele) {
      if(!ele.msg){
         return false;
      }
      var publicProps = popup.track.getPublicProps(ele.msg);
      var params = {
        $sf_close_type: "POPUP_CLOSE_MASK",
        $sf_msg_title: ele.msg.$sf_msg_title || "",
        $sf_msg_content: ele.msg.$sf_msg_content || "",
        $sf_msg_image_url: ele.msg.$sf_msg_image_url || "",
        // 弹窗按钮类型: 服务端返回的type字段：button、link，image
        $sf_msg_element_type: "mask",
        $sf_msg_element_content: "",
        $sf_msg_element_action: "",
        //点击行为 ID
        $sf_msg_action_id: ele.properties.maskActionId,
      };
      _.extend(params, publicProps);
      popup.track.popupClick(params,ele);
      ele.destory();
    },
    /**
     * 弹窗元素点击的回调函数
     */
    elementClickCallback: function(e,ele){
       /**@type {HTMLElement} **/
      var target = e.target;
      var action_value = target.getAttribute('data-action');
      var element_info = target.getAttribute('data-ele-info');
      var mask_close = target.getAttribute('data-mask-close');
      var msg = ele.msg || {};
      /**
       * 弹框关闭-点击遮罩层关闭
       * 关闭按钮外层包裹了div，点击到div上，遮罩层不会关闭，给div自定义属性判断点击div，关闭遮罩层
       */
      if(mask_close === 'true'){
        popup.track.maskClick(ele);
        return false;
      }

      if(!action_value){
        return false;
      }

      try {
        var action = JSON.parse(action_value) || {};
        var action_item = action[0];
        var info = JSON.parse(element_info) || {};
      } catch (e) {
        popup.log('elementClickCallback error', e);
      }

      // 调用元素点击的回调函数
      var actionObject = {
        type: action_item.type,
        value: _.isString(action_item.value) ? action_item.value : "",
        extra: _.isObject(action_item.value) ? action_item.value : ""
      };
      var plan_id = ele.msg.plan ? ele.msg.plan.plan_id : "";
      
      var params = {
        $sf_msg_title: msg.$sf_msg_title || "",
        $sf_msg_content: msg.$sf_msg_content || "",
        $sf_msg_image_url: msg.$sf_msg_image_url || "",
        $sf_msg_element_type: info.$sf_msg_element_type || "",
        $sf_msg_element_content: info.$sf_msg_element_content || "",
        $sf_msg_element_action: action_item.type,
        $sf_msg_action_id: action_item.id,
      };

      // 关闭按钮的点击-关闭按钮、关闭icon，遮罩
      if(action_item.type === 'close'){
        // action没有$sf_close_type字段，type为close，则表示是弹窗窗体内部按钮关闭
        if(!action_item.$sf_close_type){
          action_item.$sf_close_type = "POPUP_CLOSE_BUTTON";
        }
        params.$sf_close_type = action_item.$sf_close_type;
        popup.track.popupClick(params,ele);
        popup.info.popup_listener.onClick(plan_id, actionObject);
        ele.destory();
      } else {
        // 非关闭按钮的点击
        popup.track.popupClick(params,ele);
        popup.info.popup_listener.onClick(plan_id, actionObject);
        action_item.closeable ? ele.destory() : null;
        if(action_item.type === 'openlink'){
          var dom = document.createElement('a');
          dom.href = action_item.value;
          dom.target = "_blank";
          dom.click();
        } 
      }
    }
  };

  popup.testSend = {
      hasParam: function(){
          var params = _.URL(window.location.href).searchParams;
          var sf_popup_test = params.get('sf_popup_test') || '';
          var popup_window_id = params.get('popup_window_id') || '';
         
          if (!sf_popup_test || !popup_window_id) {
              return false;
          } else {
              return {
                  sf_popup_test: sf_popup_test,
                  popup_window_id: popup_window_id
              }
          }
      },
      start: function(){
          var project = popup.info.project;
          var popup_window_id = this.hasParam().popup_window_id;
          if(!popup_window_id){
            return
          }
          _.ajax({
              url: popup.info.api_base_url + '/sfo/popup_windows/'+ popup_window_id + '?project=' + project,
              type: 'GET',
              credentials: false,
              cors: true,
              contentType: 'application/json',
              success: function (data) {
                  if(!data || !data.content){
                     return false;
                  }
                  var template = JSON.parse(data.content);
                  var uuid = _.getUuid();
                  // 渲染弹框
                  var ele = new ElementRender(template);
                  ele.msg.$sf_msg_id = uuid;
                  // 处理弹框的点击操作和埋点
                  ele.render(function (e) {
                      popup.track.elementClickCallback(e, ele);
                  });
              }
          });
      }
  };

  /*
  popup的常用功能库

  */



  popup.isSupportPopup = function(){
    return _.localStorage.isSupport();
  };


  popup.listenPageStateChange = function(){
    var isShow = true;
    _.visibility({
      onVisible:function(){
        popup.log('页面触发visible-',new Date().getMinutes(),'分',new Date().getSeconds());
        if(isShow === false){
          popup.updateDataAndSetListen.startState();
          isShow = true;
        }
      },
      onHidden:function(){
        popup.log('页面触发hidden-',new Date().getMinutes(),'分',new Date().getSeconds());      
        if(isShow === true){
          popup.updateDataAndSetListen.stopAllState();
          isShow = false;
        }
      }
    });
  };


  popup.getWebSDK = function(){
    if(_.isObject(window.sensorsDataAnalytic201505) && _.isObject(window.sensorsDataAnalytic201505.readyState) && window.sensorsDataAnalytic201505.readyState.state >=3 ){
      return window.sensorsDataAnalytic201505;
    } else {
      return false;
    } 
  };

  /*
  project  
  platform
  api  

  */

  popup.setPara = function(para){
    if(!_.isObject(para)){
      para = {};
    }
    popup.info = _.extend({}, popup.defaultPara, para);


    popup.sa = this.getWebSDK();
    var sa = popup.sa;
    if(!sa){
      popup.log('web js sdk 还没有初始化完成');
      return false;
    }

    // api_base_url是否有效
    if(!_.isString(popup.info.api_base_url) || popup.info.api_base_url.slice(0,4) !== 'http'){
      //如果不是有效的http开头的字符串
      popup.log('popup 必须填写有效 api_base_url');
      return false;
    }else{
      //如果是有效的http开头的字符串
      if(popup.info.api_base_url.slice(0,5) === 'http:' && location.protocol === 'https:'){
        popup.log('您的当前页面是https的地址，api_base_url 也必须是https！');
        return false;
      }else{
        popup.info.api_base_url = popup.info.api_base_url.slice(-1) === '/' ? popup.info.api_base_url.slice(0,-1):popup.info.api_base_url; 
      }
    }


    // project是否有效
    if(!popup.info.project){
      popup.info.project = _.URL(sa.para.server_url).searchParams.get('project') || 'default';
    }

    if(!_.isObject(popup.info.popup_listener)){
      popup.info.popup_listener = {
        onClick: function(){},
        onLoadSuccess:function(){},
        onLoadFailed: function(){},
        onClose:function(){}
      };
    }else {
      if(!_.isFunction(popup.info.popup_listener.onClick)){
        popup.info.popup_listener.onClick = function(){};
      }
      if(!_.isFunction(popup.info.popup_listener.onLoadSuccess)){
        popup.info.popup_listener.onLoadSuccess = function(){};
      }
      if(!_.isFunction(popup.info.popup_listener.onLoadFailed)){
        popup.info.popup_listener.onLoadFailed = function(){};
      }
      if(!_.isFunction(popup.info.popup_listener.onClose)){
        popup.info.popup_listener.onClose = function(){};
      }
    }


    return true;

  };

  popup.init = function(para){
    // 不支持localStorage的话，再见。
    if(!this.isSupportPopup()){
      return false;
    }
    if(!this.setPara(para)){
      return false;
    }
    if(popup.testSend.hasParam()){
      popup.testSend.start();    
    }else{

      popup.listenPageStateChange();
      // 设置需要监听的事件
      popup.updateDataAndSetListen.initial();    
    }
  };

  var salog = popup.log;


  /**
   * 切换转化状态
   * @param {} data 
   */
  popup.changeCovertStatus = function(data){
    var arr = JSON.parse(JSON.stringify(popup.convertPlans));
   
    _.each(arr, function(item, index){
       var step = item.is_in_convert_window.step;
       var uuid = item.is_in_convert_window.uuid;
       popup.convertPlans[index].is_in_convert_window.step = Math.min(step * 2, 600000);
       if(!data){
         return false;
       }

       _.each(data, function(result){
          if(result.popup_display_uuid === uuid && result.convert_time){
              delete popup.convertPlans[index].is_in_convert_window;
              // 删除已经转化完成的plan，此处的删除不会删除popup.localData.popup_plans中的plan
              popup.convertPlans.splice(index, 1);
          }
       });
    });
  };
  /* 
   * 遍历所有plan，如果有is_in_convert_window(转化窗口)，则开始轮询转化
  */
  popup.asyncConvert = function(plan) {
    var project = popup.info.project;
    var flag = false;
    var timer = null;

    if(!plan && popup.convertPlans.length === 0){
      return false;
    }
    
    if(plan){
      _.each(popup.convertPlans,function(item){
        if(item.plan_id === plan.plan_id){
          flag = true;
        }
      });
    
      if(!flag){
        popup.convertPlans.push(plan);
      }
    }
    
    function convertStatusPolling() {
      if(_.isEmptyObject(popup.localData) || !_.isArray(popup.convertPlans) || popup.convertPlans.length === 0){
        return false;
      }
      var arr = popup.convertPlans;
      // 数组中最小的step
      var min_step = (arr[0].is_in_convert_window && arr[0].is_in_convert_window.step) || 5000;
      // 需要转化的uuid列表
      var uuid_list = [];
      
      _.each(arr, function(item){
        var convert_window = item.is_in_convert_window;

        // 当前时间超过最大转化期,不进行轮询转化
        if (Date.now() > convert_window.expire_time) {
          delete item.is_in_convert_window;
          return false;
        }

        // 将需要转化的uuid放到数组中
        uuid_list.push(convert_window.uuid);

        // 没有step，则进行初始化,5秒，10秒，最大600秒
        if(!convert_window.step){
          convert_window.step = 5000;
        }

        // 找到最小的step
        if(min_step > convert_window.step){
          min_step = convert_window.step;
        }
      });
      
      if(!uuid_list.length){
        return false;
      }
        
      if(timer){
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
          _.ajax({
            url: popup.info.api_base_url +'/sfo/popup_displays?project='+ project +'&popup_display_uuids='+ uuid_list,
            type: 'GET',
            cors: true,
            credentials: false,
            contentType: 'application/json',
            success: function (data) {
              popup.changeCovertStatus(data);
              convertStatusPolling();
            },
            error: function() {
              popup.changeCovertStatus();
              convertStatusPolling();
            }
          });
      }, min_step);
    }
      
    convertStatusPolling();
  };


  // 规则时间的转化
  // todo 优化代码
  popup.ruleTime = {
    //获取超时，固定窗口 {"value": 1,"unit": "day","natural": true}
    getExpire: function(rule_obj,time) {
      var last_time = time;
      //非自然天的count
      var countInterval = Number(rule_obj.value) || 0;
      //自然(天周月)的count
      var count = Number(rule_obj.value) || 0;
    // 单位
      var unit = String(rule_obj.unit).toLowerCase();

      var expire_time = null;

      var is_in = {
        day: function(){
          expire_time = new Date(last_time);
          expire_time.setHours(23);
          expire_time.setMinutes(59);
          expire_time.setSeconds(59);
          expire_time.setMilliseconds(999);           
          expire_time = expire_time.getTime() + 24*60*60*1000*count;

          return expire_time;
        },
        week: function(){
          expire_time = new Date(last_time);
          var current_week_day = expire_time.getDay();
          //周日0转换成周7
          if(current_week_day === 0){
            current_week_day = 7;
          }
          var current_week_remain = 7-current_week_day;
          expire_time.setHours(23);
          expire_time.setMinutes(59);
          expire_time.setSeconds(59);
          expire_time.setMilliseconds(999);           

          expire_time = expire_time.getTime() + current_week_remain*24*60*60*1000 + count*7*24*60*60*1000;

          return expire_time;
        },
        month: function(){
          expire_time = new Date(last_time);
          var current_month = expire_time.getMonth();
          var expire_month = current_month + count;

          if(expire_month >= 11){
            expire_time.setFullYear(expire_time.getFullYear() +  parseInt(expire_month/11));      
            expire_time.setMonth(expire_month%11);
          }else{
            expire_time.setMonth(expire_month);
          }
          expire_time.setDate(1);      
          expire_time.setHours(0);
          expire_time.setMinutes(0);
          expire_time.setSeconds(0);
          expire_time.setMilliseconds(0);           

          return expire_time.getTime();
        },
        second: function(unit){
          var interval = {
            month: 30*24*60*60*1000,
            week: 7*24*60*60*1000,
            day: 24*60*60*1000,
            hour: 60*60*1000,
            minute: 60*1000,
            second: 1000
          };
          var interval_time = null;
          expire_time = new Date(last_time);
          if(unit in interval){
            interval_time = interval[unit]*countInterval;
          }
          return expire_time.getTime() + interval_time;
        }
      };


      if(rule_obj.natural === true){
        if(unit in is_in){
          return is_in[unit]();
        }
      }else{
        return is_in.second(unit);
      }
    },
    //滑动窗口
    getLast: function(rule_obj, current_time){
      //非自然天的count
      var countInterval = Number(rule_obj.value) || 0;
      //自然天的count
      var count = Number(rule_obj.value)-1 || 0;
    // 单位
      var unit = String(rule_obj.unit).toLowerCase();

      //last_time
      var expire_time = null;

      var is_in = {
        day: function(){
          expire_time = new Date(current_time);
          expire_time.setHours(0);
          expire_time.setMinutes(0);
          expire_time.setSeconds(0);
          expire_time.setMilliseconds(0);
          expire_time = expire_time.getTime() - 24*60*60*1000*count;

          return expire_time;
        },
        week: function(){
          expire_time = new Date(current_time);
          var current_week_day = expire_time.getDay();
          //周日0转换成周7,确保统一日期（1-7）
          if(current_week_day === 0){
            current_week_day = 7;
          }
          //(周1的话，直接去当天0点。不需要-1。周2的话，去当天0点，还要-1天)
          --current_week_day;

          expire_time.setHours(0);
          expire_time.setMinutes(0);
          expire_time.setSeconds(0);
          expire_time.setMilliseconds(0);        

          expire_time = expire_time.getTime() - (current_week_day*24*60*60*1000 + count*7*24*60*60*1000);

          return expire_time;
        },
        month: function(){
          
          expire_time = new Date(current_time);

          var current_month = expire_time.getMonth() +1;

          var expire_month = current_month - count;

          if(expire_month <= 0){
            expire_time.setFullYear(expire_time.getFullYear() + (parseInt(expire_month/12) -1));      
            expire_time.setMonth(12 + expire_month%12 -1);
          }else{
            expire_time.setMonth(expire_month-1);
          }
          expire_time.setDate(1);      
          expire_time.setHours(0);
          expire_time.setMinutes(0);
          expire_time.setSeconds(0);
          expire_time.setMilliseconds(0);           

          return expire_time.getTime();
        },
        second: function(unit){
          var interval = {
            month: 30*24*60*60*1000,
            week: 7*24*60*60*1000,
            day: 24*60*60*1000,
            hour: 60*60*1000,
            minute: 60*1000,
            second: 1000
          };
          var interval_time = null;
          expire_time = new Date(current_time);
          if(unit in interval){
            interval_time = interval[unit]*countInterval;
          }
          return expire_time.getTime() - interval_time;
        }
      };


      if(rule_obj.natural === true){
        if(unit in is_in){
          return is_in[unit]();
        }
      }else{
        return is_in.second(unit);
      }
    },
    //遍历
    getArrMatchCount: function(arr, last_time){
      var i=0;
      for(i=0; i<arr.length;i++){
        if(last_time >= arr[i]){
          return i;
        }
      }
      return arr.length;
    },
    //  todo 可以删除了
    checkRule: function(rule_obj,time){
      var current_time = new Date();
      var last_time = time;
      //非自然天的count
      var countInterval = Number(rule_obj.value) || 0;
      //自然天的count
      var count = Number(rule_obj.value)-1 || 0;
    // 单位
      var unit = String(rule_obj.unit).toLowerCase();

      var expire_time = null;

      var is_in = {
        day: function(){
          expire_time = new Date(last_time);
          expire_time.setHours(23);
          expire_time.setMinutes(59);
          expire_time.setSeconds(59);
          expire_time.setMilliseconds(999);           

          expire_time = expire_time.getTime() + 24*60*60*1000*count;


          return current_time > expire_time;
        },
        week: function(){
          expire_time = new Date(last_time);
          var current_week_day = expire_time.getDay();
          //周日0转换成周7
          if(current_week_day === 0){
            current_week_day = 7;
          }
          var current_week_remain = 7-current_week_day;
          expire_time.setHours(23);
          expire_time.setMinutes(59);
          expire_time.setSeconds(59);
          expire_time.setMilliseconds(999);           

          expire_time = expire_time.getTime() + current_week_remain*24*60*60*1000 + count*7*24*60*60*1000;

          return current_time > expire_time;
        },
        month: function(){
          expire_time = new Date(last_time);
          var current_month = expire_time.getMonth();
          var expire_month = current_month + count;

          if(expire_month >= 11){
            expire_time.setFullYear(expire_time.getFullYear() + expire_month/11);      
            expire_time.setMonth(expire_month%11);
          }else{
            expire_time.setMonth(expire_month);
          }
          expire_time.setDate(1);      
          expire_time.setHours(0);
          expire_time.setMinutes(0);
          expire_time.setSeconds(0);
          expire_time.setMilliseconds(0);           

          return current_time > expire_time;
        },
        second: function(unit){
          var inerval = {
            month: 30*24*60*60*1000,
            week: 7*24*60*60*1000,
            day: 24*60*60*1000,
            hour: 60*60*1000,
            minute: 60*1000,
            second: 1000
          };
          var inerval_time = null;
          expire_time = new Date(last_time);
          if(unit in inteval){
            interval_time = inerval[unit]*countInterval;
          }
          return current_time > (expire_time+inerval_time);
        }
      };


      if(rule_obj.natural === true){
        if(unit in is_in){
          return is_in[unit]();
        }
      }else{
        return is_in.second(unit);
      }

    }


  };



  /*
  localData新增的数据
  {
    global_popup_count:[ ]
  }


  plan新增的数据结构
  {
    is_in_popup_interval_window（弹窗间隔）: 间隔超时   
    is_in_convert_window(转化间隔): {
      step: 步骤状态
      expire_time: 超时时间
      uuid: 弹窗id
    }   
    is_in_popup_limit_window:{
      time: 超时
      count：当前弹窗次数
    }
  }

  matcher新增的数据结构
  {
    is_in_window:{
      expire_time
      count:
    }
  }



  */



  /*
  事件触发后的流程
  @param matchlist[{
    plan:
    rule:
    match_state:  //RuleCheck 后用来标记当前plan是否匹配
  }]
  */
  popup.eventTriggerProcess = function(plan_list, event_properties){
    var already_displayed = false;

    if(_.isArray(plan_list) && _.isObject(plan_list[0]) && plan_list.length > 0){

      // 先遍历所有规则，得到plan_state(是否触发)
      _.each(plan_list,function(plan){
        // 因为是引用数据，需要重置match_state
        if(_.isObject(plan) && typeof plan.match_state !== 'undefined'){
          delete plan.match_state;
        }

        new popup.RuleCheck(plan, event_properties);
      });
      // 然后针对match_state，做弹窗优先级的判断
      _.each(plan_list,function(plan){
        // 如果是匹配了的做优先级检查。不匹配的就不管了
        if(plan.match_state === true ){
          if(already_displayed === false){
            already_displayed = true;
            salog('弹窗流程-优先弹窗-渲染');
            new popup.PopupCheck(plan,true);
          }else if(already_displayed === true){
            salog('弹窗流程-非优先弹窗-不渲染');          
            new popup.PopupCheck(plan,false);
          }
        }else{
          salog('检查-弹窗流程-失败-当前计划', plan.plan.plan_id, plan);        
        }
      });

    }

  };

  // 弹窗的流程
  popup.PopupCheck = function(plan,isShow){
    this.plan = plan.plan;
    this.current_time = (new Date()).getTime();
    if(isShow){
      this.displayPopup();
    }else{
      this.hidePopup();
    }
  };

  popup.PopupCheck.prototype.displayPopup = function(){
    var uuid = _.getUuid()();

    // 渲染弹框
    this.renderPopup(uuid);

    this.startConvertWindow(uuid);
    this.startPopupIntervalWindow();
    this.startPopupLimitWindow();
    this.setGlobalLimit();
    this.deletePlanAllWindow();
  };
  // 不展示也需要清楚工作
  popup.PopupCheck.prototype.hidePopup = function(){
    this.deletePlanAllWindow();  
  };

  //渲染窗体并且埋点
  popup.PopupCheck.prototype.renderPopup = function(uuid){
    // 当前计划的窗体描述结构
    var popupTemplate = this.plan.popup_window_content;
    if(!popupTemplate || !popupTemplate.content){
      return false;
    }

    try {
      var temp = JSON.parse(popupTemplate.content);
      var ele = new ElementRender(temp);
    }catch(e){
      popup.log('renderPopup Error', e);
    }
    
    // 挂载plan和uuid
    ele.msg.plan = this.plan;
    ele.msg.$sf_msg_id = uuid;

    // is_control_group:是否对照组，对照组不渲染弹框，只发弹窗埋点。
    ele.isRender = !this.plan.is_control_group;
    salog('弹窗展示-是否是对照组',this.plan.is_control_group);

    // 处理弹框的点击操作
    ele.render(function(e){
      popup.track.elementClickCallback(e, ele);
    }); 
  };


  popup.PopupCheck.prototype.startConvertWindow = function(uuid){
    salog('弹窗展示-ConvertWindow');  
    if(_.isObject(this.plan.convert_window) && this.plan.convert_window.value){
      this.plan.is_in_convert_window = {
       expire_time: popup.ruleTime.getExpire(this.plan.convert_window,this.current_time),
       uuid: uuid
      };
      popup.asyncConvert(this.plan);
    }
  };
  popup.PopupCheck.prototype.startPopupIntervalWindow = function(){
    if(_.isObject(this.plan.popup_interval) && this.plan.popup_interval.value){
      this.plan.is_in_popup_interval_window = popup.ruleTime.getExpire(this.plan.popup_interval,this.current_time);
    }

  };
  popup.PopupCheck.prototype.startPopupLimitWindow = function(){
    salog('弹窗展示-PopupLimitWindow',this.plan.is_in_popup_limit_window);
    if(_.isObject(this.plan.re_enter) && this.plan.re_enter.value){
      if(!_.isObject(this.plan.is_in_popup_limit_window)){
        this.plan.is_in_popup_limit_window = {
          expire_time: popup.ruleTime.getExpire(this.plan.re_enter,this.current_time),
          count: 1
        };
      }else{
        this.plan.is_in_popup_limit_window.count++;
      }
    }  
  };

  popup.PopupCheck.prototype.setGlobalLimit = function(){
    if(!_.isArray(popup.localData.global_popup_count)){
      popup.localData.global_popup_count = [];
    }
    popup.localData.global_popup_count.unshift(this.current_time);
    var count = popup.localData.global_popup_count;
    //清理大于90天的数据，如果超过3000条数据也清理防止数据太大(3000条38k，最大5M)
    var last_data = count[count.length-1];
    while( (last_data + (90*24*60*60*1000)) < this.current_time || (count.length > 3000) ){
      count.pop();
      last_data = count[count.length-1];
    }
  };

  popup.PopupCheck.prototype.deletePlanAllWindow = function(){
    var matchlist = this.plan.pattern_popup.match_list;
    if(_.isArray(matchlist)){
      _.each(matchlist,function(match){
        if(match.is_in_window){
          delete match.is_in_window;
        }
      });      
    }

  };



  // 规则检查的流程, 执行完成后需要设置 matchlist.match_state 的状态
  popup.RuleCheck = function(plan_match, event_properties){
    this.plan_match = plan_match;

    this.plan = plan_match.plan;
    this.rule_arr = plan_match.rule;
    
    this.event_data = event_properties;

    this.current_time = (new Date()).getTime();

    _.each(this.rule_arr, function(rule,index){
      salog('检查-准备-计划id-',plan_match.plan.plan_id,'-规则-',index+1,'-'+rule.event_name+'-'+rule.params[0]+'次');
    });

    this.checkPlanIsExpire();



  };


  popup.RuleCheck.prototype.checkPlanIsExpire = function(){
    if(!this.plan.expire_at || (_.isNumber(this.plan.expire_at) && this.current_time < this.plan.expire_at)){
      salog('检查-PlanExpire-计划没有过期-满足');
      this.checkPlanIsAudience();
    }else{
      salog('检查-PlanExpire-计划已经过期-不满足');    
    }
  };

  popup.RuleCheck.prototype.checkPlanIsAudience = function(){
    if(this.plan.is_audience === true){
      salog('检查-是否受众-满足');
      this.checkPlanSuspend();
    }else{
      salog('检查-是否受众-不满足');
    }
  };

  popup.RuleCheck.prototype.checkPlanSuspend = function(){
    if(!this.plan.status || this.plan.status !== 'SUSPEND'){
      salog('检查-PlanSuspend-非暂停-满足');      
      this.checkConvert();
    }else{
      salog('检查-PlanSuspend-暂停-不满足');      
    }
  };

  popup.RuleCheck.prototype.checkConvert = function(){
    if(!this.plan.is_in_convert_window){
      salog('检查-ConvertWindow-不存在-满足',this.plan.is_in_convert_window);      
      this.checkGlobalPopupInterval();
    }else{
      salog('检查-ConvertWindow-存在-不满足',this.plan.is_in_convert_window);    
    }
  };

  //  使用的滑动弹窗计算方式（已当前时间+当前间隔算推，精确），比全老师的固定弹窗方式更精确（固定弹窗超时时间会改变）
  popup.RuleCheck.prototype.checkGlobalPopupInterval = function(){
    var count = popup.localData.global_popup_count;
    if(_.isArray(count) && count.length >= 1){
      var last_rule_time = popup.ruleTime.getLast(popup.localData.popup_interval_global, this.current_time);
      if(last_rule_time > count[0]){
        salog('检查-GlobalPopupInterval-已经超过间隔-满足-',last_rule_time ,'>上次弹窗时间', count[0]);
        this.checkPopupInterval();
      }else{
        salog('检查-GlobalPopupInterval-没有超过间隔-不满足-',last_rule_time ,'<上次弹窗时间', count[0]);
      }
    }else{
      salog('检查-GlobalPopupInterval-没有弹过窗-满足');  
      this.checkPopupInterval();    
    }
  };

  popup.RuleCheck.prototype.checkPopupInterval = function(){
    if(_.isNumber(this.plan.is_in_popup_interval_window)){
      if(this.current_time > this.plan.is_in_popup_interval_window){
        salog('检查-PopupInterval-当前时间大于固定弹窗间隔-满足');        
        this.plan.is_in_popup_interval_window = null;      
        this.checkProperties();
      }else{
        salog('检查-PopupInterval-当前时间小于固定弹窗间隔-不满足');     
      }
    }else{
      salog('检查-PopupInterval-窗口不存在-新开');  
      this.plan.is_in_popup_interval_window = null;
      this.checkProperties();
    }
  }; 

  // 检查事件的属性是否匹配
  popup.RuleCheck.prototype.checkProperties = function() {
    salog('检查-PropertiesMatch');  
    var filter_map = {
      /**
       * 等于 
       * @param {number，string} property 事件属性 
       * @param {Array} params 筛选的值，参数一个或多个 
       */
      equal: function (property, params) {
        if(!_.isNumber(property) && !_.isString(property)){
          return false;
        }
        // 或的关系，等于任意一个
        for(var i=0; i < params.length; i++){
           if(property === params[i]){
              return true;
            }
        }
        return false;
      },
      /**
       * 不等于
       * @param {number，string} property 
       * @param {Array} params 筛选的值，参数一个或多个 
       */
      notEqual: function (property, params) {
        if(!_.isNumber(property) && !_.isString(property)){
          return false;
        }
        // 不等于其中的任意一个
        for(var i=0; i < params.length; i++){
          if(property === params[i]){
             return false;
           }
        }
        return true;
      },
      /**
       * 包含
       * @param {String} property 
       * @param {Array} params 只有一个参数
       */
      contain: function(property, params){
        if(!_.isString(property)){
          return false;
        }
         
        return property.indexOf(params[0]) >= 0;
      },
      /**
       * 不包含
       * @param {String} property 
       * @param {*} params 只有一个参数
       */
      notContain: function(property, params){
        if(!_.isString(property)){
          return false;
        }
         
        return property.indexOf(params[0]) === -1;
      },
      /**
       * 为真
       * @param {bool} property 
       */
      isTrue: function (property) {
        return property === true;
      },
      /**
       * 为假
       * @param {bool} property 
       */
      isFalse: function (property) {
        return property === false;
      },
      /**
       * 有值，有传这个属性，空字符串也是有值的。
       * @param {string、number、data、bool、list} property 
       */
      isSet: function (property) {
        return property !== undefined;
      },
      /**
       * 没有值: 没有传这个属性
       * @param {string、number、data、bool、list} property 
       */
      notSet: function (property) {
        return property === undefined;
      },
      /**
       * 为空
       * @param {list,string} property 
       * 字符串为空就是“”，数组为空就是[];
       */
      isEmpty: function(property){
        if(!_.isString(property) && !_.isArray(property)){
          return false;
        }
        
        if(_.isString(property)){
          return property === "";
        } else {
          // 去除首尾空格
          for(var i=0; i<property.length; i++){
            var $item = property[i].replace(/^\s+|\s+$/g,'');
            if($item !== ''){
              return false;
            }
          }
          return true;
        }
      },
      /**
       * 不为空
       * @param {list,string} property 
       * "   " === true
       */
      isNotEmpty: function(property){
        if(!_.isString(property) && !_.isArray(property)){
          return false;
        }
        
        if(_.isString(property)){
          return property !== "";
        } else {
          // 去除首尾空格
          for(var i=0; i<property.length; i++){
            var $item = property[i].replace(/^\s+|\s+$/g,'');
            if($item === ''){
              return false;
            }
          }
          return true;
        }
      },
      
      /**
       * 小于
       * @param {number} property 
       * @param {*} params 数组中只有一项
       * field: "event.testTime.number"
         function: "less"
         params: ["3"]
       */
      less: function (property, params) {
        if(!_.isNumber(property)){
          return false;
        }
        return property < Number(params[0]);
      },
      /**
       * 大于
       * @param {number} property 
       * @param {*} params 数组中只有一项
       * field: "event.testTime.number"
         function: "greater"
         params: ["10"]
       */
      greater: function (property, params) {
        if(!_.isNumber(property)){
          return false;
        }
        return property > Number(params[0]);
      },
      /**
       * 区间
       * @param {number} property 
       * @param {*} params 数组中有两项，并且按照从小到大排序
       * field: "event.testTime.number"
         function: "between"
         params: ["2", "5"]
       */
      between: function (property, params) {
        if(!_.isNumber(property)){
          return false;
        }
        return property >= Number(params[0]) && property <= Number(params[1]);
      },
      /**
       * 包含
       * @param {list} property 
       * @param {*} params params可以传入多个值，或的关系，数组中包含一个即满足条件
       * field: "event.testTime.list"
         function: "in"
         params: ["1", "10", "13"]
       */
      in: function (property, params) {
        if(!_.isArray(property)){
          return false;
        }
        for(var i=0; i<property.length; i++){
           if(params.indexOf(property[i]) >=0){
             return true;
           }
        }
        return false;
      },
      /**
       * 不包含
       * @param {list} property 
       * @param {*} params params可以传入多个值，或的关系，数组中有一项不包含在params里，则返回true
       * field: "event.testTime.list"
         function: "notInclude"
         params: ["a", "b"]
         property["a", "c"]  c不包含，所以返回true。
       */
      notInclude:function (property, params){
        if(!_.isArray(property)){
          return false;
        }
        for(var i=0; i<property.length; i++){
           if(params.indexOf(property[i]) === -1 ){
             return true;
           }
        }
        return false;
      },
      /**
       * 绝对时间，在一个固定区间内
       * field: "user.$first_visit_time"
         function: "absolute_between"
         params: ["2020-03-02 00:00:00", "2020-03-05 00:00:00"]
       * @param {*} property 
       * @param {*} params 
       */
      absolute_between: function (property, params) {
        try {
          var startTime = new Date(params[0]);
          var endTime = new Date(params[1]);
          var data = new Date(property);
          return data >= startTime && data <= endTime;
        } catch (e){
          popup.log('absolute_between Error', e);
        }
      },
      absoluteBetween: function (property, params) {
        try {
          var startTime = new Date(params[0]);
          var endTime = new Date(params[1]);
          var data = new Date(property);
          return data >= startTime && data <= endTime;
        } catch (e){
          popup.log('absolute_between Error', e);
        }
      }
      
    };
    
    var that = this;
    var matched_rule = _.filter(this.rule_arr, function (matcher) {
      // 没有属性筛选
      if(!matcher.filter){
        return true;
      }
      var filter = matcher.filter;
      var relation = filter.relation;
      var isOr = relation === 'or';
      var isAnd = relation === 'and';
      var flag = isAnd ? true : false; 
      var isNext = true;
      _.each(filter.conditions, function(item){
        if(!isNext){
          return false;
        }
         
        var fields = item.field.split('.'); 
        var params = item.params; 
        var function_name = item.function; 

        // SDK 端遇到不支持的 function 判定计划是无效的即可,所在计划不再做触发、弹窗、埋点，这项rule丢弃。
        if (!filter_map[function_name]) {
          flag = false;
          isNext = false;
          return false;
        }

        // fileds不满足条件，则忽略这个conditions，继续执行下面的condition
        if (!fields.length || fields.length < 3) {
          return false;
        }

        //获取事件的属性值
        var property = that.event_data.properties[fields[2]]; 
        var result = filter_map[function_name](property, params);

        // 如果是或的关系，并且有一项conditions满足条件，则其他conditions不用执行。直接把rule返回。
        // or flag 默认是false
        if(isOr && result){
          flag = true;
          isNext = false;
        }

        // and flag 默认是ture
        if(isAnd && (!result)){
          flag = false;
          isNext = false;
        }

      });
      
      return flag;
    });

    this.checkWindowAndMatch(matched_rule);

  };


  // 检查窗口期目的是为了设置当前有效的count，然后再去check是否match
  popup.RuleCheck.prototype.checkWindowAndMatch = function(matched_rule){
    salog('检查-WindowAndMatch',matched_rule);  

    var that = this;
  //遍历所有属性满足的rule matched_rule ，筛选出达到阈值的rule

    var temp_matched_rule = [];


    _.each(matched_rule, function(rule){
      
      //数据异常就结束
      if(!rule.params || !rule.params[0]){
      salog('检查-WindowAndMatch-匹配结论-规则数据异常');

        return false;
      }
      var rule_count = Number(rule.params[0]);


      if(rule_count === 1){
        // 如果是单次就直接触发
        temp_matched_rule.push(rule);
      }else if(rule_count > 1 && _.isObject(rule.window) && rule.window.value > 0){
        // 如果是多次的，需要判断窗口期
        if(!_.isObject(rule.is_in_window) || !_.isNumber(rule.is_in_window.expire_time) || rule.is_in_window.expire_time < that.current_time){
          // 如果没有窗口，或者窗口异常，就设置窗口
          rule.is_in_window = {
            expire_time: popup.ruleTime.getExpire(rule.window, that.current_time),
            count: 1
          };
        }else{
          rule.is_in_window.count++;
        }

        //check 当前count是否匹配rule_count
        if(rule.is_in_window.count >= rule_count){
          temp_matched_rule.push(rule);
        }else{
          salog('检查-WindowAndMatch-匹配结论-规则数',rule.is_in_window.count,'不匹配当前次数',rule_count);
        }

      } 

    });
  //如果有1个规则达到阈值，就可以
    if(temp_matched_rule.length > 0){
      salog('检查-WindowAndMatch-匹配结论-有匹配成功的规则',temp_matched_rule);    
      this.checkGlobalPopupLimit();
    }else{
      salog('检查-WindowAndMatch-匹配结论-没有匹配成功的规则',temp_matched_rule);   
    }

  };
  /*
  popup.RuleCheck.prototype.checkPageFilter = function(){
    
    if(_.isObject(this.plan.page_filter) && _.isArray(this.plan.page_filter.params) && _.isString(this.plan.page_filter.params[0]) && this.plan.page_filter.params[0] !== ''){
      if(location.href === this.plan.page_filter.params[0]){
        this.checkGlobalPopupLimit();      
      }
    }else{
      this.checkGlobalPopupLimit();
    }

  };
  */

  popup.RuleCheck.prototype.checkGlobalPopupLimit = function(){
    var global_limit = popup.localData.msg_limit_global;
    var isTrue = true;
    var that = this;
    if(_.isObject(global_limit) && (global_limit.is_in_use === true) && _.isArray(global_limit.limits) && _.isArray(popup.localData.global_popup_count)){
      _.each(global_limit.limits,function(limit){
       if(_.isObject(limit) && _.isNumber(limit.limit)){
          //todo getBeginTime  isInGlobalPopupLimit
          var begin_time = popup.ruleTime.getLast(limit, that.current_time);
          
          var current_count = popup.ruleTime.getArrMatchCount(popup.localData.global_popup_count , begin_time);

          salog('检查-GlobalPopupLimit-已经弹窗次数-',current_count,'-限制的次数', limit.limit,'-限制时间-',begin_time);                  
          if(current_count <= limit.limit){
            isTrue = isTrue && true;
          }else{
            isTrue = isTrue && false;
          }
        }
      });
      if(isTrue){
        this.checkPopupLimit();
      }
    }else{
      salog('检查-GlobalPopupLimit-参数异常-满足');    
      this.checkPopupLimit();
    }

  };


  /*参与限制
  0. 返回格式正确？
  1. 窗口存在？
  2. 窗口过期？
  3. 窗口满足？
  */
  popup.RuleCheck.prototype.checkPopupLimit = function(){
    if(!_.isObject(this.plan.re_enter) || !_.isNumber(this.plan.re_enter.value) || !_.isNumber(this.plan.re_enter.limit) ){
      this.plan_match.match_state = true;    
      return false;
    }
    // 如果有参与限制的窗口
    if(_.isObject(this.plan.is_in_popup_limit_window) && _.isNumber(this.plan.is_in_popup_limit_window.expire_time) && _.isNumber(this.plan.is_in_popup_limit_window.count) ){
      // 如果参与限制窗口过期，那就是没有限制
      if(this.plan.is_in_popup_limit_window.expire_time < this.current_time){
        salog('检查-PopupLimit-超过了参与限制窗口-开启新窗口-满足',this.plan.is_in_popup_limit_window);
        delete this.plan.is_in_popup_limit_window;
        this.plan_match.match_state = true;
      }else{
        // 否则参与限制窗口没有过期，没有过期的话需要判断是否在限制内，如果在限制内，就表示匹配成功
        if(this.plan.is_in_popup_limit_window.count < this.plan.re_enter.limit){
          salog('检查-PopupLimit-在窗口内且在参与限制次数内-满足',this.plan.is_in_popup_limit_window);
          this.plan_match.match_state = true;
        }else{
          salog('检查-PopupLimit-在窗口内但是超过了参与限制-不满足',this.plan.is_in_popup_limit_window);
        }
        //如果不在限制内，就表示匹配失败，失败就结束
      }
    }else{
      if(this.plan.is_in_popup_limit_window){
        salog('检查-PopupLimit-有窗口但是窗口数据异常-开新窗口-满足',this.plan.is_in_popup_limit_window);          
        //数据有异常或者没有窗口，做一次重置窗口操作
        delete this.plan.is_in_popup_limit_window;      
      }else{
        salog('检查-PopupLimit-不存在窗口-开新窗口-满足',this.plan.is_in_popup_limit_window);      
      }

      this.plan_match.match_state = true;
    }
  };

  /*
  初始化本地数据
  每隔10分钟获取一次数据
  每次打开页面，记录当前更新时间，并判断设置定时的定时器
  */
  popup.store = {
    save: function (callback) {
      callback(popup.localData);
      this.saveJSONData();
    },
    init: function () {
      popup.localData = this.getJSONData() || {};
      popup.log('修改-内存-localData-',popup.localData);
    },
    getJSONData: function () {
      return _.localStorage.parse('sensorsdata202002-popupdata');
    },
    saveJSONData: function () {
      // 数据有修改
      _.localStorage.set('sensorsdata202002-popupdata', JSON.stringify(popup.localData));
    }
  };




  //每隔10分钟获取一次数据,每次打开页面，记录当前更新时间，并判断设置定时的定时器
  popup.updateDataAndSetListen = {
    // 请求间隔时间
    interval_time: 10 * 60 * 1000,
    // 保存的interval
    save_interval:null,
    // 获取数据的interval
    data_interval:null,

    /**
     * 筛选出需要做转化的plans
     */
    filterConvertPlans: function (){
      var plans = popup.localData.popup_plans;

      if(!plans || !_.isArray(plans)){
        return false;
      }

      var data = _.filter(plans, function(value){
        return (!!value.convert_window) && (!!value.is_in_convert_window)
      });

      popup.convertPlans = data;
      popup.log('需要做转化的plans',popup.convertPlans);
      popup.asyncConvert();
    },
    /**
     * 对比localData和serverData的plan，更新localData
     * 对比规则：
     *  1、对比本地和远程两组相同的plan_id
     *      1、last_update_config_time不相同，则使用远程的plan替换本地的plan
     *      2、last_update_config_time相同，is_audience为false或者status不等于ACTIVE、SUSPEND，使用远程plan替换本地plan
     *  2、本地多的plan_id，远程没有对应的plan_id，则删除本地的plan
     *  3、远程多的plan_id，新增到本地
     */
    diffData: function () {
      var localData = popup.localData;
      var serverData = JSON.parse(JSON.stringify(popup.serverData));
      var timer = new Date().getTime();


      // serverData没数据，直接返回
      if (!serverData || _.isEmptyObject(serverData)) {
        return false;
      }

      // 服务端的时间和当前时间做对比，小于-10分钟或者大于10分钟，不做处理
      var value = timer - serverData.server_current_time;
      if( Math.abs(value) >= 1000 * 60 * 10){
        return false;
      }

      // localData没有数据，serverData有数据，直接用serverData
      if (!localData && _.isEmptyObject(localData)) {
        _.extend(popup.localData, serverData);
        return false;
      }

      var plans = serverData.popup_plans;

      /**
       * serverData比本地多的数据要新增到本地，比本地少的数据，要删除本地，综合这两条规则，直接循环serverData.plans
       */
      _.each(plans, function (item, index) {
        var localItem = null;

        //循环本地的plan，判断远程的plan_id在本地中是否有相同的plan
        _.each(localData.popup_plans, function (local_item) {
          if (local_item.plan_id === item.plan_id) {
            localItem = local_item; 
            // 将本地的is_audience和audience_id修改为远程的
            localItem.is_audience = item.is_audience;
            if(item.audience_id){
              localItem.audience_id = item.audience_id;
            }else {
              delete localItem.audience_id;
            }
          }
        });     

        // server有plan，local没有当前plan, 用server的plan
        if (!localItem) {
          return false;
        }

        // 修改时间不一致，删除local，用server的plan
        if (localItem.last_update_config_time !== item.last_update_config_time) {
          return false;
        }
    
        // time一致，直接复用local，不做修改
        plans[index] = localItem;

      });


      _.extend(popup.localData, serverData);
      popup.log('比对数据-得到需要的-localData', popup.localData); 
    },
    /***
     * 根据localData获取eventRule,eventRule数据格式如下：
     * {
     *  "$pageview":[{plan:{},rule:[]},{}],
     *  "$WebClick":[] 
     * }
     */
    getEventRule: function () {
      var popup_plans = popup.localData.popup_plans;
      var eventRule = {};

      _.each(popup_plans, function (plan) {
        var matcher_list = plan.pattern_popup.matcher_list;

        _.each(matcher_list, function (matcher) {
          var event_item = {
            plan: plan,
            rule: [matcher],
          };
          var eventName = matcher.event_name;
          var flag = false;
         
          // 检查eventRule中有对应的事件
          if (eventRule[eventName]) {
             // 循环eventRule中事件对应的数组
             _.each(eventRule[eventName], function(item){
              //eventRule中的plan_id和当前plan_id相同，则把matcher添加到rule中
               if(item.plan.plan_id === plan.plan_id){
                  item.rule.push(matcher);
                  flag = true;
                }
             });
             // matcher 添加到rul中，设置flag为true，直接循环下一项matcher
             if (flag) {
                return false;
             }
             eventRule[eventName].push(event_item);
          } else {
            eventRule[eventName] = [event_item];
          }
        });

      });
    
      // 按照优先级，从大到小进行排序
      _.each(eventRule, function (value) {
        value.sort(function (first, second) {
          var result = second.plan.absolute_priority - first.plan.absolute_priority;
          // 优先级相同，计划id越大，优先级越高，当优先级相同，则按照计划id从大到小进行排序
          if(result === 0){
            return second.plan.plan_id - first.plan.plan_id;
          }
          return result;
        });
      });

      popup.eventRule = eventRule;
    },
    /**
     * 监听埋点事件，判断是否在eventRule，调用rule.js的方法
     * 传入参数：rule:{plan:{}, rule:[matcher]},data:事件参数
     */
    registerListen: function () {
      var eventRule = popup.eventRule;
      var that = this;
      popup.sa.events.on('send', function (data) {
          if(data.type === 'track_signup'){
            that.signupEvent();
            return;
          }

          var rule = eventRule[data.event];
          if(!rule){
            return false;
          }
          
          popup.eventTriggerProcess(rule,data);
      });
      // 监听logout
      popup.sa.events.on('logout',function(distinct_id){
        that.signupEvent();
      });
      popup.sa.events.isReady();
    },
    /**
     * 清除本地用户缓存的计划规则数据，同时立即使用新的 ID 拉取计划规则数据。
     */
    signupEvent: function(){
      this.changeId();
    },
    /***
     * 设置localData和eventRule
     */
    setListenEvent: function () {
      this.diffData();
      this.filterConvertPlans();
      this.getEventRule();
    },
    /**
     * 获取弹窗配置信息
     */
    getDataFromServer: function () {
      var that = this;
      var distinct_id = popup.sa.store.getDistinctId();
      var platform = popup.info.platform;
      var project = popup.info.project;
      return new Promise(function (res, rej) {
        _.ajax({
          url: popup.info.api_base_url + '/sfo/user_popup_configs/'+ distinct_id +'?platform='+ platform +'&project='+project,
          type: 'GET',
          cors: true,
          credentials: false,
          contentType: 'application/json',
          success: function (data) {
            popup.log('修改-serverData-',data);
            popup.serverData = data;
            // 修改localData调用save去修改
            popup.localData.local_update_time = (new Date()).getTime();
            // 开始处理数据
            that.setListenEvent();
            res();
            //设置10分钟后再次获取数据
            that.setIntervalTime(that.interval_time);
          },
          error: function () {
            popup.log('修改-serverData-',{});          
            popup.serverData = {};
            res();
            that.setIntervalTime(that.interval_time);
          }
        });

      })
    },
    //定时获取数据
    setIntervalTime: function (time) {
      var that = this;
      this.data_interval = setTimeout(function () {
        that.getDataFromServer();
      }, time);
    },
    //设置首次监听，先更新数据-后监听
    setFirstListen: function () {
      var that = this;
      this.getDataFromServer().then(function () {
        that.registerListen();
      });
    },
    /**
     * 每隔1s对比LocalData，不相同，则更新LocalData
     */
    updateLocalData: function() {
     var local_data = JSON.stringify(popup.localData);
     this.save_interval = setInterval(function(){
        var localData = JSON.stringify(popup.localData);
          if( local_data !== localData ){
            popup.store.save(function(data){
            });
            local_data = localData;
          }
      }, 1000);
    },
    //判断从何处获取数据
    initial: function () {
      popup.store.init();
      var last_time = popup.localData.local_update_time;
      var current_time = (new Date()).getTime();
      // 本地没数据，首次，直接用server
      if (!_.isNumber(last_time)) {
        this.setFirstListen();
      }else{
      // 本地有数据
        var remain_time = current_time - last_time;
        //数据异常 或者 超过10分钟
        if (remain_time <= 0 || remain_time >= this.interval_time) {
          this.setFirstListen();
        } else {
          //在10分钟内
          this.setIntervalTime(remain_time);
          this.setListenEvent();
          this.registerListen();
        }
      }
      // 初始化完成后，执行数据自动保存
      this.updateLocalData();

    },
    changeId: function(){
      this.stopAllState();
      this.startState({getLocalData:false});
    },
    // 清空所有状态
    stopAllState: function(){
      // 清空监听 只要清空rule
      popup.eventRule = {};
      // 清空定时器     // 清楚定时保存
      this.data_interval && clearTimeout(this.data_interval);
      this.save_interval && clearInterval(this.save_interval);
      // 清空异步的转化
      popup.convertPlans = [];
      // locadata 设置成空
      popup.log('修改-内存-localData-',{});
      popup.localData = {};
    },
    startState: function(obj){
      obj = obj || {getLocalData:true};
      // 重新获取数据，并开始监听，保存数据
      var that = this;
      if(obj.getLocalData){
        popup.store.init();   
      }

      this.getDataFromServer().then(function(){
        that.updateLocalData();
      });

    }

  };

  if(Object.prototype.toString.call(window.SensorsDataWebJSSDKPlugin) !== '[object Object]'){
    window.SensorsDataWebJSSDKPlugin = {
      popup:popup
    };
  }else{
    window.SensorsDataWebJSSDKPlugin.popup = window.SensorsDataWebJSSDKPlugin.popup || popup;    
  }
  /*
  if(Object.prototype.toString.call(window.sensorsDataAnalytic201505) === '[object Object]'){
    sa.quick('pluginIsReady',{
      name: 'popup',
      self: popup
    });
  }
  */

  return popup;

})));
