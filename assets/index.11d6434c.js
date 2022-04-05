var K=Object.defineProperty;var x=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var E=(e,t,o)=>t in e?K(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,y=(e,t)=>{for(var o in t||(t={}))H.call(t,o)&&E(e,o,t[o]);if(x)for(var o of x(t))V.call(t,o)&&E(e,o,t[o]);return e};import{o as c,c as u,r as U,u as T,w as i,a as l,b as d,K as j,S as I,d as O,e as v,L as F,$ as G,f as k,g as A,h as W,i as $,j as J,k as h,t as B,F as Q,_ as D,M as q,l as X,m as Y,n as Z,p as ee,q as te,s as oe,v as ne,x as se,y as re,z as ae,A as ie,B as P,U as ce,C as le,D as ue,E as _e,G as de,H as pe,I as me,J as he,N as fe,O as ge,P as ve,Q as ye,R as ke,T as $e}from"./vendor.82b53bfb.js";const be=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}};be();var L=(e,t)=>{const o=e.__vccOpts||e;for(const[n,s]of t)o[n]=s;return o};const we={};function Se(e,t){const o=U("router-view");return c(),u(o)}var Ce=L(we,[["render",Se]]);const Le="modulepreload",R={},xe="/picr/",g=function(t,o){return!o||o.length===0?t():Promise.all(o.map(n=>{if(n=`${xe}${n}`,n in R)return;R[n]=!0;const s=n.endsWith(".css"),r=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${r}`))return;const a=document.createElement("link");if(a.rel=s?"stylesheet":Le,s||(a.as="script",a.crossOrigin=""),a.href=n,document.head.appendChild(a),s)return new Promise((_,m)=>{a.addEventListener("load",_),a.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>t())};const Ee=v("Loading ..."),Ie=v("Loading ..."),Oe={setup(e){const t=T();return(o,n)=>{const s=U("router-view"),r=F;return c(),u(r,{class:"layout__container"},{default:i(()=>[l(s,null,{default:i(({Component:a})=>[d(t).meta.keepAlive?(c(),u(j,{key:0},[(c(),u(I,null,{default:i(()=>[(c(),u(O(a),{key:d(t).path}))]),fallback:i(()=>[Ee]),_:2},1024))],1024)):(c(),u(I,{key:1},{default:i(()=>[(c(),u(O(a),{key:d(t).path}))]),fallback:i(()=>[Ie]),_:2},1024))]),_:1})]),_:1})}}};var Pe=L(Oe,[["__scopeId","data-v-7fbb0e0a"]]);const Re=e=>{const{icon:t}=e;return l(G[t])},Ue={setup(e){const t=k(!1),o=T(),n=A(),s=k([]);let r=n.getRoutes();r=r.filter(_=>_.path!=="/"),W(()=>o.path,_=>{s.value=[_]},{immediate:!0});const a=_=>{n.push(_.key)};return(_,m)=>{const w=D,S=q,C=X;return c(),u(C,{theme:"light",collapsed:t.value,"onUpdate:collapsed":m[1]||(m[1]=p=>t.value=p),collapsible:""},{default:i(()=>[l(S,{selectedKeys:s.value,"onUpdate:selectedKeys":m[0]||(m[0]=p=>s.value=p),mode:"inline",theme:"light",onClick:a,"inline-collapsed":t.value},{default:i(()=>[(c(!0),$(Q,null,J(d(r),p=>(c(),u(w,{key:p.path},{icon:i(()=>[l(d(Re),{icon:p.meta.icon},null,8,["icon"])]),default:i(()=>[h("span",null,B(p.meta.title),1)]),_:2},1024))),128))]),_:1},8,["selectedKeys","inline-collapsed"])]),_:1},8,["collapsed"])}}};var Te="/picr/assets/logo.6bb51d52.png";const f=Y.create({timeout:1e3*10,baseURL:"https://api.github.com"});f.interceptors.request.use(e=>{const t=z(),o=localStorage.getItem("GITHUB__TOKEN")||t.config.token;return o&&(e.headers.Authorization=`token ${o}`),e},e=>Promise.error(e));f.interceptors.response.use(e=>e.status>=200&&e.status<300?Promise.resolve(e.data):Promise.reject(e.data),e=>{let t=e.response.data;return Z.error(t.message),Promise.reject(t)});const Ae=async()=>f({url:"/user"}),Be=e=>f({url:`/users/${e.login}/repos`}),De=e=>f({url:`/repos/${e.login}/${e.repo}/branches`}),qe=async e=>f({url:`/repos/${e.login}/${e.repo}/contents/${e.dir}`,params:e.query}),at=async e=>f({url:ee.join(`/repos/${e.login}/${e.repo}/contents/${e.dirs}/${e.filename}`),method:"PUT",data:{branch:e.branch,message:e.message,content:e.content}}),z=te("user",{state:()=>({config:{id:null,token:"",login:"",name:"",avatarUrl:"",selectedDir:"xxx",selectedDirList:[],selectedRepos:"",dirMode:1,selectedBranch:""},repos:[],branches:[],contents:[],setting:{isHash:!1,isMarkdown:!1,isCompress:!1}}),actions:{async getUser(e){localStorage.setItem("GITHUB__TOKEN",e);try{let t=await Ae();this.config.id=t.id,this.config.avatarUrl=t.avatar_url,this.config.login=t.login,this.config.name=t.name,this.config.token=e}catch{}},async logout(){localStorage.clear(),location.reload()},updateConfig(e){this.config=y(y({},this.config),e)},async getRepos(){try{let e=await Be({login:this.config.login});this.repos=e}catch{}},async getBranches(e){try{let t=await De({login:this.config.login,repo:e});this.branches=t}catch{}},async getBranchCatalogue(e){try{let t=await qe(y({login:this.config.login},e));return this.contents=t,t}catch{}}},getters:{dirsContents:e=>e.contents.filter(t=>t.type==="dir"),imageContents:e=>e.contents.filter(t=>t.type==="file"&&oe.getType(t.name).startsWith("image")).map(t=>(t.isMarkdown=e.setting.isMarkdown,t))},persist:{key:"PICR_CONFIG",paths:["config","setting"],storage:localStorage}}),ze=v(" \u7D2F\u8BA1\u8BBF\u95EE\u6570: "),Me=h("span",{id:"busuanzi_value_site_uv",class:"uv"},null,-1),Ne=v(" \u6D4F\u89C8\u6B21\u6570: "),Ke=h("span",{id:"busuanzi_value_site_pv",class:"pv"},null,-1),He=[ze,Me,Ne,Ke],Ve={setup(e){const t=k(null),o=k(!1);return ne(()=>{const n=document.createElement("script");n.async=!0,n.src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",t.value.appendChild(n),n.onload=function(){se(()=>{o.value=!0})}}),(n,s)=>re((c(),$("div",{class:"site-count",ref_key:"siteCountDom",ref:t},He,512)),[[ae,o.value]])}};const M=e=>(le("data-v-4dcb15f1"),e=e(),ue(),e),je={class:"header__left"},Fe=M(()=>h("img",{src:Te,class:"logo",alt:""},null,-1)),Ge=[Fe],We=M(()=>h("h2",{class:"logo__txt"},"PicR",-1)),Je={class:"login__box"},Qe={key:0,class:"no__login--text"},Xe={key:1,class:"userinfo"},Ye=v("\u9000\u51FA\u767B\u5F55"),Ze={setup(e){const t=z(),o=A(),{config:n}=ie(t),s=()=>{t.logout()};return(r,a)=>{const _=_e,m=de,w=D,S=q,C=pe,p=me;return c(),u(p,{class:"header"},{default:i(()=>[h("div",je,[h("h1",{onClick:a[0]||(a[0]=P(nt=>d(o).push("/"),["stop"]))},Ge),We,l(Ve)]),h("div",Je,[d(n).id?(c(),$("span",Xe,B(d(n).login),1)):(c(),$("span",Qe,"\u672A\u767B\u5F55")),d(n).id?(c(),u(C,{key:3},{overlay:i(()=>[l(S,null,{default:i(()=>[l(w,null,{default:i(()=>[l(m,{onClick:P(s,["stop"]),type:"link"},{default:i(()=>[Ye]),_:1},8,["onClick"])]),_:1})]),_:1})]),default:i(()=>[l(_,{src:d(n).avatarUrl,size:48},null,8,["src"])]),_:1})):(c(),u(_,{key:2,size:48},{icon:i(()=>[l(d(ce))]),_:1}))])]),_:1})}}};var et=L(Ze,[["__scopeId","data-v-4dcb15f1"]]);const tt={setup(e){return(t,o)=>{const n=he;return c(),u(n,{style:{"min-height":"100vh"}},{default:i(()=>[l(et),l(n,null,{default:i(()=>[l(Ue),l(Pe)]),_:1})]),_:1})}}},ot=fe({history:ge(),routes:[{path:"/",component:tt,redirect:"/upload",children:[{path:"/setting",name:"setting",component:()=>g(()=>import("./setting.632bfe55.js"),["assets/setting.632bfe55.js","assets/setting.e340eaeb.css","assets/index.ff7b7785.css","assets/index.cd256673.css","assets/index.1a044952.css","assets/vendor.82b53bfb.js","assets/vendor.6ca50818.css","assets/index.59e8deea.js","assets/index.1ce24a9e.css"]),meta:{title:"\u56FE\u5E8A\u914D\u7F6E",icon:"SettingOutlined"}},{path:"/upload",name:"upload",component:()=>g(()=>import("./upload.899186f7.js"),["assets/upload.899186f7.js","assets/upload.a2d3fd5d.css","assets/index.ff7b7785.css","assets/index.cd256673.css","assets/index.1a044952.css","assets/vendor.82b53bfb.js","assets/vendor.6ca50818.css","assets/useCopExternalLinks.6e895f43.js","assets/useCopExternalLinks.f4468f31.css","assets/index.59e8deea.js","assets/index.1ce24a9e.css"]),meta:{title:"\u56FE\u7247\u4E0A\u4F20",icon:"EditOutlined"}},{path:"/imglist",name:"imglist",component:()=>g(()=>import("./imglist.fd0cb80e.js"),["assets/imglist.fd0cb80e.js","assets/imglist.0fa68555.css","assets/index.ff7b7785.css","assets/index.cd256673.css","assets/vendor.82b53bfb.js","assets/vendor.6ca50818.css","assets/useCopExternalLinks.6e895f43.js","assets/useCopExternalLinks.f4468f31.css","assets/index.59e8deea.js","assets/index.1ce24a9e.css"]),meta:{title:"\u56FE\u5E8A\u7BA1\u7406",icon:"SettingOutlined"}},{path:"/config",name:"config",component:()=>g(()=>import("./config.4a5aed7c.js"),["assets/config.4a5aed7c.js","assets/config.4898170b.css","assets/index.ff7b7785.css","assets/vendor.82b53bfb.js","assets/vendor.6ca50818.css"]),meta:{title:"\u6211\u7684\u914D\u7F6E",icon:"SettingOutlined"}},{path:"/course",name:"course",component:()=>g(()=>import("./course.62136b75.js"),["assets/course.62136b75.js","assets/course.a0147496.css","assets/index.ff7b7785.css","assets/index.cd256673.css","assets/index.1a044952.css","assets/vendor.82b53bfb.js","assets/vendor.6ca50818.css"]),meta:{title:"\u4F7F\u7528\u6559\u7A0B",icon:"PushpinFilled"}}]}]});const N=ve();N.use(ye);const b=ke(Ce);b.use(ot);b.use(N);b.use($e);b.mount("#app");export{L as _,at as r,z as u};
