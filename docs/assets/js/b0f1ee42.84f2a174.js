"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[4366],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),p=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=p(n),d=r,h=m["".concat(c,".").concat(d)]||m[d]||s[d]||i;return n?a.createElement(h,o(o({ref:t},u),{},{components:n})):a.createElement(h,o({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5740:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=["components"],l={id:"favourites",title:"Favourites"},c=void 0,p={unversionedId:"schema/objects/favourites",id:"schema/objects/favourites",isDocsHomePage:!1,title:"Favourites",description:"User's favourite anime, manga, characters, staff & studios",source:"@site/docs/schema/objects/favourites.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/favourites",permalink:"/graphql-markdown/schema/objects/favourites",tags:[],version:"current",frontMatter:{id:"favourites",title:"Favourites"},sidebar:"basic",previous:{title:"Deleted",permalink:"/graphql-markdown/schema/objects/deleted"},next:{title:"FollowingNotification",permalink:"/graphql-markdown/schema/objects/following-notification"}},u=[{value:"Fields",id:"fields",children:[{value:"<code>anime</code> (MediaConnection)",id:"anime-mediaconnection",children:[],level:4},{value:"<code>manga</code> (MediaConnection)",id:"manga-mediaconnection",children:[],level:4},{value:"<code>characters</code> (CharacterConnection)",id:"characters-characterconnection",children:[],level:4},{value:"<code>staff</code> (StaffConnection)",id:"staff-staffconnection",children:[],level:4},{value:"<code>studios</code> (StudioConnection)",id:"studios-studioconnection",children:[],level:4}],level:3}],s={toc:u};function m(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"User's favourite anime, manga, characters, staff & studios"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type Favourites {\n  anime(page: Int, perPage: Int): MediaConnection\n  manga(page: Int, perPage: Int): MediaConnection\n  characters(page: Int, perPage: Int): CharacterConnection\n  staff(page: Int, perPage: Int): StaffConnection\n  studios(page: Int, perPage: Int): StudioConnection\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"anime-mediaconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"anime")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/media-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"MediaConnection")),")"),(0,i.kt)("p",null,"Favourite anime"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page number"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"manga-mediaconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"manga")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/media-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"MediaConnection")),")"),(0,i.kt)("p",null,"Favourite manga"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page number"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"characters-characterconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"characters")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/character-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"CharacterConnection")),")"),(0,i.kt)("p",null,"Favourite characters"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-2"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page number"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-2"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"staff-staffconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"staff")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/staff-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"StaffConnection")),")"),(0,i.kt)("p",null,"Favourite staff"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-3"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page number"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-3"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"studios-studioconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"studios")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/studio-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"StudioConnection")),")"),(0,i.kt)("p",null,"Favourite studios"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-4"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page number"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-4"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"))}m.isMDXComponent=!0}}]);