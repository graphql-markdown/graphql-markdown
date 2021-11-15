"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[7010],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var i=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,i,o=function(e,t){if(null==e)return{};var n,i,o={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=i.createContext({}),u=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=u(e.components);return i.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},s=i.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),s=u(n),m=o,d=s["".concat(l,".").concat(m)]||s[m]||f[m]||r;return n?i.createElement(d,a(a({ref:t},p),{},{components:n})):i.createElement(d,a({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,a=new Array(r);a[0]=s;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var u=2;u<r;u++)a[u]=n[u];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}s.displayName="MDXCreateElement"},8151:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return p},default:function(){return s}});var i=n(7462),o=n(3366),r=(n(7294),n(3905)),a=["components"],c={id:"notification",title:"Notification"},l=void 0,u={unversionedId:"schema/queries/notification",id:"schema/queries/notification",isDocsHomePage:!1,title:"Notification",description:"Notification query",source:"@site/docs/schema/queries/notification.mdx",sourceDirName:"schema/queries",slug:"/schema/queries/notification",permalink:"/graphql-markdown/schema/queries/notification",tags:[],version:"current",frontMatter:{id:"notification",title:"Notification"},sidebar:"basic",previous:{title:"Media",permalink:"/graphql-markdown/schema/queries/media"},next:{title:"Page",permalink:"/graphql-markdown/schema/queries/page"}},p=[{value:"Arguments",id:"arguments",children:[{value:"<code>type</code> (NotificationType)",id:"type-notificationtype",children:[],level:4},{value:"<code>resetNotificationCount</code> (Boolean)",id:"resetnotificationcount-boolean",children:[],level:4},{value:"<code>type_in</code> (NotificationType)",id:"type_in-notificationtype",children:[],level:4}],level:3},{value:"Type",id:"type",children:[{value:"NotificationUnion",id:"notificationunion",children:[],level:4}],level:3}],f={toc:p};function s(e){var t=e.components,n=(0,o.Z)(e,a);return(0,r.kt)("wrapper",(0,i.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Notification query"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-graphql"},"Notification(\n  type: NotificationType\n  resetNotificationCount: Boolean\n  type_in: [NotificationType]\n): NotificationUnion\n\n")),(0,r.kt)("h3",{id:"arguments"},"Arguments"),(0,r.kt)("h4",{id:"type-notificationtype"},(0,r.kt)("inlineCode",{parentName:"h4"},"type")," (",(0,r.kt)("a",{parentName:"h4",href:"/schema/enums/notification-type"},(0,r.kt)("inlineCode",{parentName:"a"},"NotificationType")),")"),(0,r.kt)("p",null,"Filter by the type of notifications"),(0,r.kt)("h4",{id:"resetnotificationcount-boolean"},(0,r.kt)("inlineCode",{parentName:"h4"},"resetNotificationCount")," (",(0,r.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,r.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,r.kt)("p",null,"Reset the unread notification count to 0 on load"),(0,r.kt)("h4",{id:"type_in-notificationtype"},(0,r.kt)("inlineCode",{parentName:"h4"},"type_in")," (",(0,r.kt)("a",{parentName:"h4",href:"/schema/enums/notification-type"},(0,r.kt)("inlineCode",{parentName:"a"},"NotificationType")),")"),(0,r.kt)("p",null,"Filter by the type of notifications"),(0,r.kt)("h3",{id:"type"},"Type"),(0,r.kt)("h4",{id:"notificationunion"},(0,r.kt)("a",{parentName:"h4",href:"/schema/unions/notification-union"},(0,r.kt)("inlineCode",{parentName:"a"},"NotificationUnion"))),(0,r.kt)("p",null,"Notification union type"))}s.isMDXComponent=!0}}]);