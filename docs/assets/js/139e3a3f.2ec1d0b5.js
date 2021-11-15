"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[8821],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return u}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),m=c(n),u=a,h=m["".concat(l,".").concat(u)]||m[u]||p[u]||o;return n?r.createElement(h,i(i({ref:t},d),{},{components:n})):r.createElement(h,i({ref:t},d))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5255:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],s={id:"media-list-type-options",title:"MediaListTypeOptions"},l=void 0,c={unversionedId:"schema/objects/media-list-type-options",id:"schema/objects/media-list-type-options",isDocsHomePage:!1,title:"MediaListTypeOptions",description:"A user's list options for anime or manga lists",source:"@site/docs/schema/objects/media-list-type-options.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/media-list-type-options",permalink:"/graphql-markdown/schema/objects/media-list-type-options",tags:[],version:"current",frontMatter:{id:"media-list-type-options",title:"MediaListTypeOptions"},sidebar:"basic",previous:{title:"MediaListOptions",permalink:"/graphql-markdown/schema/objects/media-list-options"},next:{title:"MediaList",permalink:"/graphql-markdown/schema/objects/media-list"}},d=[{value:"Fields",id:"fields",children:[{value:"<code>sectionOrder</code> (String)",id:"sectionorder-string",children:[],level:4},{value:"<code>splitCompletedSectionByFormat</code> (Boolean)",id:"splitcompletedsectionbyformat-boolean",children:[],level:4},{value:"<code>theme</code> (Json)",id:"theme-json",children:[],level:4},{value:"<code>customLists</code> (String)",id:"customlists-string",children:[],level:4},{value:"<code>advancedScoring</code> (String)",id:"advancedscoring-string",children:[],level:4},{value:"<code>advancedScoringEnabled</code> (Boolean)",id:"advancedscoringenabled-boolean",children:[],level:4}],level:3}],p={toc:d};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"A user's list options for anime or manga lists"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type MediaListTypeOptions {\n  sectionOrder: [String]\n  splitCompletedSectionByFormat: Boolean\n  theme: Json\n  customLists: [String]\n  advancedScoring: [String]\n  advancedScoringEnabled: Boolean\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"sectionorder-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"sectionOrder")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"The order each list should be displayed in"),(0,o.kt)("h4",{id:"splitcompletedsectionbyformat-boolean"},(0,o.kt)("inlineCode",{parentName:"h4"},"splitCompletedSectionByFormat")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,o.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,o.kt)("p",null,"If the completed sections of the list should be separated by format"),(0,o.kt)("h4",{id:"theme-json"},(0,o.kt)("inlineCode",{parentName:"h4"},"theme")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/json"},(0,o.kt)("inlineCode",{parentName:"a"},"Json")),")"),(0,o.kt)("span",{class:"badge badge--warning"},"DEPRECATED: This field has not yet been fully implemented and may change without warning"),(0,o.kt)("p",null,"The list theme options"),(0,o.kt)("h4",{id:"customlists-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"customLists")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"The names of the user's custom lists"),(0,o.kt)("h4",{id:"advancedscoring-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"advancedScoring")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"The names of the user's advanced scoring sections"),(0,o.kt)("h4",{id:"advancedscoringenabled-boolean"},(0,o.kt)("inlineCode",{parentName:"h4"},"advancedScoringEnabled")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,o.kt)("inlineCode",{parentName:"a"},"Boolean")),")"),(0,o.kt)("p",null,"If advanced scoring is enabled"))}m.isMDXComponent=!0}}]);