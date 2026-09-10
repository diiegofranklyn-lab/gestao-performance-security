(function(){'use strict';
function bootNav(){
  var titles={dashboard:'Dashboard Executivo',avaliacao:'Avaliação 180°',ranking:'Ranking',pdi:'Plano de Desenvolvimento Individual',coordenadores:'Coordenadores',config:'Configurações'};
  function show(view){
    var views=document.querySelectorAll('.view');
    for(var i=0;i<views.length;i++){views[i].classList.toggle('active-view',views[i].id==='view-'+view)}
    var nav=document.querySelectorAll('.nav-item');
    for(var j=0;j<nav.length;j++){nav[j].classList.toggle('active',nav[j].getAttribute('data-view')===view)}
    var title=document.getElementById('pageTitle');if(title)title.textContent=titles[view]||'Gestão de Performance';
    try{history.replaceState(null,'','#'+view)}catch(e){}
    window.scrollTo(0,0);
  }
  document.addEventListener('click',function(e){
    var el=e.target.closest ? e.target.closest('[data-view],[data-go]') : null;
    if(!el)return;
    var v=el.getAttribute('data-view')||el.getAttribute('data-go');
    if(v){e.preventDefault();e.stopImmediatePropagation();show(v)}
  },true);
  window.addEventListener('hashchange',function(){var v=location.hash.replace('#','');if(titles[v])show(v)});
  var h=location.hash.replace('#','');if(titles[h])show(h);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootNav);else bootNav();
})();