"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[4911],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=l(r),d=a,f=m["".concat(s,".").concat(d)]||m[d]||p[d]||o;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},1091:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return u},default:function(){return m}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],c={id:"year-stats",title:"YearStats"},s=void 0,l={unversionedId:"schema/objects/year-stats",id:"schema/objects/year-stats",title:"YearStats",description:"User's year statistics",source:"@site/docs/schema/objects/year-stats.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/year-stats",permalink:"/graphql-markdown/schema/objects/year-stats",tags:[],version:"current",frontMatter:{id:"year-stats",title:"YearStats"},sidebar:"basic",previous:{title:"User",permalink:"/graphql-markdown/schema/objects/user"},next:{title:"ActivityReply",permalink:"/graphql-markdown/schema/queries/activity-reply"}},u=[{value:"Fields",id:"fields",children:[{value:"<code>year</code> (Int)",id:"year-int",children:[],level:4},{value:"<code>amount</code> (Int)",id:"amount-int",children:[],level:4},{value:"<code>meanScore</code> (Int)",id:"meanscore-int",children:[],level:4}],level:3}],p={toc:u};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"User's year statistics"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type YearStats {\n  year: Int\n  amount: Int\n  meanScore: Int\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"year-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"year")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("h4",{id:"amount-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"amount")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("h4",{id:"meanscore-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"meanScore")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"))}m.isMDXComponent=!0}}]);