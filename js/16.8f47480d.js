"use strict";(self["webpackChunkthree_project"]=self["webpackChunkthree_project"]||[]).push([[16],{47016:function(e,t,n){n.r(t),n.d(t,{default:function(){return v}});var i=function(){var e=this,t=e._self._c;return t("div",{ref:"keyframes",staticClass:"keyframes",attrs:{id:"container"}})},s=[],o=n(2212),a=function(){var e=0,t=document.createElement("div");function n(e){return t.appendChild(e.dom),e}function i(n){for(var i=0;i<t.children.length;i++)t.children[i].style.display=i===n?"block":"none";e=n}t.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",t.addEventListener("click",(function(n){n.preventDefault(),i(++e%t.children.length)}),!1);var s=(performance||Date).now(),o=s,l=0,c=n(new a.Panel("FPS","#0ff","#002")),d=n(new a.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var r=n(new a.Panel("MB","#f08","#201"));return i(0),{REVISION:16,dom:t,addPanel:n,showPanel:i,begin:function(){s=(performance||Date).now()},end:function(){l++;var e=(performance||Date).now();if(d.update(e-s,200),e>=o+1e3&&(c.update(1e3*l/(e-o),100),o=e,l=0,r)){var t=performance.memory;r.update(t.usedJSHeapSize/1048576,t.jsHeapSizeLimit/1048576)}return e},update:function(){s=this.end()},domElement:t,setMode:i}};a.Panel=function(e,t,n){var i=1/0,s=0,o=Math.round,a=o(window.devicePixelRatio||1),l=80*a,c=48*a,d=3*a,r=2*a,p=3*a,f=15*a,u=74*a,h=30*a,m=document.createElement("canvas");m.width=l,m.height=c,m.style.cssText="width:80px;height:48px";var w=m.getContext("2d");return w.font="bold "+9*a+"px Helvetica,Arial,sans-serif",w.textBaseline="top",w.fillStyle=n,w.fillRect(0,0,l,c),w.fillStyle=t,w.fillText(e,d,r),w.fillRect(p,f,u,h),w.fillStyle=n,w.globalAlpha=.9,w.fillRect(p,f,u,h),{dom:m,update:function(c,x){i=Math.min(i,c),s=Math.max(s,c),w.fillStyle=n,w.globalAlpha=1,w.fillRect(0,0,l,f),w.fillStyle=t,w.fillText(o(c)+" "+e+" ("+o(i)+"-"+o(s)+")",d,r),w.drawImage(m,p+a,f,u-a,h,p,f,u-a,h),w.fillRect(p+u-a,f,a,h),w.fillStyle=n,w.globalAlpha=.9,w.fillRect(p+u-a,f,a,o((1-c/x)*h))}}};var l=a,c=n(69365);class d extends o.xsS{constructor(){super();const e=new o.DvJ;e.deleteAttribute("uv");const t=new o.Wid({side:o._Li}),n=new o.Wid,i=new o.cek(16777215,5,28,2);i.position.set(.418,16.199,.3),this.add(i);const s=new o.Kj0(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const a=new o.Kj0(e,n);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);const l=new o.Kj0(e,n);l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),this.add(l);const c=new o.Kj0(e,n);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const d=new o.Kj0(e,n);d.position.set(-2.017,.018,6.124),d.rotation.set(0,.333,0),d.scale.set(2.002,4.566,2.064),this.add(d);const p=new o.Kj0(e,n);p.position.set(2.291,-.756,-2.621),p.rotation.set(0,-.286,0),p.scale.set(1.546,1.552,1.496),this.add(p);const f=new o.Kj0(e,n);f.position.set(-2.193,-.369,-5.547),f.rotation.set(0,.516,0),f.scale.set(3.875,3.487,2.986),this.add(f);const u=new o.Kj0(e,r(50));u.position.set(-16.116,14.37,8.208),u.scale.set(.1,2.428,2.739),this.add(u);const h=new o.Kj0(e,r(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const m=new o.Kj0(e,r(17));m.position.set(14.904,12.198,-1.832),m.scale.set(.15,4.265,6.331),this.add(m);const w=new o.Kj0(e,r(43));w.position.set(-.462,8.89,14.52),w.scale.set(4.38,5.441,.088),this.add(w);const x=new o.Kj0(e,r(20));x.position.set(3.235,11.486,-12.541),x.scale.set(2.5,2,.1),this.add(x);const v=new o.Kj0(e,r(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}}function r(e){const t=new o.vBJ;return t.color.setScalar(e),t}var p=n(1217),f=n(82854),u=n(13171),h={name:"index",components:{},data(){return{}},mounted(){this.$nextTick((()=>{this.init()}))},methods:{init(){let e;const t=new o.SUY,n=document.getElementById("container"),i=n,s=new l;s.domElement.style.position="absolute",s.domElement.style.left="5px",s.domElement.style.top="5px",n.appendChild(s.dom);const a=new o.CP7({antialias:!0});a.setPixelRatio(window.devicePixelRatio),a.setSize(i.clientWidth,i.clientHeight),n.appendChild(a.domElement);const r=new o.anP(a),h=new o.xsS;h.background=new o.Ilk(12575709),h.environment=r.fromScene(new d(a),.04).texture;const m=new o.Mig(16777215);h.add(m);const w=new o.cPb(40,i.clientWidth/i.clientHeight,1,100);w.position.set(5,2,8);const x=new c.z(w,a.domElement);x.target.set(0,.5,0),x.update(),x.enablePan=!1,x.enableDamping=!0;const v=new f._,g=(0,u.x)("/static/draco/gltf/","three_project");v.setDecoderPath(g);const y=new p.E;y.setDRACOLoader(v);const j=(0,u.x)("/static/models/gltf/LittlestTokyo.glb","three_project");function S(){requestAnimationFrame(S);const n=t.getDelta();e.update(n),x.update(),s.update(),a.render(h,w)}y.load(j,(function(t){const n=t.scene;n.position.set(1,1,1),n.scale.set(.01,.01,.01),h.add(n),e=new o.Xcj(n),e.clipAction(t.animations[0]).play(),S()}),void 0,(function(e){console.error(e)})),window.onresize=function(){w.aspect=i.clientWidth/i.clientHeight,w.updateProjectionMatrix(),a.setSize(i.clientWidth,i.clientHeight)}}}},m=h,w=n(1001),x=(0,w.Z)(m,i,s,!1,null,"1d56130c",null),v=x.exports}}]);
//# sourceMappingURL=16.8f47480d.js.map