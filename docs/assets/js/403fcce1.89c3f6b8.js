"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[2499],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=c(n),m=a,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return n?r.createElement(f,o(o({ref:t},l),{},{components:n})):r.createElement(f,o({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:a,o[1]=u;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},35:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return l},default:function(){return d}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],u={id:"media-list-status",title:"MediaListStatus"},s=void 0,c={unversionedId:"schema/enums/media-list-status",id:"schema/enums/media-list-status",isDocsHomePage:!1,title:"MediaListStatus",description:"Media list watching/reading status enum.",source:"@site/docs/schema/enums/media-list-status.mdx",sourceDirName:"schema/enums",slug:"/schema/enums/media-list-status",permalink:"/schema/enums/media-list-status",tags:[],version:"current",frontMatter:{id:"media-list-status",title:"MediaListStatus"},sidebar:"schemaSidebar",previous:{title:"MediaListSort",permalink:"/schema/enums/media-list-sort"},next:{title:"MediaRankType",permalink:"/schema/enums/media-rank-type"}},l=[{value:"Values",id:"values",children:[]}],p={toc:l};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Media list watching/reading status enum."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"enum MediaListStatus {\n  CURRENT\n  PLANNING\n  COMPLETED\n  DROPPED\n  PAUSED\n  REPEATING\n}\n")),(0,i.kt)("h3",{id:"values"},"Values"),(0,i.kt)("h4",{id:"current"},(0,i.kt)("inlineCode",{parentName:"h4"},"CURRENT")),(0,i.kt)("p",null,"Currently watching/reading"),(0,i.kt)("h4",{id:"planning"},(0,i.kt)("inlineCode",{parentName:"h4"},"PLANNING")),(0,i.kt)("p",null,"Planning to watch/read"),(0,i.kt)("h4",{id:"completed"},(0,i.kt)("inlineCode",{parentName:"h4"},"COMPLETED")),(0,i.kt)("p",null,"Finished watching/reading"),(0,i.kt)("h4",{id:"dropped"},(0,i.kt)("inlineCode",{parentName:"h4"},"DROPPED")),(0,i.kt)("p",null,"Stopped watching/reading before completing"),(0,i.kt)("h4",{id:"paused"},(0,i.kt)("inlineCode",{parentName:"h4"},"PAUSED")),(0,i.kt)("p",null,"Paused watching/reading"),(0,i.kt)("h4",{id:"repeating"},(0,i.kt)("inlineCode",{parentName:"h4"},"REPEATING")),(0,i.kt)("p",null,"Re-watching/reading"))}d.isMDXComponent=!0}}]);