"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[6775],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),d=i,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||a;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<a;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1463:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return u},default:function(){return p}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),o=["components"],l={id:"delete-custom-list",title:"DeleteCustomList"},s=void 0,c={unversionedId:"schema/mutations/delete-custom-list",id:"schema/mutations/delete-custom-list",isDocsHomePage:!1,title:"DeleteCustomList",description:"Delete a custom list and remove the list entries from it",source:"@site/docs/schema/mutations/delete-custom-list.mdx",sourceDirName:"schema/mutations",slug:"/schema/mutations/delete-custom-list",permalink:"/graphql-markdown/schema/mutations/delete-custom-list",tags:[],version:"current",frontMatter:{id:"delete-custom-list",title:"DeleteCustomList"},sidebar:"basic",previous:{title:"DeleteActivity",permalink:"/graphql-markdown/schema/mutations/delete-activity"},next:{title:"DeleteMediaListEntry",permalink:"/graphql-markdown/schema/mutations/delete-media-list-entry"}},u=[{value:"Arguments",id:"arguments",children:[{value:"<code>customList</code> (String)",id:"customlist-string",children:[],level:4},{value:"<code>type</code> (MediaType)",id:"type-mediatype",children:[],level:4}],level:3},{value:"Type",id:"type",children:[{value:"Deleted",id:"deleted",children:[],level:4}],level:3}],m={toc:u};function p(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Delete a custom list and remove the list entries from it"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"DeleteCustomList(\n  customList: String\n  type: MediaType\n): Deleted\n\n")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("h4",{id:"customlist-string"},(0,a.kt)("inlineCode",{parentName:"h4"},"customList")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,a.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,a.kt)("p",null,"The name of the custom list to delete"),(0,a.kt)("h4",{id:"type-mediatype"},(0,a.kt)("inlineCode",{parentName:"h4"},"type")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/enums/media-type"},(0,a.kt)("inlineCode",{parentName:"a"},"MediaType")),")"),(0,a.kt)("p",null,"The media list type of the custom list"),(0,a.kt)("h3",{id:"type"},"Type"),(0,a.kt)("h4",{id:"deleted"},(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/deleted"},(0,a.kt)("inlineCode",{parentName:"a"},"Deleted"))),(0,a.kt)("p",null,"Deleted data type"))}p.isMDXComponent=!0}}]);