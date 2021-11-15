"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[9782],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return u}});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var f=r.createContext({}),s=function(e){var n=r.useContext(f),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},l=function(e){var n=s(e.components);return r.createElement(f.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,f=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=s(t),u=o,m=d["".concat(f,".").concat(u)]||d[u]||p[u]||a;return t?r.createElement(m,c(c({ref:n},l),{},{components:t})):r.createElement(m,c({ref:n},l))}));function u(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,c=new Array(a);c[0]=d;var i={};for(var f in n)hasOwnProperty.call(n,f)&&(i[f]=n[f]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var s=2;s<a;s++)c[s]=t[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},5257:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return i},contentTitle:function(){return f},metadata:function(){return s},toc:function(){return l},default:function(){return d}});var r=t(7462),o=t(3366),a=(t(7294),t(3905)),c=["components"],i={id:"staff-connection",title:"StaffConnection"},f=void 0,s={unversionedId:"schema/objects/staff-connection",id:"schema/objects/staff-connection",isDocsHomePage:!1,title:"StaffConnection",description:"No description",source:"@site/docs/schema/objects/staff-connection.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/staff-connection",permalink:"/graphql-markdown/schema/objects/staff-connection",tags:[],version:"current",frontMatter:{id:"staff-connection",title:"StaffConnection"},sidebar:"basic",previous:{title:"SiteTrend",permalink:"/graphql-markdown/schema/objects/site-trend"},next:{title:"StaffEdge",permalink:"/graphql-markdown/schema/objects/staff-edge"}},l=[{value:"Fields",id:"fields",children:[{value:"<code>edges</code> (StaffEdge)",id:"edges-staffedge",children:[],level:4},{value:"<code>nodes</code> (Staff)",id:"nodes-staff",children:[],level:4},{value:"<code>pageInfo</code> (PageInfo)",id:"pageinfo-pageinfo",children:[],level:4}],level:3}],p={toc:l};function d(e){var n=e.components,t=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"No description"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"type StaffConnection {\n  edges: [StaffEdge]\n  nodes: [Staff]\n  pageInfo: PageInfo\n}\n")),(0,a.kt)("h3",{id:"fields"},"Fields"),(0,a.kt)("h4",{id:"edges-staffedge"},(0,a.kt)("inlineCode",{parentName:"h4"},"edges")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/staff-edge"},(0,a.kt)("inlineCode",{parentName:"a"},"StaffEdge")),")"),(0,a.kt)("h4",{id:"nodes-staff"},(0,a.kt)("inlineCode",{parentName:"h4"},"nodes")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/staff"},(0,a.kt)("inlineCode",{parentName:"a"},"Staff")),")"),(0,a.kt)("h4",{id:"pageinfo-pageinfo"},(0,a.kt)("inlineCode",{parentName:"h4"},"pageInfo")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/page-info"},(0,a.kt)("inlineCode",{parentName:"a"},"PageInfo")),")"),(0,a.kt)("p",null,"The pagination information"))}d.isMDXComponent=!0}}]);