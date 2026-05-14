import{m as o,u as w,p as k,d as x,r as m,a as e,j as a,L as _}from"./index-73eb6fbb.js";import{u as z}from"./useMutation-9dea17c2.js";/* empty css             *//**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],L=o("eye-off",C);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],S=o("eye",M);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],P=o("lock",E);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],q=o("mail",j);function A(){var n,d;const h=w(),u=k(),{login:p}=x(),[c,N]=m.useState({email:"",password:""}),[t,y]=m.useState(!1),r=((d=(n=u.state)==null?void 0:n.from)==null?void 0:d.pathname)||"/",i=z({mutationFn:s=>p(s),onSuccess:()=>{h(r,{replace:!0})}}),l=s=>{const{name:f,value:v}=s.target;N(g=>({...g,[f]:v}))},b=s=>{s.preventDefault(),i.mutate({...c})};return e("div",{className:"auth-page",children:e("div",{className:"auth-backdrop",children:e("div",{className:"auth-container",children:a("div",{className:"auth-card glass",children:[a("div",{className:"auth-header",children:[e("h1",{className:"auth-title display",children:"Вход"}),e("p",{className:"auth-subtitle body",children:"Добро пожаловать обратно в CineVerse"})]}),i.isError&&a("div",{className:"auth-error",children:[e("span",{className:"error-icon",children:"⚠️"}),"Не удалось войти. Проверьте email и пароль."]}),a("form",{onSubmit:b,className:"auth-form",children:[a("div",{className:"form-group",children:[e("label",{className:"form-label label",children:"Email"}),a("div",{className:"input-wrapper",children:[e(q,{size:18,className:"input-icon"}),e("input",{className:"auth-input",type:"email",name:"email",placeholder:"your@email.com",value:c.email,onChange:l,autoComplete:"email",required:!0})]})]}),a("div",{className:"form-group",children:[e("label",{className:"form-label label",children:"Пароль"}),a("div",{className:"input-wrapper",children:[e(P,{size:18,className:"input-icon"}),e("input",{className:"auth-input",type:t?"text":"password",name:"password",placeholder:"••••••••",value:c.password,onChange:l,autoComplete:"current-password",required:!0}),e("button",{type:"button",className:"password-toggle",onClick:()=>y(!t),"aria-label":t?"Скрыть пароль":"Показать пароль",children:t?e(L,{size:18}):e(S,{size:18})})]})]}),e("button",{className:"auth-button btn btn-primary",type:"submit",disabled:i.isPending,children:i.isPending?"Входим...":"Войти"})]}),e("div",{className:"auth-footer",children:a("p",{className:"auth-switch body",children:["Нет аккаунта?"," ",e(_,{to:"/register",state:{from:r},className:"auth-link",children:"Зарегистрироваться"})]})})]})})})})}export{A as default};
