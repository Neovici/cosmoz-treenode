/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y=globalThis,M=y.trustedTypes,B=M?M.createPolicy("lit-html",{createHTML:h=>h}):void 0,W="$lit$",p=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+p,D=`<${k}>`,f=document,x=()=>f.createComment(""),H=h=>h===null||typeof h!="object"&&typeof h!="function",I=Array.isArray,z=h=>I(h)||typeof(h==null?void 0:h[Symbol.iterator])=="function",w=`[ 	
\f\r]`,m=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,U=/>/g,u=RegExp(`>|${w}(?:([^\\s"'>=/]+)(${w}*=${w}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,R=/"/g,V=/^(?:script|style|textarea|title)$/i,Z=h=>(t,...e)=>({_$litType$:h,strings:t,values:e}),X=Z(1),N=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),L=new WeakMap,g=f.createTreeWalker(f,129);function j(h,t){if(!I(h)||!h.hasOwnProperty("raw"))throw Error("invalid template strings array");return B!==void 0?B.createHTML(t):t}const F=(h,t)=>{const e=h.length-1,s=[];let i,o=t===2?"<svg>":t===3?"<math>":"",n=m;for(let a=0;a<e;a++){const r=h[a];let $,_,l=-1,c=0;for(;c<r.length&&(n.lastIndex=c,_=n.exec(r),_!==null);)c=n.lastIndex,n===m?_[1]==="!--"?n=P:_[1]!==void 0?n=U:_[2]!==void 0?(V.test(_[2])&&(i=RegExp("</"+_[2],"g")),n=u):_[3]!==void 0&&(n=u):n===u?_[0]===">"?(n=i??m,l=-1):_[1]===void 0?l=-2:(l=n.lastIndex-_[2].length,$=_[1],n=_[3]===void 0?u:_[3]==='"'?R:O):n===R||n===O?n=u:n===P||n===U?n=m:(n=u,i=void 0);const d=n===u&&h[a+1].startsWith("/>")?" ":"";o+=n===m?r+D:l>=0?(s.push($),r.slice(0,l)+W+r.slice(l)+p+d):r+p+(l===-2?a:d)}return[j(h,o+(h[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class T{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[$,_]=F(t,e);if(this.el=T.createElement($,s),g.currentNode=this.el.content,e===2||e===3){const l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=g.nextNode())!==null&&r.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const l of i.getAttributeNames())if(l.endsWith(W)){const c=_[n++],d=i.getAttribute(l).split(p),C=/([.?@])?(.*)/.exec(c);r.push({type:1,index:o,name:C[2],strings:d,ctor:C[1]==="."?G:C[1]==="?"?J:C[1]==="@"?K:S}),i.removeAttribute(l)}else l.startsWith(p)&&(r.push({type:6,index:o}),i.removeAttribute(l));if(V.test(i.tagName)){const l=i.textContent.split(p),c=l.length-1;if(c>0){i.textContent=M?M.emptyScript:"";for(let d=0;d<c;d++)i.append(l[d],x()),g.nextNode(),r.push({type:2,index:++o});i.append(l[c],x())}}}else if(i.nodeType===8)if(i.data===k)r.push({type:2,index:o});else{let l=-1;for(;(l=i.data.indexOf(p,l+1))!==-1;)r.push({type:7,index:o}),l+=p.length-1}o++}}static createElement(t,e){const s=f.createElement("template");return s.innerHTML=t,s}}function v(h,t,e=h,s){var n,a;if(t===N)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=H(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==o&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),o===void 0?i=void 0:(i=new o(h),i._$AT(h,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=v(h,i._$AS(h,t.values),i,s)),t}class q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??f).importNode(e,!0);g.currentNode=i;let o=g.nextNode(),n=0,a=0,r=s[0];for(;r!==void 0;){if(n===r.index){let $;r.type===2?$=new b(o,o.nextSibling,this,t):r.type===1?$=new r.ctor(o,r.name,r.strings,this,t):r.type===6&&($=new Q(o,this,t)),this._$AV.push($),r=s[++a]}n!==(r==null?void 0:r.index)&&(o=g.nextNode(),n++)}return g.currentNode=f,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class b{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=v(this,t,e),H(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==N&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):z(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(f.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=T.createElement(j(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===i)this._$AH.p(e);else{const n=new q(i,this),a=n.u(this.options);n.p(e),this.T(a),this._$AH=n}}_$AC(t){let e=L.get(t.strings);return e===void 0&&L.set(t.strings,e=new T(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new b(this.O(x()),this.O(x()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class S{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(o===void 0)t=v(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==N,n&&(this._$AH=t);else{const a=t;let r,$;for(t=o[0],r=0;r<o.length-1;r++)$=v(this,a[s+r],e,r),$===N&&($=this._$AH[r]),n||(n=!H($)||$!==this._$AH[r]),$===A?t=A:t!==A&&(t+=($??"")+o[r+1]),this._$AH[r]=$}n&&!i&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class G extends S{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class J extends S{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class K extends S{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=v(this,t,e,0)??A)===N)return;const s=this._$AH,i=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==A&&(s===A||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){v(this,t)}}const E=y.litHtmlPolyfillSupport;E==null||E(T,b),(y.litHtmlVersions??(y.litHtmlVersions=[])).push("3.2.1");const Y=(h,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new b(t.insertBefore(x(),o),o,void 0,e??{})}return i._$AI(h),i};export{Y as B,N as T,X as x};
