(function(){
'use strict';
var KEY='securityPerformanceJD_v4';
function $(s){return document.querySelector(s)}
function draw(){
  var canvas=$('#evolutionChart'), empty=$('#emptyChart');
  if(!canvas)return;
  var db={};try{db=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){db={}}
  var data=(db.evaluations||[]).filter(function(e){return Number(e.final)>0}).slice().sort(function(a,b){return String(a.period||'').localeCompare(String(b.period||''))});
  if(!data.length){canvas.style.display='none';if(empty)empty.style.display='flex';return}
  canvas.style.display='block';if(empty)empty.style.display='none';
  var rect=canvas.getBoundingClientRect(),w=Math.max(320,Math.floor(rect.width)),h=Math.max(220,Math.floor(rect.height||220)),dpr=window.devicePixelRatio||1;
  canvas.width=w*dpr;canvas.height=h*dpr;var ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  var p={l:48,r:22,t:22,b:48},cw=w-p.l-p.r,ch=h-p.t-p.b;
  ctx.clearRect(0,0,w,h);
  var min=1,max=5;
  ctx.font='12px Arial';ctx.textAlign='right';ctx.textBaseline='middle';
  for(var y=1;y<=5;y++){
    var yy=p.t+ch-(y-min)/(max-min)*ch;
    ctx.strokeStyle='#e6edf5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();
    ctx.fillStyle='#718096';ctx.fillText(String(y),p.l-10,yy);
  }
  ctx.strokeStyle='#b9c7d8';ctx.beginPath();ctx.moveTo(p.l,p.t);ctx.lineTo(p.l,p.t+ch);ctx.lineTo(w-p.r,p.t+ch);ctx.stroke();
  var step=data.length===1?0:cw/(data.length-1);
  var pts=data.map(function(e,i){return {x:data.length===1?p.l+cw/2:p.l+i*step,y:p.t+ch-(Number(e.final)-min)/(max-min)*ch,e:e}});
  ctx.strokeStyle='#1769e0';ctx.lineWidth=3;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();
  pts.forEach(function(pt,i){if(i===0)ctx.moveTo(pt.x,pt.y);else ctx.lineTo(pt.x,pt.y)});ctx.stroke();
  pts.forEach(function(pt){
    ctx.fillStyle='#fff';ctx.strokeStyle='#1769e0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(pt.x,pt.y,5,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='#17324d';ctx.font='bold 12px Arial';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText(Number(pt.e.final).toFixed(2),pt.x,pt.y-10);
    ctx.fillStyle='#718096';ctx.font='11px Arial';ctx.textBaseline='top';
    var label=(pt.e.period||'').replace(/^([0-9]{4})-([0-9]{2})$/,'$2/$1');
    if(label.length>10)label=label.slice(0,10);ctx.fillText(label,pt.x,p.t+ch+12);
  });
  if(data.length<=12){ctx.font='10px Arial';ctx.fillStyle='#52677d';ctx.textAlign='center';ctx.textBaseline='top';pts.forEach(function(pt){var n=pt.e.coordinator||'';if(n.length>18)n=n.slice(0,18)+'…';ctx.fillText(n,pt.x,p.t+ch+28)})}
}
function refresh(){setTimeout(draw,40)}
document.addEventListener('DOMContentLoaded',function(){refresh();setTimeout(draw,400)});
document.addEventListener('security-data-synced',refresh);
window.addEventListener('resize',function(){if($('#evolutionChart'))draw()});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-view="dashboard"], [data-go="dashboard"]'))setTimeout(draw,80)});
})();
