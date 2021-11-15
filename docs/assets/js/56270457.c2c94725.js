"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[6916],{3905:function(e,t,a){a.d(t,{Zo:function(){return s},kt:function(){return m}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),d=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):c(c({},t),e)),a},s=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),f=d(a),m=n,u=f["".concat(l,".").concat(m)]||f[m]||h[m]||o;return a?r.createElement(u,c(c({ref:t},s),{},{components:a})):r.createElement(u,c({ref:t},s))}));function m(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,c=new Array(o);c[0]=f;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:n,c[1]=i;for(var d=2;d<o;d++)c[d]=a[d];return r.createElement.apply(null,c)}return r.createElement.apply(null,a)}f.displayName="MDXCreateElement"},4143:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return s},default:function(){return f}});var r=a(7462),n=a(3366),o=(a(7294),a(3905)),c=["components"],i={id:"character-edge",title:"CharacterEdge"},l=void 0,d={unversionedId:"schema/objects/character-edge",id:"schema/objects/character-edge",isDocsHomePage:!1,title:"CharacterEdge",description:"Character connection edge",source:"@site/docs/schema/objects/character-edge.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/character-edge",permalink:"/graphql-markdown/schema/objects/character-edge",tags:[],version:"current",frontMatter:{id:"character-edge",title:"CharacterEdge"},sidebar:"basic",previous:{title:"CharacterConnection",permalink:"/graphql-markdown/schema/objects/character-connection"},next:{title:"CharacterImage",permalink:"/graphql-markdown/schema/objects/character-image"}},s=[{value:"Fields",id:"fields",children:[{value:"<code>node</code> (Character)",id:"node-character",children:[],level:4},{value:"<code>id</code> (Int)",id:"id-int",children:[],level:4},{value:"<code>role</code> (CharacterRole)",id:"role-characterrole",children:[],level:4},{value:"<code>name</code> (String)",id:"name-string",children:[],level:4},{value:"<code>voiceActors</code> (Staff)",id:"voiceactors-staff",children:[],level:4},{value:"<code>voiceActorRoles</code> (StaffRoleType)",id:"voiceactorroles-staffroletype",children:[],level:4},{value:"<code>media</code> (Media)",id:"media-media",children:[],level:4},{value:"<code>favouriteOrder</code> (Int)",id:"favouriteorder-int",children:[],level:4}],level:3}],h={toc:s};function f(e){var t=e.components,a=(0,n.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Character connection edge"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-graphql"},"type CharacterEdge {\n  node: Character\n  id: Int\n  role: CharacterRole\n  name: String\n  voiceActors(language: StaffLanguage, sort: [StaffSort]): [Staff]\n  voiceActorRoles(language: StaffLanguage, sort: [StaffSort]): [StaffRoleType]\n  media: [Media]\n  favouriteOrder: Int\n}\n")),(0,o.kt)("h3",{id:"fields"},"Fields"),(0,o.kt)("h4",{id:"node-character"},(0,o.kt)("inlineCode",{parentName:"h4"},"node")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/objects/character"},(0,o.kt)("inlineCode",{parentName:"a"},"Character")),")"),(0,o.kt)("h4",{id:"id-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("p",null,"The id of the connection"),(0,o.kt)("h4",{id:"role-characterrole"},(0,o.kt)("inlineCode",{parentName:"h4"},"role")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/enums/character-role"},(0,o.kt)("inlineCode",{parentName:"a"},"CharacterRole")),")"),(0,o.kt)("p",null,"The characters role in the media"),(0,o.kt)("h4",{id:"name-string"},(0,o.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,o.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,o.kt)("p",null,"Media specific character name"),(0,o.kt)("h4",{id:"voiceactors-staff"},(0,o.kt)("inlineCode",{parentName:"h4"},"voiceActors")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/objects/staff"},(0,o.kt)("inlineCode",{parentName:"a"},"Staff")),")"),(0,o.kt)("p",null,"The voice actors of the character"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("h5",{parentName:"li",id:"language-stafflanguage"},(0,o.kt)("inlineCode",{parentName:"h5"},"language")," (",(0,o.kt)("a",{parentName:"h5",href:"/schema/enums/staff-language"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffLanguage")),")")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("h5",{parentName:"li",id:"sort-staffsort"},(0,o.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,o.kt)("a",{parentName:"h5",href:"/schema/enums/staff-sort"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffSort")),")"))),(0,o.kt)("h4",{id:"voiceactorroles-staffroletype"},(0,o.kt)("inlineCode",{parentName:"h4"},"voiceActorRoles")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/objects/staff-role-type"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffRoleType")),")"),(0,o.kt)("p",null,"The voice actors of the character with role date"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("h5",{parentName:"li",id:"language-stafflanguage-1"},(0,o.kt)("inlineCode",{parentName:"h5"},"language")," (",(0,o.kt)("a",{parentName:"h5",href:"/schema/enums/staff-language"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffLanguage")),")")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("h5",{parentName:"li",id:"sort-staffsort-1"},(0,o.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,o.kt)("a",{parentName:"h5",href:"/schema/enums/staff-sort"},(0,o.kt)("inlineCode",{parentName:"a"},"StaffSort")),")"))),(0,o.kt)("h4",{id:"media-media"},(0,o.kt)("inlineCode",{parentName:"h4"},"media")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/objects/media"},(0,o.kt)("inlineCode",{parentName:"a"},"Media")),")"),(0,o.kt)("p",null,"The media the character is in"),(0,o.kt)("h4",{id:"favouriteorder-int"},(0,o.kt)("inlineCode",{parentName:"h4"},"favouriteOrder")," (",(0,o.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,o.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,o.kt)("p",null,"The order the character should be displayed from the users favourites"))}f.isMDXComponent=!0}}]);