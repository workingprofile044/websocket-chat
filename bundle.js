(()=>{"use strict";var e=new WebSocket("wss://websocket-chat-ep8y.onrender.com"),t=document.getElementById("login-popup"),n=document.getElementById("chat-room"),s=document.getElementById("nickname"),a=document.getElementById("join-btn"),c=document.getElementById("error-msg"),m=document.getElementById("users-list"),o=document.getElementById("messages-container"),i=document.getElementById("message-input"),d=document.getElementById("send-btn"),r="";function l(e,t){var n=document.createElement("div");n.textContent=e,n.className=t?"message-right":"message-left",o.appendChild(n)}a.addEventListener("click",(function(){(r=s.value.trim())&&e.send(JSON.stringify({type:"login",name:r}))})),d.addEventListener("click",(function(){var t=i.value.trim();t&&(e.send(JSON.stringify({type:"message",name:r,message:t})),l(t,!0),i.value="")})),e.onmessage=function(e){var s,a=JSON.parse(e.data);switch(a.type){case"login":a.success?(t.style.display="none",n.style.display="block"):c.textContent="Nickname is taken, please choose another one.";break;case"userlist":s=a.users,m.innerHTML=s.map((function(e){return"<div>".concat(e,"</div>")})).join("");break;case"message":a.name!==r&&l("".concat(a.name,": ").concat(a.message),!1)}}})();