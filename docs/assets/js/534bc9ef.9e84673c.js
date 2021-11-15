"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[525],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return v}});var i=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=i.createContext({}),l=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return i.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},y=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),y=l(n),v=r,m=y["".concat(s,".").concat(v)]||y[v]||p[v]||a;return n?i.createElement(m,o(o({ref:t},u),{},{components:n})):i.createElement(m,o({ref:t},u))}));function v(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=y;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var l=2;l<a;l++)o[l]=n[l];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}y.displayName="MDXCreateElement"},1989:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return u},default:function(){return y}});var i=n(7462),r=n(3366),a=(n(7294),n(3905)),o=["components"],c={id:"activity-union",title:"ActivityUnion"},s=void 0,l={unversionedId:"schema/unions/activity-union",id:"schema/unions/activity-union",isDocsHomePage:!1,title:"ActivityUnion",description:"Activity union type",source:"@site/docs/schema/unions/activity-union.mdx",sourceDirName:"schema/unions",slug:"/schema/unions/activity-union",permalink:"/graphql-markdown/schema/unions/activity-union",tags:[],version:"current",frontMatter:{id:"activity-union",title:"ActivityUnion"},sidebar:"basic",previous:{title:"String",permalink:"/graphql-markdown/schema/scalars/string"},next:{title:"LikeableUnion",permalink:"/graphql-markdown/schema/unions/likeable-union"}},u=[{value:"Possible types",id:"possible-types",children:[{value:"TextActivity",id:"textactivity",children:[],level:4},{value:"ListActivity",id:"listactivity",children:[],level:4},{value:"MessageActivity",id:"messageactivity",children:[],level:4}],level:3}],p={toc:u};function y(e){var t=e.components,n=(0,r.Z)(e,o);return(0,a.kt)("wrapper",(0,i.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Activity union type"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"union ActivityUnion = TextActivity | ListActivity | MessageActivity\n")),(0,a.kt)("h3",{id:"possible-types"},"Possible types"),(0,a.kt)("h4",{id:"textactivity"},(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/text-activity"},(0,a.kt)("inlineCode",{parentName:"a"},"TextActivity"))),(0,a.kt)("p",null,"User text activity"),(0,a.kt)("h4",{id:"listactivity"},(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/list-activity"},(0,a.kt)("inlineCode",{parentName:"a"},"ListActivity"))),(0,a.kt)("p",null,"User list activity (anime & manga updates)"),(0,a.kt)("h4",{id:"messageactivity"},(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/message-activity"},(0,a.kt)("inlineCode",{parentName:"a"},"MessageActivity"))),(0,a.kt)("p",null,"User message activity"))}y.isMDXComponent=!0}}]);