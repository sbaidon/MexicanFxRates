webpackJsonp([1],{NHnr:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("7+uW"),a=r("mvHQ"),s=r.n(a),i=r("//Fk"),c=r.n(i),u=r("Gu7T"),o=r.n(u),l=r("fZjL"),f=r.n(l),h=r("Xxa5"),v=r.n(h),d=r("exGp"),p=r.n(d),m=r("g1pc"),_=r.n(m),y={name:"Chart",props:["chartValues"],data:function(){return{}},watch:{chartValues:function(){this.drawChart(this.chartValues.xValues,this.chartValues.yValues)}},methods:{drawChart:function(e,t){_.a.generate({bindto:"#chart",data:{x:"x",columns:[["x"].concat(o()(e))].concat(o()(t))},axis:{x:{type:"timeseries",tick:{format:"%Y-%m-%d"}}}})}}},x={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("div",{attrs:{id:"chart"}})])}]},b=r("VU/8")(y,x,!1,function(e){r("OavE")},"data-v-d63ffbf6",null).exports,C=r("mtWM"),g=r.n(C),w=function(e){return g.a.get("https://api.fixer.io/"+e+"?base=MXN")},k={name:"app",components:{Chart:b},data:function(){return{firstYearInRecord:2008,allCurrencies:["GBP","USD","EUR","AUD","JPY","CAD"],currencies:["GBP","USD","EUR"],selectYear:"All years",selectMonth:"",notification:"",notificationLapse:5e3,rates:[]}},created:function(){var e=this;return p()(v.a.mark(function t(){return v.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getYearlyRates();case 2:e.rates=t.sent;case 3:case"end":return t.stop()}},t,e)}))()},watch:{selectYear:function(e){var t=this;return p()(v.a.mark(function r(){return v.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if(!t.isAllYearsSelected){r.next=5;break}return r.next=3,t.getYearlyRates().catch(t.handleError);case 3:return t.rates=r.sent,r.abrupt("return");case 5:return r.next=7,t.getMonthlyRates(e).catch(t.handleError);case 7:t.rates=r.sent;case 8:case"end":return r.stop()}},r,t)}))()},selectMonth:function(e){var t=this;return p()(v.a.mark(function r(){return v.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if(""!==e){r.next=2;break}return r.abrupt("return");case 2:return r.next=4,t.getDailyRates(t.selectYear,e).catch(t.handleError);case 4:t.rates=r.sent;case 5:case"end":return r.stop()}},r,t)}))()}},computed:{isAllYearsSelected:function(){return"All years"===this.selectYear},xValues:function(){return this.rates?this.rates.map(function(e){return e.date}):[]},yValues:function(){var e=this;return f()(this.ratesByCurrency).map(function(t){return e.ratesByCurrency[t]})},ratesByCurrency:function(){if(!this.rates)return{};var e=this.currencies;return this.rates.map(function(e){return e.rates}).reduce(function(t,r){return e.forEach(function(e){t.hasOwnProperty(e)||(t[e]=[e]),t[e].push(r[e])}),t},{})},chartValues:function(){return{xValues:this.xValues,yValues:this.yValues}},firstTen:function(){for(var e=[],t=1;t<10;t++)e.push("0"+t.toString());return e},days:function(){for(var e=[].concat(o()(this.firstTen)),t=10;t<=31;t++)e.push(t.toString());return e},months:function(){var e=[].concat(o()(this.firstTen));return e.push("10"),e.push("11"),e.push("12"),e},years:function(){for(var e=this.getCurrentYear(),t=[],r=this.firstYearInRecord;r<=e;r++)t.push(r);return t}},methods:{getYearlyRates:function(){var e=this;return p()(v.a.mark(function t(){var r,n,a;return v.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(!(r=e.retrieve("yearlyRates"))){t.next=3;break}return t.abrupt("return",r);case 3:return t.next=5,c.a.all(e.years.map(function(e){return w(e+"-12-31")}));case 5:return n=t.sent,a=n.map(function(e){return e.data}),e.store("yearlyRates",a),t.abrupt("return",a);case 9:case"end":return t.stop()}},t,e)}))()},getMonthlyRates:function(e){var t=this;return p()(v.a.mark(function r(){var n,a,s;return v.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:if(!(n=t.retrieve(e))){r.next=3;break}return r.abrupt("return",n);case 3:return r.next=5,c.a.all(t.months.map(function(t){return w(e+"-"+t+"-15")}));case 5:return a=r.sent,s=a.map(function(e){return e.data}),t.store(e,s),r.abrupt("return",s);case 9:case"end":return r.stop()}},r,t)}))()},getDailyRates:function(e,t){var r=this;return p()(v.a.mark(function n(){var a,s,i;return v.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:if(!(a=r.retrieve(e+"-"+t))){n.next=3;break}return n.abrupt("return",a);case 3:return n.next=5,c.a.all(r.days.map(function(r){return w(e+"-"+t+"-"+r)}));case 5:return s=n.sent,i=s.map(function(e){return e.data}),r.store(e+"-"+t),n.abrupt("return",i);case 9:case"end":return n.stop()}},n,r)}))()},retrieve:function(e){return JSON.parse(localStorage.getItem(e))},store:function(e,t){localStorage.setItem(e,s()(t))},getCurrentYear:function(){return(new Date).getFullYear()},handleError:function(e){this.selectMonth="",this.selectYear="All years",this.setNotification("There was a "+e.message+", therefore there is missing data, please select another date")},setNotification:function(e){var t=this;this.notification=e,this.timeout=setTimeout(function(){t.notification="",clearTimeout(t.timeout)},this.notificationLapse)}}},Y={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[e.notification?r("div",{staticClass:"notification"},[r("button",{staticClass:"delete",on:{click:function(t){e.notification=""}}}),e._v("\n    "+e._s(e.notification)+"\n  ")]):e._e(),e._v(" "),r("h1",[e._v("MXN foreign exchange")]),e._v(" "),r("Chart",{attrs:{chartValues:e.chartValues}}),e._v(" "),r("div",{staticClass:"field is-horizontal"},[e._m(0),e._v(" "),r("div",{staticClass:"field-body"},[r("div",{staticClass:"field is-narrow"},[r("div",{staticClass:"control"},[r("div",{staticClass:"select is-fullwidth"},[r("select",{directives:[{name:"model",rawName:"v-model",value:e.selectYear,expression:"selectYear"}],on:{change:function(t){var r=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.selectYear=t.target.multiple?r:r[0]}}},[r("option",{attrs:{value:"All years"}},[e._v("All Years")]),e._v(" "),e._m(1)],2)])])])])]),e._v(" "),r("div",{staticClass:"field is-horizontal"},[e._m(2),e._v(" "),r("div",{staticClass:"field-body"},[r("div",{staticClass:"field is-narrow"},[r("div",{staticClass:"control"},[r("div",{staticClass:"select is-fullwidth"},[r("select",{directives:[{name:"model",rawName:"v-model",value:e.selectMonth,expression:"selectMonth"}],attrs:{name:"months",disabled:e.isAllYearsSelected},on:{change:function(t){var r=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.selectMonth=t.target.multiple?r:r[0]}}},[r("option",{attrs:{value:""}},[e._v("Select a Month")]),e._v(" "),e._l(e.months,function(t,n){return r("option",{key:n,domProps:{value:t}},[e._v(" "+e._s(t))])})],2)])])])])]),e._v(" "),r("div",{staticClass:"field is-horizontal"},[e._m(3),e._v(" "),r("div",{staticClass:"field-body"},e._l(e.allCurrencies,function(t,n){return r("div",{key:n,staticClass:"field is-narrow"},[r("label",{staticClass:"label checkbox"},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.currencies,expression:"currencies"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.currencies)?e._i(e.currencies,t)>-1:e.currencies},on:{change:function(r){var n=e.currencies,a=r.target,s=!!a.checked;if(Array.isArray(n)){var i=t,c=e._i(n,i);a.checked?c<0&&(e.currencies=n.concat([i])):c>-1&&(e.currencies=n.slice(0,c).concat(n.slice(c+1)))}else e.currencies=s}}}),e._v(" "+e._s(t)+"\n        ")])])}))])],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"field-label is-normal"},[t("label",{staticClass:"label"},[this._v("Years")])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return e._l(e.years,function(t,n){return r("option",{key:n,domProps:{value:t}},[e._v(e._s(t))])})},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"field-label is-normal"},[t("label",{staticClass:"label"},[this._v("Months")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"field-label"},[t("label",{staticClass:"label"},[this._v("Currencies")])])}]},A=r("VU/8")(k,Y,!1,function(e){r("hvns")},null,null).exports;n.a.config.productionTip=!1,new n.a({el:"#app",template:"<App/>",components:{App:A}})},OavE:function(e,t){},hvns:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.3a29ce72c509610cd3a2.js.map