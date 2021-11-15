"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[3186],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=u(n),d=i,y=m["".concat(l,".").concat(d)]||m[d]||s[d]||a;return n?r.createElement(y,c(c({ref:t},p),{},{components:n})):r.createElement(y,c({ref:t},p))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,c=new Array(a);c[0]=m;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:i,c[1]=o;for(var u=2;u<a;u++)c[u]=n[u];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2281:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return p},default:function(){return m}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),c=["components"],o={id:"activity-type",title:"ActivityType"},l=void 0,u={unversionedId:"schema/enums/activity-type",id:"schema/enums/activity-type",isDocsHomePage:!1,title:"ActivityType",description:"Activity type enum.",source:"@site/docs/schema/enums/activity-type.mdx",sourceDirName:"schema/enums",slug:"/schema/enums/activity-type",permalink:"/graphql-markdown/schema/enums/activity-type",tags:[],version:"current",frontMatter:{id:"activity-type",title:"ActivityType"},sidebar:"basic",previous:{title:"ActivitySort",permalink:"/graphql-markdown/schema/enums/activity-sort"},next:{title:"AiringSort",permalink:"/graphql-markdown/schema/enums/airing-sort"}},p=[{value:"Values",id:"values",children:[{value:"<code>TEXT</code>",id:"text",children:[],level:4},{value:"<code>ANIME_LIST</code>",id:"anime_list",children:[],level:4},{value:"<code>MANGA_LIST</code>",id:"manga_list",children:[],level:4},{value:"<code>MESSAGE</code>",id:"message",children:[],level:4},{value:"<code>MEDIA_LIST</code>",id:"media_list",children:[],level:4}],level:3}],s={toc:p};function m(e){var t=e.components,n=(0,i.Z)(e,c);return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Activity type enum."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"enum ActivityType {\n  TEXT\n  ANIME_LIST\n  MANGA_LIST\n  MESSAGE\n  MEDIA_LIST\n}\n")),(0,a.kt)("h3",{id:"values"},"Values"),(0,a.kt)("h4",{id:"text"},(0,a.kt)("inlineCode",{parentName:"h4"},"TEXT")),(0,a.kt)("p",null,"A text activity"),(0,a.kt)("h4",{id:"anime_list"},(0,a.kt)("inlineCode",{parentName:"h4"},"ANIME_LIST")),(0,a.kt)("p",null,"A anime list update activity"),(0,a.kt)("h4",{id:"manga_list"},(0,a.kt)("inlineCode",{parentName:"h4"},"MANGA_LIST")),(0,a.kt)("p",null,"A manga list update activity"),(0,a.kt)("h4",{id:"message"},(0,a.kt)("inlineCode",{parentName:"h4"},"MESSAGE")),(0,a.kt)("p",null,"A text message activity sent to another user"),(0,a.kt)("h4",{id:"media_list"},(0,a.kt)("inlineCode",{parentName:"h4"},"MEDIA_LIST")),(0,a.kt)("p",null,"Anime & Manga list update, only used in query arguments"))}m.isMDXComponent=!0}}]);