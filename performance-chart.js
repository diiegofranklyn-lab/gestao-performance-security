(function(){
'use strict';
var KEY='securityPerformanceJD_v4';
function $(s){return document.querySelector(s)}
function readData(){
  var db={};
  try{db=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){db={}}
  return (db.evaluations||[]).map(function(e){
    var final=Number(e.final);
    if(!(final>0)){var m=Number(e.managerScore),c=Number(e.clientScore);if(m>0&&c>0)final=(m+c)/2}
    return {final:final,period:e.period||'',coordinator:e.coordinator||e.name||'Coordenador'};
  }).filter(function(e){return e.final>=1&&e.final<=5}).sort(function(a,b){return String(a.period).localeCompare(String(b.period))});
}
function draw(){
  var canvas=$('#evolutionChart'),empty=$('#emptyChart');
  if(!canvas)return;
  var data=readData();
  if(!data.length){canvas.style.display='none';if(empty)empty.style.display='flex';return}
  canvas.style.display='block';if(empty)empty.style.display='none';
  var rect=canvas.parentElement.getBoundingClientRect(),w=Math.max(420,Math.floor(rect.width)),h=220,dpr=window.devicePixelRatio||1;
  canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';
  var ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  var p={l:42,r:22,t:18,b:58},cw=w-p.l-p.r,ch=h-p.t-p.b,min=1,max=5;
  ctx.font='12px Arial';ctx.textAlign='right';ctx.textBaseline='middle';
  for(var y=1;y<=5;y++){var yy=p.t+ch-(y-min)/(max-min)*ch;ctx.strokeStyle='#e6edf5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillStyle='#718096';ctx.fillText(String(y),p.l-8,yy)}
  var step=data.length===1?0:cw/(data.length-1),pts=data.map(function(e,i){return{x:data.length===1?p.l+cw/2:p.l+i*step,y:p.t+ch-(e.final-min)/(max-min)*ch,e:e}});
  ctx.strokeStyle='#1769e0';ctx.lineWidth=3;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();pts.forEach(function(pt,i){i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y)});ctx.stroke();
  pts.forEach(function(pt){ctx.fillStyle='#fff';ctx.strokeStyle='#1769e0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(pt.x,pt.y,5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#17324d';ctx.font='bold 12px Arial';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(pt.e.final.toFixed(2),pt.x,pt.y-9);ctx.fillStyle='#718096';ctx.font='11px Arial';ctx.textBaseline='top';var label=String(pt.e.period).replace(/^([0-9]{4})-([0-9]{2})$/,'$2/$1');ctx.fillText(label,pt.x,p.t+ch+10);var n=pt.e.coordinator;if(n.length>18)n=n.slice(0,18)+'…';ctx.fillText(n,pt.x,p.t+ch+27)});
}
function refresh(){setTimeout(draw,80)}
document.addEventListener('DOMContentLoaded',function(){refresh();setTimeout(draw,500);setTimeout(draw,1500);setTimeout(draw,3000)});
document.addEventListener('security-data-synced',refresh);
window.addEventListener('storage',refresh);window.addEventListener('resize',draw);
setInterval(draw,2000);
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-view="dashboard"], [data-go="dashboard"]'))setTimeout(draw,150)});
})();
