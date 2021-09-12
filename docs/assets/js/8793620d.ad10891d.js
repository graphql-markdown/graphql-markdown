"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[925],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(n),f=r,h=m["".concat(l,".").concat(f)]||m[f]||p[f]||i;return n?a.createElement(h,o(o({ref:t},u),{},{components:n})):a.createElement(h,o({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8415:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return m}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=["components"],s={id:"user-options",title:"UserOptions"},l=void 0,c={unversionedId:"schema/objects/user-options",id:"schema/objects/user-options",isDocsHomePage:!1,title:"UserOptions",description:"A user's general options",source:"@site/docs/schema/objects/user-options.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/user-options",permalink:"/schema/objects/user-options",tags:[],version:"current",frontMatter:{id:"user-options",title:"UserOptions"},sidebar:"schemaSidebar",previous:{title:"UserModData",permalink:"/schema/objects/user-mod-data"},next:{title:"UserPreviousName",permalink:"/schema/objects/user-previous-name"}},u=[{value:"Fields",id:"fields",children:[]}],p={toc:u};function m(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"A user's general options"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type UserOptions {\n  titleLanguage: UserTitleLanguage\n  displayAdultContent: Boolean\n  airingNotifications: Boolean\n  profileColor: String\n  notificationOptions: [NotificationOption]\n  timezone: String\n  activityMergeTime: Int\n  staffNameLanguage: UserStaffNameLanguage\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"titlelanguage-usertitlelanguage"},(0,i.kt)("inlineCode",{parentName:"h4"},"titleLanguage")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/enums/user-title-language"},(0,i.kt)("inlineCode",{parentName:"a"},"UserTitleLanguage")),")"),(0,i.kt)("p",null,"The language the user wants to see media titles in"),(0,i.kt)("h4",{id:"displayadultcontent-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"displayAdultContent")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("p",null,"Whether the user has enabled viewing of 18+ content"),(0,i.kt)("h4",{id:"airingnotifications-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"airingNotifications")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,i.kt)("p",null,"Whether the user receives notifications when a show they are watching aires"),(0,i.kt)("h4",{id:"profilecolor-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"profileColor")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"Profile highlight color (blue, purple, pink, orange, red, green, gray)"),(0,i.kt)("h4",{id:"notificationoptions-notificationoption"},(0,i.kt)("inlineCode",{parentName:"h4"},"notificationOptions")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/notification-option"},(0,i.kt)("inlineCode",{parentName:"a"},"[NotificationOption]")),")"),(0,i.kt)("p",null,"Notification options"),(0,i.kt)("h4",{id:"timezone-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"timezone")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The user's timezone offset (Auth user only)"),(0,i.kt)("h4",{id:"activitymergetime-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"activityMergeTime")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always."),(0,i.kt)("h4",{id:"staffnamelanguage-userstaffnamelanguage"},(0,i.kt)("inlineCode",{parentName:"h4"},"staffNameLanguage")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/enums/user-staff-name-language"},(0,i.kt)("inlineCode",{parentName:"a"},"UserStaffNameLanguage")),")"),(0,i.kt)("p",null,"The language the user wants to see staff and character names in"))}m.isMDXComponent=!0}}]);