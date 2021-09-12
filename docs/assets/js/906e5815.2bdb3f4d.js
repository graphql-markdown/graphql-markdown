"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[8342],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return d}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),m=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=m(e.components);return n.createElement(l.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=m(a),d=r,f=c["".concat(l,".").concat(d)]||c[d]||h[d]||i;return a?n.createElement(f,o(o({ref:t},p),{},{components:a})):n.createElement(f,o({ref:t},p))}));function d(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var m=2;m<i;m++)o[m]=a[m];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},647:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return m},toc:function(){return p},default:function(){return c}});var n=a(7462),r=a(3366),i=(a(7294),a(3905)),o=["components"],s={id:"staff",title:"Staff"},l=void 0,m={unversionedId:"schema/objects/staff",id:"schema/objects/staff",isDocsHomePage:!1,title:"Staff",description:"Voice actors or production staff",source:"@site/docs/schema/objects/staff.mdx",sourceDirName:"schema/objects",slug:"/schema/objects/staff",permalink:"/schema/objects/staff",tags:[],version:"current",frontMatter:{id:"staff",title:"Staff"},sidebar:"schemaSidebar",previous:{title:"StaffSubmission",permalink:"/schema/objects/staff-submission"},next:{title:"StatusDistribution",permalink:"/schema/objects/status-distribution"}},p=[{value:"Fields",id:"fields",children:[]}],h={toc:p};function c(e){var t=e.components,a=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Voice actors or production staff"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-graphql"},"type Staff {\n  id: Int!\n  name: StaffName\n  language: StaffLanguage\n  languageV2: String\n  image: StaffImage\n  description(asHtml: Boolean): String\n  primaryOccupations: [String]\n  gender: String\n  dateOfBirth: FuzzyDate\n  dateOfDeath: FuzzyDate\n  age: Int\n  yearsActive: [Int]\n  homeTown: String\n  bloodType: String\n  isFavourite: Boolean!\n  isFavouriteBlocked: Boolean!\n  siteUrl: String\n  staffMedia(\n    sort: [MediaSort]\n    type: MediaType\n    onList: Boolean\n    page: Int\n    perPage: Int\n  ): MediaConnection\n  characters(\n    sort: [CharacterSort]\n    page: Int\n    perPage: Int\n  ): CharacterConnection\n  characterMedia(\n    sort: [MediaSort]\n    onList: Boolean\n    page: Int\n    perPage: Int\n  ): MediaConnection\n  updatedAt: Int\n  staff: Staff\n  submitter: User\n  submissionStatus: Int\n  submissionNotes: String\n  favourites: Int\n  modNotes: String\n}\n")),(0,i.kt)("h3",{id:"fields"},"Fields"),(0,i.kt)("h4",{id:"id-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"id")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int!")),")"),(0,i.kt)("p",null,"The id of the staff member"),(0,i.kt)("h4",{id:"name-staffname"},(0,i.kt)("inlineCode",{parentName:"h4"},"name")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/staff-name"},(0,i.kt)("inlineCode",{parentName:"a"},"StaffName")),")"),(0,i.kt)("p",null,"The names of the staff member"),(0,i.kt)("h4",{id:"language-stafflanguage"},(0,i.kt)("inlineCode",{parentName:"h4"},"language")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/enums/staff-language"},(0,i.kt)("inlineCode",{parentName:"a"},"StaffLanguage")),")"),(0,i.kt)("span",{class:"badge badge--warning"},"DEPRECATED: Replaced with languageV2"),(0,i.kt)("p",null,"The primary language the staff member dub's in"),(0,i.kt)("h4",{id:"languagev2-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"languageV2")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan"),(0,i.kt)("h4",{id:"image-staffimage"},(0,i.kt)("inlineCode",{parentName:"h4"},"image")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/staff-image"},(0,i.kt)("inlineCode",{parentName:"a"},"StaffImage")),")"),(0,i.kt)("p",null,"The staff images"),(0,i.kt)("h4",{id:"description-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"description")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"A general description of the staff member"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"ashtml-boolean"},(0,i.kt)("inlineCode",{parentName:"h5"},"asHtml")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")"))),(0,i.kt)("p",null,"Return the string in pre-parsed html instead of markdown"),(0,i.kt)("h4",{id:"primaryoccupations-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"primaryOccupations")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"[String]")),")"),(0,i.kt)("p",null,"The person's primary occupations"),(0,i.kt)("h4",{id:"gender-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"gender")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The staff's gender. Usually Male, Female, or Non-binary but can be any string."),(0,i.kt)("h4",{id:"dateofbirth-fuzzydate"},(0,i.kt)("inlineCode",{parentName:"h4"},"dateOfBirth")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/fuzzy-date"},(0,i.kt)("inlineCode",{parentName:"a"},"FuzzyDate")),")"),(0,i.kt)("h4",{id:"dateofdeath-fuzzydate"},(0,i.kt)("inlineCode",{parentName:"h4"},"dateOfDeath")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/fuzzy-date"},(0,i.kt)("inlineCode",{parentName:"a"},"FuzzyDate")),")"),(0,i.kt)("h4",{id:"age-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"age")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"The person's age in years"),(0,i.kt)("h4",{id:"yearsactive-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"yearsActive")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"[Int]")),")"),(0,i.kt)("p",null,"[startYear, endYear]"," (If the 2nd value is not present staff is still active)"),(0,i.kt)("h4",{id:"hometown-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"homeTown")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The persons birthplace or hometown"),(0,i.kt)("h4",{id:"bloodtype-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"bloodType")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The persons blood type"),(0,i.kt)("h4",{id:"isfavourite-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"isFavourite")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean!")),")"),(0,i.kt)("p",null,"If the staff member is marked as favourite by the currently authenticated user"),(0,i.kt)("h4",{id:"isfavouriteblocked-boolean"},(0,i.kt)("inlineCode",{parentName:"h4"},"isFavouriteBlocked")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean!")),")"),(0,i.kt)("p",null,"If the staff member is blocked from being added to favourites"),(0,i.kt)("h4",{id:"siteurl-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"siteUrl")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"The url for the staff page on the AniList website"),(0,i.kt)("h4",{id:"staffmedia-mediaconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"staffMedia")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/media-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"MediaConnection")),")"),(0,i.kt)("p",null,"Media where the staff member has a production role"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"sort-mediasort"},(0,i.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/enums/media-sort"},(0,i.kt)("inlineCode",{parentName:"a"},"[MediaSort]")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"type-mediatype"},(0,i.kt)("inlineCode",{parentName:"h5"},"type")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/enums/media-type"},(0,i.kt)("inlineCode",{parentName:"a"},"MediaType")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"onlist-boolean"},(0,i.kt)("inlineCode",{parentName:"h5"},"onList")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"characters-characterconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"characters")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/character-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"CharacterConnection")),")"),(0,i.kt)("p",null,"Characters voiced by the actor"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"sort-charactersort"},(0,i.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/enums/character-sort"},(0,i.kt)("inlineCode",{parentName:"a"},"[CharacterSort]")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"charactermedia-mediaconnection"},(0,i.kt)("inlineCode",{parentName:"h4"},"characterMedia")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/media-connection"},(0,i.kt)("inlineCode",{parentName:"a"},"MediaConnection")),")"),(0,i.kt)("p",null,"Media the actor voiced characters in. (Same data as characters with media as node instead of characters)"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"sort-mediasort-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"sort")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/enums/media-sort"},(0,i.kt)("inlineCode",{parentName:"a"},"[MediaSort]")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"onlist-boolean-1"},(0,i.kt)("inlineCode",{parentName:"h5"},"onList")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/boolean"},(0,i.kt)("inlineCode",{parentName:"a"},"Boolean")),")")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"page-int-2"},(0,i.kt)("inlineCode",{parentName:"h5"},"page")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The page"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("h5",{parentName:"li",id:"perpage-int-2"},(0,i.kt)("inlineCode",{parentName:"h5"},"perPage")," (",(0,i.kt)("a",{parentName:"h5",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"))),(0,i.kt)("p",null,"The amount of entries per page, max 25"),(0,i.kt)("h4",{id:"updatedat-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"updatedAt")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("span",{class:"badge badge--warning"},"DEPRECATED: No data available"),(0,i.kt)("h4",{id:"staff-staff"},(0,i.kt)("inlineCode",{parentName:"h4"},"staff")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/staff"},(0,i.kt)("inlineCode",{parentName:"a"},"Staff")),")"),(0,i.kt)("p",null,"Staff member that the submission is referencing"),(0,i.kt)("h4",{id:"submitter-user"},(0,i.kt)("inlineCode",{parentName:"h4"},"submitter")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/objects/user"},(0,i.kt)("inlineCode",{parentName:"a"},"User")),")"),(0,i.kt)("p",null,"Submitter for the submission"),(0,i.kt)("h4",{id:"submissionstatus-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"submissionStatus")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"Status of the submission"),(0,i.kt)("h4",{id:"submissionnotes-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"submissionNotes")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"Inner details of submission status"),(0,i.kt)("h4",{id:"favourites-int"},(0,i.kt)("inlineCode",{parentName:"h4"},"favourites")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/int"},(0,i.kt)("inlineCode",{parentName:"a"},"Int")),")"),(0,i.kt)("p",null,"The amount of user's who have favourited the staff member"),(0,i.kt)("h4",{id:"modnotes-string"},(0,i.kt)("inlineCode",{parentName:"h4"},"modNotes")," (",(0,i.kt)("a",{parentName:"h4",href:"/schema/scalars/string"},(0,i.kt)("inlineCode",{parentName:"a"},"String")),")"),(0,i.kt)("p",null,"Notes for site moderators"))}c.isMDXComponent=!0}}]);