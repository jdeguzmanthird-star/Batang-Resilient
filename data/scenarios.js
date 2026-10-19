/* Story selection metadata only. The complete scenarios arrive in Stages 7–10. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};LE.Data=LE.Data||{};
  LE.Data.scenarios=[
    {id:'typhoon',available:true,localName:'Bagyo',stage:7,title:{en:'Typhoon',fil:'Bagyo'},color:'#668c99',description:{en:'Rain and strong winds change an ordinary school day. Learn with Ma’am Mara and your classmates.',fil:'Nagbago ang karaniwang araw dahil sa ulan at malakas na hangin. Matuto kasama si Ma’am Mara at ang mga kaklase.'}},
    {id:'flood',available:true,localName:'Baha',stage:8,title:{en:'Flood',fil:'Baha'},color:'#6c9c9a',description:{en:'The river near the school rises after days of rain. A story about planning and looking after one another.',fil:'Tumaas ang ilog malapit sa paaralan matapos ang ilang araw na ulan. Kuwento ito ng paghahanda at pagtutulungan.'}},
    {id:'earthquake',available:true,localName:'Linog / Lindol',stage:9,title:{en:'Earthquake',fil:'Lindol'},color:'#b99569',description:{en:'A science lesson takes an unexpected turn. Join the class through the whole DRRM cycle.',fil:'May hindi inaasahang nangyari sa klase sa agham. Samahan ang klase sa buong siklo ng DRRM.'}},
    {id:'tsunami',available:true,localName:'Daluyon / Tsunami',stage:10,title:{en:'Tsunami',fil:'Tsunami'},color:'#759fad',description:{en:'A coastal school experiences a strong earthquake. Learn how the community prepares and works together.',fil:'Naranasan ng paaralan malapit sa baybayin ang malakas na lindol. Alamin kung paano naghahanda at nagtutulungan ang komunidad.'}}
  ];
  LE.Data.pillars=[
    {id:'prevention',labelKey:'p1',textKey:'p1Text'},
    {id:'preparedness',labelKey:'p2',textKey:'p2Text'},
    {id:'response',labelKey:'p3',textKey:'p3Text'},
    {id:'recovery',labelKey:'p4',textKey:'p4Text'}
  ];
})();
