var H=Object.defineProperty;var I=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var L=(e,t,o)=>t in e?H(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,g=(e,t)=>{for(var o in t||(t={}))M.call(t,o)&&L(e,o,t[o]);if(I)for(var o of I(t))V.call(t,o)&&L(e,o,t[o]);return e};import{o as i,c as d,r as U,u as B,w as c,a as l,K as j,b as u,d as E,e as O,L as F,$ as G,f as v,g as A,h as W,i as y,j as J,k as h,t as T,F as Q,_ as D,M as q,l as X,m as Y,n as Z,p as ee,q as te,s as oe,v as se,x as ne,y as re,z as ae,A as C,B as ce,C as P,U as ie,D as le,E as ue,G as _e,H as de,I as pe,J as me,N as he,O as fe,P as ge,Q as ve,R as ye,S as ke,T as $e}from"./vendor.0d0a97a2.js";const be=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}};be();var x=(e,t)=>{const o=e.__vccOpts||e;for(const[s,n]of t)o[s]=n;return o};const Se={};function we(e,t){const o=U("router-view");return i(),d(o)}var Ce=x(Se,[["render",we]]);const xe="modulepreload",R={},Ie="/picr/",w=function(t,o){return!o||o.length===0?t():Promise.all(o.map(s=>{if(s=`${Ie}${s}`,s in R)return;R[s]=!0;const n=s.endsWith(".css"),r=n?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${r}`))return;const a=document.createElement("link");if(a.rel=n?"stylesheet":xe,n||(a.as="script",a.crossOrigin=""),a.href=s,document.head.appendChild(a),n)return new Promise((_,m)=>{a.addEventListener("load",_),a.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>t())};const Le={setup(e){const t=B();return(o,s)=>{const n=U("router-view"),r=F;return i(),d(r,{class:"layout__container"},{default:c(()=>[l(n,null,{default:c(({Component:a})=>[(i(),d(j,null,[u(t).meta.keepAlive?(i(),d(E(a),{key:u(t).name})):O("",!0)],1024)),u(t).meta.keepAlive?O("",!0):(i(),d(E(a),{key:u(t).name}))]),_:1})]),_:1})}}};var Ee=x(Le,[["__scopeId","data-v-1b36b60c"]]);const Oe=e=>{const{icon:t}=e;return l(G[t])},Pe={setup(e){const t=v(!1),o=B(),s=A(),n=v([]);let r=s.getRoutes();r=r.filter(_=>_.path!=="/"),W(()=>o.path,_=>{n.value=[_]},{immediate:!0});const a=_=>{s.push(_.key)};return(_,m)=>{const $=D,b=q,S=X;return i(),d(S,{theme:"light",collapsed:t.value,"onUpdate:collapsed":m[1]||(m[1]=p=>t.value=p),collapsible:""},{default:c(()=>[l(b,{selectedKeys:n.value,"onUpdate:selectedKeys":m[0]||(m[0]=p=>n.value=p),mode:"inline",theme:"light",onClick:a,"inline-collapsed":t.value},{default:c(()=>[(i(!0),y(Q,null,J(u(r),p=>(i(),d($,{key:p.path},{icon:c(()=>[l(u(Oe),{icon:p.meta.icon},null,8,["icon"])]),default:c(()=>[h("span",null,T(p.meta.title),1)]),_:2},1024))),128))]),_:1},8,["selectedKeys","inline-collapsed"])]),_:1},8,["collapsed"])}}};var Re="/picr/assets/logo.6bb51d52.png";const f=Y.create({timeout:1e3*10,baseURL:"https://api.github.com"});f.interceptors.request.use(e=>{const t=N(),o=localStorage.getItem("GITHUB__TOKEN")||t.config.token;return o&&(e.headers.Authorization=`token ${o}`),e},e=>Promise.error(e));f.interceptors.response.use(e=>e.status>=200&&e.status<300?Promise.resolve(e.data):Promise.reject(e.data),e=>{let t=e.response.data;return Z.error(t.message),Promise.reject(t)});const Ue=async()=>f({url:"/user"}),Be=e=>f({url:`/users/${e.login}/repos`}),Ae=e=>f({url:`/repos/${e.login}/${e.repo}/branches`}),Te=async e=>f({url:`/repos/${e.login}/${e.repo}/contents/${e.dir}`,params:e.query}),nt=async e=>f({url:ee.join(`/repos/${e.login}/${e.repo}/contents/${e.dirs}/${e.filename}`),method:"PUT",data:{branch:e.branch,message:e.message,content:e.content}}),N=te("user",{state:()=>({config:{id:null,token:"",login:"",name:"",avatarUrl:"",selectedDir:"xxx",selectedDirList:[],selectedRepos:"",dirMode:1,selectedBranch:""},repos:[],branches:[],contents:[]}),actions:{async getUser(e){localStorage.setItem("GITHUB__TOKEN",e);try{let t=await Ue();this.config.id=t.id,this.config.avatarUrl=t.avatar_url,this.config.login=t.login,this.config.name=t.name,this.config.token=e}catch{}},async logout(){localStorage.clear(),location.reload()},updateConfig(e){this.config=g(g({},this.config),e)},async getRepos(){try{let e=await Be({login:this.config.login});this.repos=e}catch{}},async getBranches(e){try{let t=await Ae({login:this.config.login,repo:e});this.branches=t}catch{}},async getBranchCatalogue(e){try{let t=await Te(g({login:this.config.login},e));return console.log(t),this.contents=t,t}catch{}}},getters:{imageContents:e=>e.contents.filter(t=>t.type==="dir"||oe.getType(t.name).startsWith("image"))},persist:{key:"PICR_CONFIG",paths:["config"],storage:localStorage}}),De=C(" \u7D2F\u8BA1\u8BBF\u95EE\u6570: "),qe=h("span",{id:"busuanzi_value_site_uv",class:"uv"},null,-1),Ne=C(" \u6D4F\u89C8\u6B21\u6570: "),ze=h("span",{id:"busuanzi_value_site_pv",class:"pv"},null,-1),Ke=[De,qe,Ne,ze],He={setup(e){const t=v(null),o=v(!1);return se(()=>{const s=document.createElement("script");s.async=!0,s.src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",t.value.appendChild(s),s.onload=function(){ne(()=>{o.value=!0})}}),(s,n)=>re((i(),y("div",{class:"site-count",ref_key:"siteCountDom",ref:t},Ke,512)),[[ae,o.value]])}};const z=e=>(le("data-v-4dcb15f1"),e=e(),ue(),e),Me={class:"header__left"},Ve=z(()=>h("img",{src:Re,class:"logo",alt:""},null,-1)),je=[Ve],Fe=z(()=>h("h2",{class:"logo__txt"},"PicR",-1)),Ge={class:"login__box"},We={key:0,class:"no__login--text"},Je={key:1,class:"userinfo"},Qe=C("\u9000\u51FA\u767B\u5F55"),Xe={setup(e){const t=N(),o=A(),{config:s}=ce(t),n=()=>{t.logout()};return(r,a)=>{const _=_e,m=de,$=D,b=q,S=pe,p=me;return i(),d(p,{class:"header"},{default:c(()=>[h("div",Me,[h("h1",{onClick:a[0]||(a[0]=P(tt=>u(o).push("/"),["stop"]))},je),Fe,l(He)]),h("div",Ge,[u(s).id?(i(),y("span",Je,T(u(s).login),1)):(i(),y("span",We,"\u672A\u767B\u5F55")),u(s).id?(i(),d(S,{key:3},{overlay:c(()=>[l(b,null,{default:c(()=>[l($,null,{default:c(()=>[l(m,{onClick:P(n,["stop"]),type:"link"},{default:c(()=>[Qe]),_:1},8,["onClick"])]),_:1})]),_:1})]),default:c(()=>[l(_,{src:u(s).avatarUrl,size:48},null,8,["src"])]),_:1})):(i(),d(_,{key:2,size:48},{icon:c(()=>[l(u(ie))]),_:1}))])]),_:1})}}};var Ye=x(Xe,[["__scopeId","data-v-4dcb15f1"]]);const Ze={setup(e){return(t,o)=>{const s=he;return i(),d(s,{style:{"min-height":"100vh"}},{default:c(()=>[l(Ye),l(s,null,{default:c(()=>[l(Pe),l(Ee)]),_:1})]),_:1})}}},et=fe({history:ge(),routes:[{path:"/",component:Ze,redirect:"/upload",children:[{path:"/setting",component:()=>w(()=>import("./setting.2625d7e8.js"),["assets/setting.2625d7e8.js","assets/setting.e340eaeb.css","assets/index.afe83952.css","assets/vendor.0d0a97a2.js","assets/vendor.6ca50818.css","assets/index.0a75b8cd.js","assets/index.38eca311.css"]),meta:{title:"\u56FE\u5E8A\u914D\u7F6E",icon:"SettingOutlined"}},{path:"/upload",component:()=>w(()=>import("./upload.cd9e8fef.js"),["assets/upload.cd9e8fef.js","assets/upload.f344ff3e.css","assets/index.afe83952.css","assets/index.6b56b5e8.css","assets/vendor.0d0a97a2.js","assets/vendor.6ca50818.css","assets/index.0a75b8cd.js","assets/index.38eca311.css"]),meta:{title:"\u56FE\u7247\u4E0A\u4F20",icon:"EditOutlined"}},{path:"/bedmanager",component:()=>w(()=>import("./bedmanager.f9e741a9.js"),["assets/bedmanager.f9e741a9.js","assets/bedmanager.33130e08.css","assets/index.6b56b5e8.css","assets/index.afe83952.css","assets/vendor.0d0a97a2.js","assets/vendor.6ca50818.css"]),meta:{title:"\u56FE\u5E8A\u7BA1\u7406",icon:"SettingOutlined"}}]}]});const K=ve();K.use(ye);const k=ke(Ce);k.use(et);k.use(K);k.use($e);k.mount("#app");export{x as _,nt as r,N as u};
