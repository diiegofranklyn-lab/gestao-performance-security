document.addEventListener('DOMContentLoaded',()=>{
 const qs=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
 const title={dashboard:'Dashboard Executivo',avaliacao:'Avaliação 180°',ranking:'Ranking',pdi:'Plano de Desenvolvimento Individual',coordenadores:'Coordenadores',config:'Configurações'};
 function nav(view){all('.view').forEach(v=>v.classList.remove('active-view'));qs('#view-'+view)?.classList.add('active-view');all('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));if(qs('#pageTitle'))qs('#pageTitle').textContent=title[view]||'Gestão de Performance';if(typeof renderAll==='function')renderAll();if(view==='avaliacao'&&typeof renderCriteria==='function')renderCriteria()}
 all('.nav-item').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();nav(b.dataset.view)}));
 all('[data-go]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();nav(b.dataset.go)}));
 qs('#menuBtn')?.addEventListener('click',()=>qs('#sidebar')?.classList.toggle('open'));
 qs('#addCoordinatorBtn')?.addEventListener('click',()=>typeof newCoordinator==='function'&&newCoordinator());
 qs('#addPdiBtn')?.addEventListener('click',()=>typeof newPdi==='function'&&newPdi());
 qs('#modalClose')?.addEventListener('click',()=>typeof closeModal==='function'&&closeModal());
 nav('dashboard');
});