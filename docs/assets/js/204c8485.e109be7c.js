"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[7491],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),h=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=h(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),p=h(n),m=a,u=p["".concat(l,".").concat(m)]||p[m]||s[m]||i;return n?r.createElement(u,o(o({ref:t},d),{},{components:n})):r.createElement(u,o({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=p;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var h=2;h<i;h++)o[h]=n[h];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},2323:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return h},toc:function(){return d},default:function(){return p}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],c={id:"thread-like-notification",title:"ThreadLikeNotification"},l=void 0,h={unversionedId:"schema/objects/thread-like-notification",id:"schema/objects/thread-like-notification",isDocsHomePage:!1,title:"ThreadLikeNotification",description:"Notification for when a thread is liked",source:"@site/docs/schema/objects/thread-like-notification.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/thread-like-notification",permalink:"/schema/objects/thread-like-notification",tags:[],version:"current",frontMatter:{id:"thread-like-notification",title:"ThreadLikeNotification"},sidebar:"schemaSidebar",previous:{title:"ThreadComment",permalink:"/schema/objects/thread-comment"},next:{title:"Thread",permalink:"/schema/objects/thread"}},d=[{value:"Fields",id:"fields",children:[]}],s={toc:d};function p(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Notification for when a thread is liked"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type ThreadLikeNotification {\n  id: Int!\n  userId: Int!\n  type: NotificationType\n  threadId: Int!\n  context: String\n  createdAt: Int\n  thread: Thread\n  comment: ThreadComment\n  user: User\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"id-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,i.kt)("p",null,"The id of the Notification"),(0,i.kt)("h4",{id:"userid-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"userId")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,i.kt)("p",null,"The id of the user who liked to the activity"),(0,i.kt)("h4",{id:"type-notificationtype"},(0,i.kt)("inlineCode",{parentName:"h4"},"type")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/enums/notification-type"},(0,i.kt)("inlineCode",{parentName:"a"},"NotificationType")),")"),(0,i.kt)("p",null,"The type of notification"),(0,i.kt)("h4",{id:"threadid-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"threadId")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,i.kt)("p",null,"The id of the thread which was liked"),(0,i.kt)("h4",{id:"context-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"context")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The notification context text"),(0,i.kt)("h4",{id:"createdat-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"createdAt")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"The time the notification was created at"),(0,i.kt)("h4",{id:"thread-thread"},(0,i.kt)("inlineCode",{parentName:"h4"},"thread")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/thread"},(0,i.kt)("inlineCode",{parentName:"a"},"Thread")),")"),(0,i.kt)("p",null,"The thread that the relevant comment belongs to"),(0,i.kt)("h4",{id:"comment-threadcomment"},(0,i.kt)("inlineCode",{parentName:"h4"},"comment")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/thread-comment"},(0,i.kt)("inlineCode",{parentName:"a"},"ThreadComment")),")"),(0,i.kt)("p",null,"The liked thread comment"),(0,i.kt)("h4",{id:"user-user"},(0,i.kt)("inlineCode",{parentName:"h4"},"user")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/user"},(0,i.kt)("inlineCode",{parentName:"a"},"User")),")"),(0,i.kt)("p",null,"The user who liked the activity"))}p.isMDXComponent=!0}}]);