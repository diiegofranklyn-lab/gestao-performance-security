(function(){
'use strict';
var KEY='securityPerformanceJD_v4';
function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]})}
function addButtons(){
  var body=document.getElementById('coordBody');
  if(!body)return;
  var db;
  try{db=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){db=null}
  if(!db||!Array.isArray(db.coordinators))return;
  var rows=body.querySelectorAll('tr');
  rows.forEach(function(row,i){
    if(row.querySelector('[data-delete-coordinator]'))return;
    var c=db.coordinators[i];
    if(!c)return;
    var cell=document.createElement('td');
    cell.innerHTML='<button type="button" class="ghost danger-btn" data-delete-coordinator="'+esc(c.id)+'" data-coordinator-name="'+esc(c.name)+'">Excluir</button>';
    row.appendChild(cell);
  });
}
async function removeCoordinator(id,name){
  if(!confirm('Excluir o coordenador '+name+'?\n\nAs avaliações e ações de PDI vinculadas também serão removidas.'))return;
  var sb=window.securitySupabase;
  try{
    if(sb){
      var ids=await evaluationIds(sb,id);
      if(ids.length){
        var r1=await sb.from('evaluation_scores').delete().in('evaluation_id',ids);
        if(r1.error)throw r1.error;
      }
      var r2=await sb.from('evaluations').delete().eq('coordinator_id',id);
      if(r2.error)throw r2.error;
      var r3=await sb.from('pdis').delete().eq('coordinator_id',id);
      if(r3.error)throw r3.error;
      var r4=await sb.from('coordinators').delete().eq('id',id);
      if(r4.error)throw r4.error;
    }
    var db=JSON.parse(localStorage.getItem(KEY)||'{"coordinators":[],"evaluations":[],"pdi":[]}');
    db.coordinators=(db.coordinators||[]).filter(function(c){return c.id!==id});
    db.evaluations=(db.evaluations||[]).filter(function(e){return e.coordinatorId!==id});
    db.pdi=(db.pdi||[]).filter(function(p){return p.coordinatorId!==id});
    localStorage.setItem(KEY,JSON.stringify(db));
    alert('Coordenador excluído com sucesso.');
    location.reload();
  }catch(e){
    alert('Não foi possível excluir o coordenador.\n\n'+(e.message||e));
  }
}
async function evaluationIds(sb,coordinatorId){
  var r=await sb.from('evaluations').select('id').eq('coordinator_id',coordinatorId);
  if(r.error)throw r.error;
  return (r.data||[]).map(function(x){return x.id});
}
function bind(){
  var body=document.getElementById('coordBody');
  if(!body)return;
  body.addEventListener('click',function(e){
    var b=e.target.closest('[data-delete-coordinator]');
    if(!b)return;
    e.preventDefault();e.stopPropagation();
    removeCoordinator(b.getAttribute('data-delete-coordinator'),b.getAttribute('data-coordinator-name'));
  });
  addButtons();
  var observer=new MutationObserver(function(){
    observer.disconnect();
    try{addButtons()}finally{observer.observe(body,{childList:true,subtree:true})}
  });
  observer.observe(body,{childList:true,subtree:true});
}
function boot(){bind()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
