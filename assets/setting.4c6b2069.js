import{A as Z,f as p,g as z,h as x,v as H,o as c,c as f,w as a,V as J,a as t,B,b as h,i as M,F as L,j as U,e as u,t as _,W as Y,X as K,Y as P,G as Q,Z as ee,a0 as ae,a1 as te,a2 as le,a3 as oe,a4 as ne,a5 as se,a6 as ue,a7 as re}from"./vendor.472db396.js";/* empty css              */import{u as ie,a as de,b as ce}from"./index.16ef71e1.js";/* empty css              *//* empty css               */import{_ as _e,u as ve}from"./index.99bdc990.js";const pe=u("\u786E\u8BA4Token"),fe={key:0},me=u("\u624B\u52A8\u521B\u5EFA\u4E00\u4E2A\u76EE\u5F55"),ge=u("\u5B58\u653E\u5728\u6839\u76EE\u5F55"),he=u("\u6839\u636E\u65E5\u671F\u81EA\u52A8\u521B\u5EFAYYYYMMDD\u683C\u5F0F"),ye=u("\u91CD\u7F6E"),De=u("\u5B8C\u6210\u914D\u7F6E"),ke={setup(Be){const d=ve(),{config:s,repos:q,branches:F}=Z(d),R=p([]),y=p(!1),D=p(null),T=z(),$=p({selectedRepo:[{required:!0,message:"\u8BF7\u9009\u62E9\u6587\u4EF6\u4E0A\u4F20\u7684\u4ED3\u5E93",trigger:"blur"}],selectedBranch:[{required:!0,message:"\u8BF7\u9009\u62E9\u4ED3\u5E93\u7684\u5206\u652F",trigger:"blur"}],selectedDir:[{required:!0,message:"\u8BF7\u8F93\u5165\u4E0A\u4F20\u6587\u4EF6\u7684\u76EE\u5F55",trigger:"blur",type:"string"}],selectedDirList:[{required:!0,message:"\u8BF7\u9009\u62E9\u4E0A\u4F20\u6587\u4EF6\u7684\u76EE\u5F55",trigger:"blur",type:"array"}]}),e=p({token:s.value.token,login:s.value.login,dirMode:s.value.dirMode,selectedDir:s.value.selectedDir,selectedRepo:s.value.selectedRepo,selectedBranch:s.value.selectedBranch,selectedDirList:s.value.selectedDirList}),v=p({1:"\u65B0\u5EFA\u76EE\u5F55",2:"\u6839\u76EE\u5F55",3:"\u81EA\u52A8\u76EE\u5F55",4:`\u9009\u62E9${s.value.selectedRepo}\u4ED3\u5E93\u76EE\u5F55`}),N=ie(async()=>{y.value=!0,await d.getUser(e.value.token),e.value.token=s.value.token,e.value.login=s.value.login,await d.getRepos(),y.value=!1},1e3,!1),S=async()=>{try{await D.value.validate(),d.updateConfig({dirMode:e.value.dirMode,selectedDir:e.value.selectedDir,selectedRepo:e.value.selectedRepo,selectedBranch:e.value.selectedBranch,selectedDirList:e.value.selectedDirList}),T.push({path:"/upload"})}catch(n){console.log(n)}},V=()=>{D.value.resetFields(),d.logout()},j=()=>{e.value.dirMode===2?e.value.selectedDir="/":e.value.dirMode===3?e.value.selectedDir=de(ce(),"YYYYMMDD").value:e.value.dirMode===1?e.value.selectedDir="xxx":e.value.dirMode===4&&(e.value.selectedDirList=[])},I=async n=>{const l=n[n.length-1];l.loading=!0;let i=await d.getBranchCatalogue({repo:e.value.selectedRepo,dir:e.value.selectedDirList.join("/"),query:{ref:e.value.selectedBranch}});l.loading=!1;let r=C(i);if(r.length===0){l.isLeaf=!0;return}l.children=r},C=n=>n.filter(l=>l.type==="dir").map(l=>{let i={};return i.label=l.name,i.value=l.name,i.isLeaf=!1,i});return x(()=>e.value.selectedBranch,async n=>{if(e.value.selectedDirList=[],n.trim()){let l=await d.getBranchCatalogue({repo:e.value.selectedRepo,dir:"",query:{ref:n}});R.value=C(l)}},{immediate:!0}),x(()=>e.value.selectedRepo,async n=>{n.trim()&&(s.value.selectedRepo!==n&&(e.value.selectedBranch=""),await d.getBranches(n))},{immediate:!0}),H(async()=>{s.value.id&&await d.getRepos()}),(n,l)=>{const i=K,r=P,k=Q,b=re,w=ee,m=ae,g=te,A=le,E=oe,G=ne,O=se,W=ue,X=J;return c(),f(X,{class:"container"},{default:a(()=>[t(W,{ref_key:"formRef",ref:D,model:e.value,"label-col":{span:5},"wrapper-col":{span:16},rules:$.value,autocomplete:"off"},{default:a(()=>[t(r,{label:"Token",name:"token"},{default:a(()=>[t(i,{value:e.value.token,"onUpdate:value":l[0]||(l[0]=o=>e.value.token=o)},null,8,["value"])]),_:1}),t(r,{"wrapper-col":{offset:5,span:16}},{default:a(()=>[t(k,{onClick:B(h(N),["stop"]),type:"primary"},{default:a(()=>[pe]),_:1},8,["onClick"])]),_:1}),t(O,{style:{width:"100%",", min-height":"'100px'"},spinning:y.value,tip:"Loading..."},{default:a(()=>[h(s).id?(c(),M("div",fe,[t(r,{label:"\u7528\u6237\u540D",name:"login"},{default:a(()=>[t(i,{readonly:"",value:e.value.login,"onUpdate:value":l[1]||(l[1]=o=>e.value.login=o)},null,8,["value"])]),_:1}),t(r,{name:"selectedRepo",label:"\u9009\u62E9\u56FE\u5E8A\u4ED3\u5E93"},{default:a(()=>[t(w,{"show-search":"",value:e.value.selectedRepo,"onUpdate:value":l[2]||(l[2]=o=>e.value.selectedRepo=o)},{default:a(()=>[(c(!0),M(L,null,U(h(q),o=>(c(),f(b,{key:o.id,value:o.name},{default:a(()=>[u(_(o.name),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])]),_:1}),t(r,{name:"selectedBranch",label:"\u9009\u62E9\u4ED3\u5E93\u5206\u652F"},{default:a(()=>[t(w,{"show-search":"",value:e.value.selectedBranch,"onUpdate:value":l[3]||(l[3]=o=>e.value.selectedBranch=o)},{default:a(()=>[(c(!0),M(L,null,U(h(F),o=>(c(),f(b,{key:o.name,value:o.name},{default:a(()=>[u(_(o.name),1)]),_:2},1032,["value"]))),128))]),_:1},8,["value"])]),_:1}),e.value.selectedBranch?(c(),f(r,{key:0,name:"dirMode",label:"\u76EE\u5F55\u65B9\u5F0F"},{default:a(()=>[t(A,{onChange:j,value:e.value.dirMode,"onUpdate:value":l[4]||(l[4]=o=>e.value.dirMode=o)},{default:a(()=>[t(g,null,{title:a(()=>[me]),default:a(()=>[t(m,{value:1},{default:a(()=>[u(_(v.value[1]),1)]),_:1})]),_:1}),t(g,null,{title:a(()=>[ge]),default:a(()=>[t(m,{value:2},{default:a(()=>[u(_(v.value[2]),1)]),_:1})]),_:1}),t(g,null,{title:a(()=>[he]),default:a(()=>[t(m,{value:3},{default:a(()=>[u(_(v.value[3]),1)]),_:1})]),_:1}),t(g,null,{title:a(()=>[u("\u9009\u62E9"+_(e.value.selectedBranch)+"\u5206\u652F\u4E0B\u7684\u4E00\u4E2A\u76EE\u5F55",1)]),default:a(()=>[t(m,{value:4},{default:a(()=>[u(_(v.value[4]),1)]),_:1})]),_:1})]),_:1},8,["value"])]),_:1})):Y("",!0),e.value.selectedBranch&&e.value.dirMode!==4?(c(),f(r,{key:1,name:"selectedDir",label:v.value[e.value.dirMode]},{default:a(()=>[t(i,{readonly:e.value.dirMode!==1,value:e.value.selectedDir,"onUpdate:value":l[5]||(l[5]=o=>e.value.selectedDir=o)},null,8,["readonly","value"])]),_:1},8,["label"])):(c(),f(r,{key:2,name:"selectedDirList",label:v.value[e.value.dirMode]},{default:a(()=>[t(E,{"change-on-select":"",options:R.value,"load-data":I,value:e.value.selectedDirList,"onUpdate:value":l[6]||(l[6]=o=>e.value.selectedDirList=o),placeholder:"\u8BF7\u9009\u62E9\u76EE\u5F55"},null,8,["options","value"])]),_:1},8,["label"])),t(r,{"wrapper-col":{offset:5,span:16}},{default:a(()=>[t(G,null,{default:a(()=>[t(k,{onClick:B(V,["stop"])},{default:a(()=>[ye]),_:1},8,["onClick"]),t(k,{onClick:B(S,["stop"]),type:"primary"},{default:a(()=>[De]),_:1},8,["onClick"])]),_:1})]),_:1})])):Y("",!0)]),_:1},8,["spinning"])]),_:1},8,["model","rules"])]),_:1})}}};var Le=_e(ke,[["__scopeId","data-v-4f8bc920"]]);export{Le as default};
