"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[9033],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return m}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=n.createContext({}),d=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=d(e.components);return n.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=d(r),m=i,v=p["".concat(c,".").concat(m)]||p[m]||s[m]||a;return r?n.createElement(v,o(o({ref:t},u),{},{components:r})):n.createElement(v,o({ref:t},u))}));function m(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=p;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var d=2;d<a;d++)o[d]=r[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},3581:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return u},default:function(){return p}});var n=r(7462),i=r(3366),a=(r(7294),r(3905)),o=["components"],l={id:"review",title:"Review"},c=void 0,d={unversionedId:"schema/queries/review",id:"schema/queries/review",isDocsHomePage:!1,title:"Review",description:"Review query",source:"@site/docs/schema/queries/review.mdx",sourceDirName:"schema/queries",slug:"/schema/queries/review",permalink:"/graphql-markdown/schema/queries/review",tags:[],version:"current",frontMatter:{id:"review",title:"Review"},sidebar:"basic",previous:{title:"Recommendation",permalink:"/graphql-markdown/schema/queries/recommendation"},next:{title:"SiteStatistics",permalink:"/graphql-markdown/schema/queries/site-statistics"}},u=[{value:"Arguments",id:"arguments",children:[{value:"<code>id</code> (Int)",id:"id-int",children:[],level:4},{value:"<code>mediaId</code> (Int)",id:"mediaid-int",children:[],level:4},{value:"<code>userId</code> (Int)",id:"userid-int",children:[],level:4},{value:"<code>mediaType</code> (MediaType)",id:"mediatype-mediatype",children:[],level:4},{value:"<code>sort</code> (ReviewSort)",id:"sort-reviewsort",children:[],level:4}],level:3},{value:"Type",id:"type",children:[{value:"Review",id:"review",children:[],level:4}],level:3}],s={toc:u};function p(e){var t=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Review query"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-graphql"},"Review(\n  id: Int\n  mediaId: Int\n  userId: Int\n  mediaType: MediaType\n  sort: [ReviewSort]\n): Review\n\n")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("h4",{id:"id-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("p",null,"Filter by Review id"),(0,a.kt)("h4",{id:"mediaid-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"mediaId")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("p",null,"Filter by media id"),(0,a.kt)("h4",{id:"userid-int"},(0,a.kt)("inlineCode",{parentName:"h4"},"userId")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,a.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,a.kt)("p",null,"Filter by user id"),(0,a.kt)("h4",{id:"mediatype-mediatype"},(0,a.kt)("inlineCode",{parentName:"h4"},"mediaType")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/enums/media-type"},(0,a.kt)("inlineCode",{parentName:"a"},"MediaType")),")"),(0,a.kt)("p",null,"Filter by media type"),(0,a.kt)("h4",{id:"sort-reviewsort"},(0,a.kt)("inlineCode",{parentName:"h4"},"sort")," (",(0,a.kt)("a",{parentName:"h4",href:"/schema/enums/review-sort"},(0,a.kt)("inlineCode",{parentName:"a"},"ReviewSort")),")"),(0,a.kt)("p",null,"The order the results will be returned in"),(0,a.kt)("h3",{id:"type"},"Type"),(0,a.kt)("h4",{id:"review"},(0,a.kt)("a",{parentName:"h4",href:"/schema/objects/review"},(0,a.kt)("inlineCode",{parentName:"a"},"Review"))),(0,a.kt)("p",null,"A Review that features in an anime or manga"))}p.isMDXComponent=!0}}]);