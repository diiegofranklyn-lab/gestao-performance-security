(function(){
'use strict';
var descriptions={
'Turnover':'Gestão do turnover, análise de causas e ações preventivas',
'Absenteísmo':'Controle, análise de causas e redução do absenteísmo',
'Horas extras':'Planejamento de cobertura, utilização da reserva, reposição de falta de efetivo',
'Postos descobertos':'Prevenção de gaps e rápida recomposição operacional',
'Postura':'Desenvolvimento da postura profissional dos Vigilantes Líderes',
'Gestão de equipe':'Capacidade de liderança, delegação e acompanhamento',
'Treinamentos':'Realização das trilhas de treinamentos líderes e equipe',
'Comunicação':'Comunicação assertiva, reuniões, DDS e feedbacks',
'Formação de novos líderes':'Evolução e preparação de profissionais para funções de liderança',
'Procedimentos John Deere':'Cumprimento dos procedimentos de segurança',
'Auditorias e não conformidades':'Resultado de auditorias no cliente',
'Gestão de ocorrências':'Análise, resposta, prevenção e registro das ocorrências',
'Inspeções e vulnerabilidades':'Qualidade das inspeções e identificação antecipada de riscos (testes de percepção de riscos)',
'Iniciativas de inovação':'Proposição e implementação de soluções para segurança/negócio',
'Resultados das iniciativas':'Redução de risco/custo ou ganho de eficiência comprovado',
'Processos OEA':'Evidenciar cumprimento dos requisitos, tratar não conformidades e evidenciar treinamentos',
'SLA e obrigações contratuais':'Cumprimento de SLAs, contratos e compromissos',
'Gestão de resultados':'Qualidade das reuniões, indicadores e planos de ação'
};
var clientNames=['Processos OEA','SLA e obrigações contratuais','Gestão de resultados'];
function applyDescriptions(){
 var groups=document.querySelectorAll('#criteriaContainer .criteria-group');
 if(!groups.length)return;
 groups.forEach(function(group){
   var items=group.querySelectorAll('.criterion');
   items.forEach(function(item){
     var title=item.querySelector('.criterion-name b');
     if(!title)return;
     var old=title.textContent.trim();
     if(old==='Relacionamento com cliente')title.textContent='SLA e obrigações contratuais';
     if(old==='Compliance e governança')title.textContent='Gestão de resultados';
     var name=title.textContent.trim();
     var desc=descriptions[name];
     if(!desc)return;
     var current=item.querySelector('.criterion-description');
     if(current){current.textContent=desc;return;}
     var el=document.createElement('div');
     el.className='criterion-description';
     el.textContent=desc;
     title.parentNode.appendChild(el);
   });
 });
}
function scheduleApply(){setTimeout(applyDescriptions,60);}
document.addEventListener('click',function(e){
 var t=e.target.closest('[data-go="avaliacao"], [data-view="avaliacao"]');
 if(t)scheduleApply();
},false);
document.addEventListener('DOMContentLoaded',function(){scheduleApply();});
})();
