(function(){
'use strict';
const URL='https://sfbcowfkfvegddjlngcx.supabase.co';
const KEY='sb_publishable_MSFajbaORb6DXZa3lKBIQw_fZ1RLurS';
const STORE='securityPerformanceJD_v4';
const sb=window.supabase.createClient(URL,KEY);
window.securitySupabase=sb;
const NAMES=['Gestão dos KPIs Operacionais','Desenvolvimento da Liderança','Qualidade Operacional e Segurança','Inovação e Melhoria Contínua','Gestão do Cliente e Compliance'];
const W=[.30,.20,.20,.15,.15];
function classify(n){n=Number(n)||0;return n>=4.5?'Excepcional':n>=4?'Acima do esperado':n>=3?'Dentro do esperado':n>=2?'Necessita desenvolvimento':'Performance crítica';}
async function sync(){
 const [c,e,p]=await Promise.all([sb.from('coordinators').select('*').order('created_at'),sb.from('evaluations').select('*').order('created_at'),sb.from('pdis').select('*').order('created_at')]);
 if(c.error||e.error||p.error)throw(c.error||e.error||p.error);
 const sc=e.data.length?await sb.from('evaluation_scores').select('*').in('evaluation_id',e.data.map(x=>x.id)):({data:[]});
 if(sc.error)throw sc.error;
 const map={};NAMES.forEach((n,i)=>map[n]=i);
 const db={
   coordinators:c.data.map(x=>({id:x.id,name:x.name,unit:x.unit,region:x.region||'',email:x.email||''})),
   evaluations:e.data.map(x=>{
     const co=c.data.find(z=>z.id===x.coordinator_id);
     const ss=sc.data.filter(z=>z.evaluation_id===x.id).sort((a,b)=>(map[a.pillar]??99)-(map[b.pillar]??99));
     const pm={kpis:0,lead:0,quality:0,innovation:0,client:0},scores=[],obs=[];
     ss.forEach(z=>{const i=map[z.pillar];if(i!=null){const key=['kpis','lead','quality','innovation','client'][i];pm[key]=Number(z.score||0);scores[i]=z.criteria?.scores||[z.score];try{obs[i]=JSON.parse(z.evidence||'[]')}catch(_){obs[i]=[z.evidence||''];}}});
     let manager=Number(x.manager_score);if(!Number.isFinite(manager)||manager===0)manager=Number(x.final_score||0);
     const client=x.client_score==null?null:Number(x.client_score),final=client==null?Number(x.final_score||manager):(manager+client)/2;
     return {id:x.id,coordinatorId:x.coordinator_id,coordinator:co?.name||'—',unit:co?.unit||'',period:x.period,eval1:x.evaluator_1,eval2:x.evaluator_2,managerScore:manager,clientScore:client,final:final,classification:x.classification||classify(final),pillars:pm,scores:scores,observations:obs};
   }),
   pdi:p.data.map(x=>({id:x.id,coordinatorId:x.coordinator_id,gap:x.competence_gap,goal:x.objective,action:x.development_action,owner:x.responsible,deadline:x.deadline,indicator:x.success_indicator,status:x.status||'Planejado'}))
 };
 localStorage.setItem(STORE,JSON.stringify(db));
 window.dispatchEvent(new CustomEvent('security-data-synced'));
}
async function coord(f){const x=new FormData(f),name=String(x.get('name')||'').trim(),unit=String(x.get('unit')||'').trim(),region=String(x.get('region')||'').trim();if(!name||!unit){alert('Informe o nome e a unidade.');return}const r=await sb.from('coordinators').insert({name,unit,region}).select('*').single();if(r.error){alert('Não foi possível cadastrar o coordenador.\n\n'+r.error.message);return}await sync();closeModalSafe();alert('Coordenador cadastrado com sucesso!');location.reload();}
function closeModalSafe(){const m=document.getElementById('modal');if(m)m.classList.add('hidden')}
async function pdi(f){const x=new FormData(f),cid=x.get('coordinatorId')||null;if(!cid){alert('Selecione um coordenador para o PDI.');return}const r=await sb.from('pdis').insert({coordinator_id:cid,competence_gap:x.get('gap'),current_situation:'',objective:x.get('goal'),development_action:x.get('action'),responsible:x.get('owner'),deadline:x.get('deadline')||null,success_indicator:x.get('indicator'),status:'Planejado'});if(r.error)alert('Erro ao salvar PDI: '+r.error.message);else location.reload();}
async function evaluation(f){const x=new FormData(f),cid=x.get('coordinator'),lens=[4,5,4,2,3],av=[],scores=[],obs=[];if(!cid)return alert('Selecione o coordenador.');for(let i=0;i<5;i++){const a=[],o=[];for(let j=0;j<lens[i];j++){const v=Number(x.get(`score_${i}_${j}`));if(v<1||v>5)return alert('Faltam notas na avaliação.');a.push(v);o.push(x.get(`obs_${i}_${j}`)||'');}scores.push(a);obs.push(o);av.push(a.reduce((a,b)=>a+b,0)/a.length);}const manager=av.reduce((a,b,i)=>a+b*W[i],0),client=Number(x.get('clientScore'));if(client<1||client>5)return alert('Informe a nota final do cliente de 1 a 5.');const final=(manager+client)/2,cl=classify(final),id=f.dataset.editId,row={coordinator_id:cid,period:x.get('evalPeriod'),evaluator_1:x.get('eval1'),evaluator_2:x.get('eval2'),manager_score:manager,client_score:client,final_score:final,classification:cl,updated_at:new Date().toISOString()};const r=id?await sb.from('evaluations').update(row).eq('id',id).select().single():await sb.from('evaluations').insert(row).select().single();if(r.error)return alert('Erro ao salvar avaliação: '+r.error.message);if(id){const d=await sb.from('evaluation_scores').delete().eq('evaluation_id',id);if(d.error)return alert('Erro ao atualizar notas: '+d.error.message);}for(let i=0;i<5;i++){const q=await sb.from('evaluation_scores').insert({evaluation_id:r.data.id,pillar:NAMES[i],weight:W[i],score:av[i],criteria:{scores:scores[i]},evidence:JSON.stringify(obs[i])});if(q.error)return alert('Erro nas notas: '+q.error.message);}await sync();location.reload();}
function capture(){document.addEventListener('submit',e=>{const f=e.target;if(f.id==='coordForm'){e.preventDefault();e.stopImmediatePropagation();coord(f)}else if(f.id==='pdiForm'){e.preventDefault();e.stopImmediatePropagation();pdi(f)}else if(f.id==='evaluationForm'){e.preventDefault();e.stopImmediatePropagation();evaluation(f)}},true);document.addEventListener('change',async e=>{const id=e.target.getAttribute('data-pdi');if(id){const r=await sb.from('pdis').update({status:e.target.value,updated_at:new Date().toISOString()}).eq('id',id);if(r.error)alert(r.error.message);else location.reload();}},true)}
function boot(){capture();sync().catch(e=>console.error('Sincronização compartilhada indisponível:',e))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();