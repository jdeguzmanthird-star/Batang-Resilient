/* Picture glossary. Native text remains the source of every definition. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},h=(...x)=>LE.UI.h(...x),L=(en,fil)=>LE.Save.get().settings.language==='fil'?fil:en,local=x=>x[LE.Save.get().settings.language]||x.en;
 function icon(ctx,type){ctx.fillStyle='#e6ecd0';ctx.fillRect(0,0,64,64);ctx.fillStyle='#32685a';ctx.strokeStyle='#32685a';ctx.lineWidth=4;ctx.lineCap='round';
  if(type==='bag'){ctx.fillRect(16,21,32,32);ctx.strokeRect(24,12,16,16);ctx.fillStyle='#efd17a';ctx.fillRect(22,33,20,10);}
  else if(type==='wave'||type==='quake'){ctx.beginPath();ctx.moveTo(4,40);for(let i=0;i<=8;i++)ctx.lineTo(4+i*7,type==='wave'?35+Math.sin(i)*13:(i%2?18:48));ctx.stroke();}
  else if(type==='arrow'){ctx.fillRect(27,21,10,34);ctx.beginPath();ctx.moveTo(12,27);ctx.lineTo(32,7);ctx.lineTo(52,27);ctx.closePath();ctx.fill();}
  else if(type==='plant'){ctx.fillRect(29,24,6,32);ctx.beginPath();ctx.ellipse(23,24,14,7,.6,0,Math.PI*2);ctx.ellipse(42,16,14,7,-.6,0,Math.PI*2);ctx.fill();}
  else if(type==='people'){ctx.beginPath();ctx.arc(23,19,7,0,Math.PI*2);ctx.arc(44,23,6,0,Math.PI*2);ctx.fill();ctx.fillRect(14,30,18,24);ctx.fillRect(37,33,14,21);}
  else if(type==='flag'){ctx.fillRect(15,10,4,46);ctx.fillRect(19,10,30,19);ctx.fillStyle='#efd17a';ctx.fillRect(23,16,20,5);}
  else{ctx.beginPath();ctx.moveTo(32,7);ctx.lineTo(53,16);ctx.lineTo(49,40);ctx.lineTo(32,56);ctx.lineTo(15,40);ctx.lineTo(11,16);ctx.closePath();ctx.fill();ctx.fillStyle='#f4da81';if(type==='warning'){ctx.fillRect(29,20,6,16);ctx.fillRect(29,40,6,6);}else{ctx.strokeStyle='#f4da81';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(21,31);ctx.lineTo(29,39);ctx.lineTo(44,23);ctx.stroke();}}
 }
 function glossary(back){const body=h('div',{}),search=h('input',{id:'glossary-search',type:'search',placeholder:L('Search a term','Maghanap ng salita')}),list=h('div',{className:'glossary-list','aria-live':'polite'});body.append(h('label',{htmlFor:'glossary-search'},L('Find a word','Humanap ng salita')),search,list);
  function render(){const query=search.value.toLocaleLowerCase().trim(),items=LE.Data.glossary.filter(x=>(local(x.term)+' '+local(x.definition)).toLocaleLowerCase().includes(query));list.replaceChildren();for(const item of items){const canvas=h('canvas',{width:64,height:64,'aria-hidden':'true'});icon(canvas.getContext('2d'),item.icon);list.append(h('article',{className:'glossary-card'},canvas,h('div',{},h('h3',{},local(item.term)),h('p',{},local(item.definition)))));}if(!items.length)list.append(h('p',{},L('No matching terms. Try another word.','Walang katugmang salita. Subukan ang iba.')));}
  search.addEventListener('input',render);render();const footer=[h('button',{id:'glossary-read',type:'button',className:'secondary',onclick:()=>LE.UI.speak(list.textContent)},LE.UI.t('read'))];if(back)footer.push(h('button',{id:'glossary-back',type:'button',className:'secondary',onclick:back},L('Back','Bumalik')));LE.UI.modal(L('DRRM Glossary','Talasalitaan ng DRRM'),body,footer).classList.add('wide-dialog');
 }
 LE.LearningScene={glossary,icon};
})();
