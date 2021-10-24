"use strict";(self.webpackChunkdocusaurus_2=self.webpackChunkdocusaurus_2||[]).push([[8421],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return m}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,h=c["".concat(s,".").concat(m)]||c[m]||u[m]||o;return n?a.createElement(h,i(i({ref:t},p),{},{components:n})):a.createElement(h,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=c;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},6527:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return d},toc:function(){return p},default:function(){return c}});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),i=["components"],l={slug:"/"},s="GraphQL Documentation Generator for Docusaurus 2",d={unversionedId:"README",id:"README",isDocsHomePage:!1,title:"GraphQL Documentation Generator for Docusaurus 2",description:"npm",source:"@site/docs/README.md",sourceDirName:".",slug:"/",permalink:"/graphql-markdown/",tags:[],version:"current",frontMatter:{slug:"/"}},p=[{value:"Installation",id:"installation",children:[{value:"npm",id:"npm",children:[]},{value:"Yarn",id:"yarn",children:[]}]},{value:"Configuration",id:"configuration",children:[{value:"Plugin Options",id:"plugin-options",children:[]},{value:'<a name="loaders" />Plugin Loaders',id:"plugin-loaders",children:[]},{value:"Site Settings",id:"site-settings",children:[]},{value:"Sidebars Settings",id:"sidebars-settings",children:[]},{value:"Home Page",id:"home-page",children:[]}]},{value:"Usage",id:"usage",children:[{value:"Options",id:"options",children:[]}]},{value:"Troubleshooting",id:"troubleshooting",children:[{value:"<code>Duplicate &quot;graphql&quot; modules cannot be used at the same time</code>",id:"duplicate-graphql-modules-cannot-be-used-at-the-same-time",children:[]},{value:"<code>Unable to find any GraphQL type definitions</code>",id:"unable-to-find-any-graphql-type-definitions",children:[]},{value:"<code>Unable to find any GraphQL type definitions for the following pointers</code>",id:"unable-to-find-any-graphql-type-definitions-for-the-following-pointers",children:[]}]},{value:"Contributions",id:"contributions",children:[]}],u={toc:p};function c(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"graphql-documentation-generator-for-docusaurus-2"},"GraphQL Documentation Generator for Docusaurus 2"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator"},(0,o.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/dt/@edno/docusaurus2-graphql-doc-generator?style=flat-square",alt:"npm"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator"},(0,o.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/v/@edno/docusaurus2-graphql-doc-generator?style=flat-square",alt:"Latest Version"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://raw.githubusercontent.com/edno/docusaurus2-graphql-doc-generator/main/LICENSE"},(0,o.kt)("img",{parentName:"a",src:"https://img.shields.io/github/license/edno/docusaurus2-graphql-doc-generator?style=flat-square",alt:"GitHub License"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://coveralls.io/github/edno/graphql-markdown?branch=main"},(0,o.kt)("img",{parentName:"a",src:"https://img.shields.io/coveralls/github/edno/graphql-markdown?style=flat-square",alt:"Coverage Status"})),"\n",(0,o.kt)("a",{parentName:"p",href:"https://dashboard.stryker-mutator.io/reports/github.com/edno/graphql-markdown/main"},(0,o.kt)("img",{parentName:"a",src:"https://img.shields.io/endpoint?label=mutation%20score&style=flat-square&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fedno%2Fgraphql-markdown%2Fmain",alt:"Mutation Score"}))),(0,o.kt)("p",null,"This plugin generates a ",(0,o.kt)("strong",{parentName:"p"},"Markdown documentation")," from a ",(0,o.kt)("strong",{parentName:"p"},"GraphQL schema"),"."),(0,o.kt)("p",null,"The documentation is generated for ",(0,o.kt)("strong",{parentName:"p"},"Docusaurus 2")," ",(0,o.kt)("a",{parentName:"p",href:"https://v2.docusaurus.io/docs/docs-introduction"},"docs feature"),"."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("h3",{id:"npm"},"npm"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npm install --save @edno/docusaurus2-graphql-doc-generator\n")),(0,o.kt)("h3",{id:"yarn"},"Yarn"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"yarn add @edno/docusaurus2-graphql-doc-generator\n")),(0,o.kt)("p",null,"Then you add it in your site's ",(0,o.kt)("inlineCode",{parentName:"p"},"docusaurus.config.js"),"'s plugins option:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'module.exports = {\n  // ...\n  plugins: ["@edno/docusaurus2-graphql-doc-generator"],\n};\n')),(0,o.kt)("h2",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,"You can define some or all of the plugin options directly at the plugin level in in the Docusaurus configuration file ",(0,o.kt)("inlineCode",{parentName:"p"},"docusaurus.config.js"),":"),(0,o.kt)("h3",{id:"plugin-options"},"Plugin Options"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'module.exports = {\n  // ...\n  plugins: [\n    [\n      \'@edno/docusaurus2-graphql-doc-generator\',,\n      {\n        schema: "./schema/swapi.graphql",\n        rootPath: "./docs", // docs will be generated under \'./docs/swapi\' (rootPath/baseURL)\n        baseURL: "swapi",\n        homepage: "./docs/swapi.md",\n      },\n    ],\n  ],\n};\n')),(0,o.kt)("p",null,"Each option is described in the section ",(0,o.kt)("a",{parentName:"p",href:"#options"},"Options"),"."),(0,o.kt)("h3",{id:"plugin-loaders"},(0,o.kt)("a",{name:"loaders"}),"Plugin Loaders"),(0,o.kt)("p",null,"Starting version ",(0,o.kt)("inlineCode",{parentName:"p"},"1.5.0"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"docusaurus2-graphql-doc-generator")," only provides ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-file-loader")," document loader out-of-the-box.\nThus, by default, the ",(0,o.kt)("inlineCode",{parentName:"p"},"schema")," default loading expects a local GraphQL schema definition file (",(0,o.kt)("inlineCode",{parentName:"p"},"*.graphql"),")."),(0,o.kt)("p",null,"However, this behavior can be extended by installing additional GraphQL document loaders (see ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/ardatan/graphql-tools/tree/master/packages/loaders"},"full list"),")."),(0,o.kt)("p",null,"If you want to load a schema from a URL, you first need to install the package ",(0,o.kt)("inlineCode",{parentName:"p"},"@graphql-tools/url-loader")," into your Docusaurus project:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"yarn add @graphql-tools/url-loader\n")),(0,o.kt)("p",null,"Once done, you can declare the loader into ",(0,o.kt)("inlineCode",{parentName:"p"},"docusaurus2-graphql-doc-generator")," configuration:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"plugins: [\n    [\n      '@edno/docusaurus2-graphql-doc-generator',\n      {\n        // ... other options\n        loaders: {\n          UrlLoader: \"@graphql-tools/url-loader\"\n        }\n      },\n    ],\n  ],\n")),(0,o.kt)("p",null,"You can declare as many loaders as you need using the structure:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'type className = string; // UrlLoader\n\ntype moduleName = string; // "@graphql-tools/url-loader"\ntype moduleOptions = { [option: string]: any };\n\ntype module = { \n  module: moduleName, \n  options: moduleOptions | undefined \n}\n\ntype loaders = {\n  [className: className]: moduleName | module\n}\n')),(0,o.kt)("h3",{id:"site-settings"},"Site Settings"),(0,o.kt)("p",null,"You will also need to add a link to your documentation on your site. One way to do it is to add it to your site's navbar in ",(0,o.kt)("inlineCode",{parentName:"p"},"docusaurus.config.js"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'module.exports = {\n  // ...\n  navbar: {\n    items: [\n      {\n        to: "/swapi/homepage", // adjust the location depending on your baseURL (see configuration)\n        label: "SWAPI Schema", // change the label with yours\n        position: "left",\n      },\n    ],\n  },\n};\n')),(0,o.kt)("p",null,"For more details about navbar, please refer to Docusaurus 2 ",(0,o.kt)("a",{parentName:"p",href:"https://v2.docusaurus.io/docs/theme-classic/#navbar-links"},"documentation"),"."),(0,o.kt)("h3",{id:"sidebars-settings"},"Sidebars Settings"),(0,o.kt)("p",null,"A sidebar file ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebar-schema.js")," will be generated for the documentation, you have them different options depending on your Docusaurus setup:"),(0,o.kt)("h4",{id:"1-single-docs-instance"},"1. Single Docs instance"),(0,o.kt)("p",null,"In this use case, you have a unique set of documentation, then you just need to add a reference to ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebar-schema.js")," into the default ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebar.js"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'module.exports = {\n  docsSidebar: [\n    // ... your site\'s sidebar\n  ],\n  ...require("./docs/swapi/sidebar-schema.js"),\n};\n')),(0,o.kt)("h5",{id:"important"},"Important"),(0,o.kt)("p",null,"The sidebar path must be relative to the ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebars.js")," location. By default, the plugin provides a relative path from the root folder of Docusaurus."),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"For example: if your ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebars.js")," is located under ",(0,o.kt)("inlineCode",{parentName:"p"},"./src")," folder, then you need to go one level up in the path: ",(0,o.kt)("inlineCode",{parentName:"p"},"./../docs/swapi/sidebar-schema"))),(0,o.kt)("h4",{id:"2-docs-multi-instance"},"2. Docs Multi-instance"),(0,o.kt)("p",null,"In this use case, you have multiple sets of documentation (a.k.a. ",(0,o.kt)("a",{parentName:"p",href:"https://docusaurus.io/docs/next/docs-multi-instance"},"Docs Multi-instance"),"), then you need to add a reference to ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebar-schema.js")," into the dedicated instance of ",(0,o.kt)("inlineCode",{parentName:"p"},"@docusaurus/plugin-content-docs"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"plugins: [\n    [\n      '@docusaurus/plugin-content-docs',\n      {\n        id: 'api',\n        path: 'api',\n        routeBasePath: 'api',\n        sidebarPath: require.resolve('./api/sidebar-schema.js'),\n        // ... other options\n      },\n    ],\n  ],\n")),(0,o.kt)("h3",{id:"home-page"},"Home Page"),(0,o.kt)("p",null,"If you decide to use your own home page for the GraphQL generated documentation, then set the page ID to ",(0,o.kt)("inlineCode",{parentName:"p"},"id: schema")," and the sidebar position to ",(0,o.kt)("inlineCode",{parentName:"p"},"sidebar_position: 1"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-markdown"},"---\nid: schema\nslug: /schema\ntitle: Schema Documentation\nsidebar_position: 1\n---\n\nThis documentation has been automatically generated from the GraphQL schema.\n")),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"The plugin adds a new command ",(0,o.kt)("inlineCode",{parentName:"p"},"graphql-to-doc")," to the ",(0,o.kt)("a",{parentName:"p",href:"https://v2.docusaurus.io/docs/cli"},"Docusaurus CLI"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npx docusaurus graphql-to-doc\n")),(0,o.kt)("h3",{id:"options"},"Options"),(0,o.kt)("p",null,"By default, the plugin will use the options as defined in the plugin's ",(0,o.kt)("a",{parentName:"p",href:"#configuration"},"configuration"),", but they can be overridden by passing them with the command."),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Config File"),(0,o.kt)("th",{parentName:"tr",align:null},"CLI Flag"),(0,o.kt)("th",{parentName:"tr",align:null},"Default"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"baseURL")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-b, --base <baseURL>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"schema")),(0,o.kt)("td",{parentName:"tr",align:null},"The base URL to be used by Docusaurus. It will also be used as folder name under ",(0,o.kt)("inlineCode",{parentName:"td"},"rootPath")," for the generated documentation.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"diffMethod")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-d, --diff <diffMethod>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"SCHEMA-DIFF")),(0,o.kt)("td",{parentName:"tr",align:null},"The method to be used for identifying changes in the schema for triggering the documentation generation. The possible values are:",(0,o.kt)("br",null)," - ",(0,o.kt)("inlineCode",{parentName:"td"},"SCHEMA-DIFF"),": use ",(0,o.kt)("a",{parentName:"td",href:"https://graphql-inspector.com/"},"GraphQL Inspector")," for identifying changes in the schema (including description)",(0,o.kt)("br",null)," - ",(0,o.kt)("inlineCode",{parentName:"td"},"SCHEMA-HASH"),": use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters)",(0,o.kt)("br",null),"Any other value will disable the change detection.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"homepage")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-h, --homepage <homepage>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"generated.md")),(0,o.kt)("td",{parentName:"tr",align:null},"The location of the landing page to be used for the documentation, relative to the current workspace. The file will be copied at the root folder of the generated documentation.",(0,o.kt)("br",null),"By default, the plugin provides a default page ",(0,o.kt)("inlineCode",{parentName:"td"},"assets/generated.md"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"linkRoot")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-l, --link <linkRoot>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"/")),(0,o.kt)("td",{parentName:"tr",align:null},"The root for links in documentation. It depends on the entry for the schema main page in the Docusaurus sidebar.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"loaders")),(0,o.kt)("td",{parentName:"tr",align:null}),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},'{GraphQLFileLoader: "@graphql-tools/graphql-file-loader"}')),(0,o.kt)("td",{parentName:"tr",align:null},"GraphQL schema loader/s to be used (see ",(0,o.kt)("a",{parentName:"td",href:"#loaders"},"Loaders"),").")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"rootPath")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-r, --root <rootPath>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"./docs")),(0,o.kt)("td",{parentName:"tr",align:null},"The output root path for the generated documentation, relative to the current workspace. The final path will be ",(0,o.kt)("inlineCode",{parentName:"td"},"rootPath/baseURL"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"schema")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-s, --schema <schema>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"./schema.graphql")),(0,o.kt)("td",{parentName:"tr",align:null},"The schema location. It should be compatible with the GraphQL Tools ",(0,o.kt)("a",{parentName:"td",href:"https://www.graphql-tools.com/docs/schema-loading"},"schema loaders")," (see ",(0,o.kt)("a",{parentName:"td",href:"#loaders"},"Loaders"),").")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"tmpDir")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-t, --tmp <tmpDir>")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("em",{parentName:"td"},"OS temp folder")),(0,o.kt)("td",{parentName:"tr",align:null},"The folder used for storing schema copy and signature used by ",(0,o.kt)("inlineCode",{parentName:"td"},"diffMethod"),".")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null}),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("inlineCode",{parentName:"td"},"-f, --force")),(0,o.kt)("td",{parentName:"tr",align:null},"-"),(0,o.kt)("td",{parentName:"tr",align:null},"Force documentation generation (bypass diff).")))),(0,o.kt)("h4",{id:"about-diffmethod"},"About ",(0,o.kt)("inlineCode",{parentName:"h4"},"diffMethod")),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"diffMethod")," is only used for identifying if the schema has changed. If a change is detected since last documentation generation, then the full schema documentation will be generated."),(0,o.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,o.kt)("h3",{id:"duplicate-graphql-modules-cannot-be-used-at-the-same-time"},(0,o.kt)("inlineCode",{parentName:"h3"},'Duplicate "graphql" modules cannot be used at the same time')),(0,o.kt)("p",null,"Add a ",(0,o.kt)("a",{parentName:"p",href:"https://classic.yarnpkg.com/en/docs/selective-version-resolutions/"},(0,o.kt)("inlineCode",{parentName:"a"},"resolutions"))," entry to your ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json")," file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},'"resolutions": {\n  "graphql": "15.5.2"\n}\n')),(0,o.kt)("h3",{id:"unable-to-find-any-graphql-type-definitions"},(0,o.kt)("inlineCode",{parentName:"h3"},"Unable to find any GraphQL type definitions")),(0,o.kt)("p",null,"Try changing the temporary folder for the plugin by setting ",(0,o.kt)("inlineCode",{parentName:"p"},'tmpDir: "./.docusaurus"')," (see ",(0,o.kt)("a",{parentName:"p",href:"#options"},"options")," section for more details)."),(0,o.kt)("p",null,"You can also disable the schema diff feature by setting ",(0,o.kt)("inlineCode",{parentName:"p"},'diffMethod: "NONE"'),"."),(0,o.kt)("h3",{id:"unable-to-find-any-graphql-type-definitions-for-the-following-pointers"},(0,o.kt)("inlineCode",{parentName:"h3"},"Unable to find any GraphQL type definitions for the following pointers")),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},"This error may occur when upgrading to version ",(0,o.kt)("inlineCode",{parentName:"p"},"1.5.0")," or above.")),(0,o.kt)("p",null,"Install and declare the missing GraphQL document loader package, see ",(0,o.kt)("a",{parentName:"p",href:"#loaders"},"Loaders"),"."),(0,o.kt)("p",null,"If the error persists, check that you have the correct class name in the configuration declaration."),(0,o.kt)("h2",{id:"contributions"},"Contributions"),(0,o.kt)("p",null,"Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!"),(0,o.kt)("a",{href:"https://github.com/edno/graphql-markdown/graphs/contributors"},(0,o.kt)("img",{src:"https://contrib.rocks/image?repo=edno/graphql-markdown"})),(0,o.kt)("p",null,"Made with ",(0,o.kt)("a",{parentName:"p",href:"https://contrib.rocks"},"contributors-img"),"."))}c.isMDXComponent=!0}}]);