/* Complete four-chapter Bagyo story. This is a fictional exercise, not an advisory. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};LE.Data=LE.Data||{};const b=(en,fil)=>({en,fil});
 const choice=(id,en,fil,best,why)=>({id,text:b(en,fil),type:best?'best':'wrong',points:best?10:0,safety:best?0:-20,consequence:best?null:'typhoon_'+id,learn:why});
 function decision(n,pillar,scene,en,fil,answers,best,why,fact,memory,consequence){return{id:'TY_D'+n,pillar,scene,text:b(en,fil),timer:pillar==='response'?25:null,choices:answers.map((a,i)=>choice('ABC'[i],a[0],a[1],i===best,why)),funFact:fact,memory,consequenceText:consequence};}
 const decisions=[
 decision(1,'prevention','grounds','You see garbage clogging the canal before the storm. What will you do?','Bago ang bagyo, nakita mong may basura sa kanal. Ano ang gagawin mo?',[
 ['Ignore it.','Pabayaan ito.'],['Tell the teacher. Help only with an approved, dry cleanup task; adults clear the drain.','Sabihin sa guro. Tumulong lang sa aprubadong tuyong gawain; nakatatanda ang maglilinis ng kanal.'],['Throw more trash into it.','Dagdagan pa ang basura.']],1,
 b('A blocked drain can keep rainwater from flowing away. Tell an adult where the blockage is. Children stay out of drains and dirty water.','Maaaring maipon ang ulan kapag barado ang kanal. Sabihin sa nakatatanda kung nasaan ang bara. Lalayo ang mga bata sa kanal at maruming tubig.'),
 b('The club can mark a drainage concern in its school report.','Maaaring itala ng club sa ulat ang problema sa kanal.'),b('Clear paths for water. Report safely.','Maluwag na daluyan. Ligtas na pag-uulat.'),b('The blocked drain is still a concern. Ma’am Mara pauses the walk and asks adults to assess it.','Problema pa rin ang baradong kanal. Pinahinto ni Ma’am Mara ang paglibot at humingi ng pagsusuri sa nakatatanda.')),
 decision(2,'prevention','grounds','A branch leans over the classroom roof. What is the safest help?','May nakasangang kahoy sa ibabaw ng bubong ng silid. Ano ang pinakaligtas na tulong?',[
 ['Climb up to cut it.','Umakyat upang putulin ito.'],['Report it so trained adults can trim it safely.','Iulat ito upang ligtas na maputol ng sanay na nakatatanda.'],['Shake the branch.','Alugin ang sanga.']],1,
 b('A branch may fall or break without warning. Stay clear and report it. Trained adults choose how to trim it safely.','Maaaring mabali o mahulog ang sanga nang biglaan. Lumayo at iulat ito. Sanay na nakatatanda ang pipili ng ligtas na paraan ng pagputol.'),
 b('A safety report should include the tree’s location.','Dapat kasama sa ulat ang lugar ng puno.'),b('Do not climb. Tell an adult.','Huwag umakyat. Magsabi sa nakatatanda.'),b('Moving close to the branch puts you beneath it. Kuya Rescue asks everyone to step back while adults check the area.','Nalagay ka sa ilalim ng sanga. Pinalayo ni Kuya Rescue ang lahat habang sinusuri ng nakatatanda ang lugar.')),
 decision(3,'preparedness','classroom','In this fictional exercise, the radio announces Wind Signal No. 3. Classes have stopped. What will you do?','Sa kathang-isip na pagsasanay, inanunsiyo ang Wind Signal No. 3. Huminto na ang klase. Ano ang gagawin mo?',[
 ['Go outside to look at the storm.','Lumabas upang tingnan ang bagyo.'],['Follow the teacher to the planned shelter, away from windows, and listen for updates.','Sundin ang guro sa nakaplanong silungan, malayo sa bintana, at makinig sa balita.'],['Walk home alone.','Umuwi nang mag-isa.']],1,
 b('Follow the school’s approved plan and the adults caring for your class. Stay away from glass in the chosen shelter. Do not set off alone.','Sundin ang aprubadong plano at ang nakatatandang nag-aalaga sa klase. Lumayo sa salamin sa napiling silungan. Huwag umalis nang mag-isa.'),
 b('Signal No. 3 warns of storm-force winds: 89–117 km/h.','Babala ang Signal No. 3 sa storm-force winds: 89–117 km/h.'),b('Follow the plan. Stay with your teacher.','Sundin ang plano. Sumama sa guro.'),b('Leaving would separate you from the adults arranging safe care. Ma’am Mara gathers everyone in the planned shelter.','Mawawalay ka sa nakatatandang nag-aayos ng ligtas na pangangalaga. Pinagsama ni Ma’am Mara ang lahat sa nakaplanong silungan.')),
 decision(4,'preparedness','classroom','Jomar wants to share videos instead of listening to the radio. What will you do?','Gustong magbahagi ni Jomar ng video sa halip na makinig sa radyo. Ano ang gagawin mo?',[
 ['Join him and ignore the update.','Sumali at huwag pansinin ang balita.'],['Save phone battery for needed contact and listen to official updates.','Tipirin ang baterya para sa mahalagang kontak at makinig sa opisyal na balita.'],['Charge the phone beside a wet area.','Mag-charge sa tabi ng basang lugar.']],1,
 b('Official updates help adults make safe plans. Keep devices dry and save battery for needed contact. Ask the teacher before using a charger.','Tumutulong ang opisyal na balita sa ligtas na plano ng nakatatanda. Panatilihing tuyo ang gamit at tipirin ang baterya. Magtanong sa guro bago mag-charge.'),
 b('An emergency contact card can be read even when a phone battery is empty.','Mababasa ang kard ng mga kontak kahit ubos ang baterya ng telepono.'),b('Listen first. Keep power for contact.','Makinig muna. Itabi ang baterya para sa kontak.'),b('The class misses part of an update. Ma’am Mara repeats it and asks Jomar to put the phone somewhere dry.','Hindi narinig ng klase ang bahagi ng balita. Inulit ito ni Ma’am Mara at ipinapuwesto ang telepono sa tuyong lugar.')),
 decision(5,'response','classroom','Strong wind rattles the windows. What will you do?','Pinapakalampag ng malakas na hangin ang bintana. Ano ang gagawin mo?',[
 ['Stand close to the glass to watch.','Tumayo malapit sa salamin upang manood.'],['Move away from glass and follow the teacher to the protected part of the room.','Lumayo sa salamin at sumunod sa guro sa protektadong bahagi ng silid.'],['Open the window to equalize pressure.','Buksan ang bintana upang pantayin ang presyon.']],1,
 b('Wind and flying objects can break glass. Stay in the protected area the teacher chose. Adults handle shutters only when it is safe.','Maaaring mabasag ang salamin dahil sa hangin at lumilipad na bagay. Manatili sa protektadong lugar na pinili ng guro. Nakatatanda ang bahala sa shutter kung ligtas.'),
 b('An interior shelter puts more walls between the class and outdoor wind.','Mas maraming pader sa pagitan ng klase at hangin sa labas kung nasa panloob na silungan.'),b('Back from glass. Follow the teacher.','Lumayo sa salamin. Sundin ang guro.'),b('A loose object strikes outside the window. Ma’am Mara guides you farther from the glass; nobody is hurt.','May tumamang bagay sa labas ng bintana. Inilayo ka ni Ma’am Mara sa salamin; walang nasaktan.')),
 decision(6,'response','classroom','The lights go out. What should the class use?','Namatay ang ilaw. Ano ang dapat gamitin ng klase?',[
 ['A candle and matches.','Kandila at posporo.'],['A flashlight or battery emergency light.','Flashlight o de-bateryang emergency light.'],['No light; wander around in the dark.','Walang ilaw; gumala sa dilim.']],1,
 b('A battery light helps you see without an open flame. Stay together and keep the path clear. Ask an adult to check any electrical problem.','Makakakita ka gamit ang de-bateryang ilaw nang walang apoy. Magsama-sama at panatilihing maluwag ang daan. Ipasuri sa nakatatanda ang problema sa kuryente.'),
 b('A flashlight does not need a burning wick.','Hindi nangangailangan ng nagliliyab na mitsa ang flashlight.'),b('Use a flashlight. Keep together.','Gumamit ng flashlight. Magsama-sama.'),b('The dark path is hard to see. Ma’am Mara stops the class from moving and brings out a battery light.','Mahirap makita ang madilim na daan. Pinahinto ni Ma’am Mara ang klase at kumuha ng de-bateryang ilaw.')),
 decision(7,'response','classroom','Rain leaks near an electrical outlet. What will you do?','May tumutulong ulan malapit sa saksakan. Ano ang gagawin mo?',[
 ['Touch the outlet to dry it.','Hawakan ang saksakan upang patuyuin.'],['Stay well away and tell the teacher.','Lumayo nang mabuti at magsabi sa guro.'],['Pour water on it.','Buhusan ito ng tubig.']],1,
 b('Wet electrical equipment can be dangerous. Stay away from the outlet, wires, and nearby water. Tell an adult; children do not touch switches or try repairs.','Mapanganib ang basang gamit na de-kuryente. Lumayo sa saksakan, kawad, at tubig sa paligid. Magsabi sa nakatatanda; hindi bata ang hahawak sa switch o mag-aayos.'),
 b('The class can report the location without touching the hazard.','Maaaring iulat ang lugar nang hindi hinahawakan ang panganib.'),b('Water near wires? Step back and report.','Tubig sa kawad? Lumayo at iulat.'),b('Ma’am Mara calls you back from the wet corner and keeps it off limits. An authorized adult arranges help.','Pinalayo ka ni Ma’am Mara sa basang sulok at ipinagbawal ang paglapit. Humingi ng tulong ang awtorisadong nakatatanda.')),
 decision(8,'response','classroom','Bea is crying and scared. What can you do?','Umiiyak at natatakot si Bea. Ano ang maaari mong gawin?',[
 ['Laugh at her.','Tawanan siya.'],['Stay kindly nearby, listen, and ask the teacher to help her feel supported.','Manatili nang mabait sa malapit, makinig, at humingi ng tulong sa guro.'],['Leave her alone without telling an adult.','Iwan siya nang walang paalam sa nakatatanda.']],1,
 b('Feelings can differ during a storm. Listen kindly without forcing Bea to talk. A trusted adult can help both of you find support.','Maaaring magkaiba ang damdamin sa bagyo. Makinig nang mabuti nang hindi pinipilit si Bea. Makakatulong ang pinagkakatiwalaang nakatatanda sa inyong dalawa.'),
 b('A friend may prefer quiet company or help from a teacher.','Maaaring mas gusto ng kaibigan ang tahimik na kasama o tulong ng guro.'),b('Be kind. Listen. Find support.','Maging mabait. Makinig. Humingi ng tulong.'),b('Bea feels more alone. Ma’am Mara stays with her and helps the class use kind words.','Lalong nalungkot si Bea. Sinamahan siya ni Ma’am Mara at tinulungang gumamit ng mabuting salita ang klase.')),
 decision(9,'response','classroom','Jomar wants to run onto the field for his bag. What will you do?','Gustong tumakbo ni Jomar sa bakuran para sa bag. Ano ang gagawin mo?',[
 ['Follow him outside.','Sundan siya sa labas.'],['Ask him to stay and tell the teacher immediately.','Hilinging manatili siya at sabihin agad sa guro.'],['Throw him an umbrella so he can go.','Hagisan siya ng payong upang makalabas.']],1,
 b('Strong wind can carry dangerous objects. Belongings can wait. Ask Jomar to stay in shelter and get the teacher’s help.','Maaaring tangayin ng hangin ang mapanganib na bagay. Makapaghihintay ang gamit. Hilinging manatili si Jomar sa silungan at humingi ng tulong sa guro.'),
 b('A bag can be replaced; keeping the class safe comes first.','Maaaring mapalitan ang bag; unahin ang kaligtasan ng klase.'),b('People first. Bags can wait.','Tao muna. Makapaghihintay ang bag.'),b('Wind sends leaves and a roof sheet across the distant field. The teacher stops the trip; Jomar stays safely with the class.','May dahon at yero na tinangay sa malayong bakuran. Pinahinto ng guro ang paglabas; ligtas na nanatili si Jomar sa klase.')),
 decision(10,'recovery','classroom','The wind becomes quiet. Is it time to leave?','Humina at tumahimik ang hangin. Maaari na bang umalis?',[
 ['Run outside now.','Tumakbo na sa labas.'],['Stay with the teacher and wait for official safety instructions.','Manatili sa guro at hintayin ang opisyal na tagubilin sa kaligtasan.'],['Walk home alone.','Umuwi nang mag-isa.']],1,
 b('A calm spell does not prove the storm is over. Strong wind may return, including after the eye passes. Stay sheltered until authorities and the school give safe instructions.','Hindi patunay ang katahimikan na tapos na ang bagyo. Maaaring bumalik ang hangin, pati matapos dumaan ang mata nito. Manatili sa silungan hanggang magbigay ng ligtas na tagubilin ang awtoridad at paaralan.'),
 b('The eye can be calm while strong winds remain around it.','Maaaring tahimik ang mata ng bagyo habang malakas ang hangin sa paligid nito.'),b('Calm is not an all clear.','Ang tahimik ay hindi all clear.'),b('The teacher holds the class back. The quiet period still needs official checking before anyone leaves shelter.','Pinanatili ng guro ang klase sa loob. Kailangan pa rin ng opisyal na pagsusuri bago umalis sa silungan.')),
 decision(11,'recovery','gate','Adults report fallen wires outside. What should you do?','Iniulat ng nakatatanda na may bumagsak na kawad sa labas. Ano ang dapat mong gawin?',[
 ['Touch a wire with a stick.','Hawakan gamit ang patpat.'],['Stay well back and ask adults to report it to the proper utility or authorities.','Lumayo nang mabuti at ipauulat sa nakatatanda sa tamang utility o awtoridad.'],['Go close for a photograph.','Lumapit para kumuha ng larawan.']],1,
 b('Do not touch fallen wires or objects beside them. Keep away and tell an adult. Only authorized workers can make electrical hazards safe.','Huwag hawakan ang bumagsak na kawad o bagay sa tabi nito. Lumayo at magsabi sa nakatatanda. Awtorisadong manggagawa lamang ang mag-aalis ng panganib sa kuryente.'),
 b('A power outage is not proof that a fallen wire is safe.','Hindi patunay ang brownout na ligtas ang bumagsak na kawad.'),b('Stay back. Report fallen wires.','Lumayo. Iulat ang bumagsak na kawad.'),b('Kuya Rescue marks the area off from a safe place. The class stays inside while authorized workers are contacted.','Ipinagbawal ni Kuya Rescue ang paglapit mula sa ligtas na lugar. Nananatili ang klase sa loob habang kinokontak ang awtorisadong manggagawa.')),
 decision(12,'recovery','classroom','Adults inspect a classroom that was flooded and approve a dry, safe craft area. How may students help?','Sinuri ng nakatatanda ang binahang silid at nagtakda ng tuyo at ligtas na lugar. Paano tutulong ang mag-aaral?',[
 ['Join only approved tasks with adult supervision and the protection they require.','Sumali lang sa aprubadong gawain na may gabay at kailangang proteksiyon.'],['Walk barefoot through mud and debris.','Maglakad nang nakapaa sa putik at kalat.'],['Drink water from a puddle.','Uminom ng tubig mula sa lusak.']],0,
 b('Adults first check the area and choose safe tasks for children. Stay out of floodwater and hazardous debris. Follow their instructions about footwear, gloves, and other protection.','Susuriin muna ng nakatatanda ang lugar at pipili ng ligtas na gawain para sa bata. Lumayo sa baha at mapanganib na kalat. Sundin ang tagubilin sa sapatos, guwantes, at ibang proteksiyon.'),
 b('The club’s cleanup game uses clean teaching cards and a craft panel.','Malilinis na kard at panel ang gamit sa paglilinis ng club.'),b('Adults check first. Children help safely.','Nakatatanda muna. Ligtas na tulong ng bata.'),b('The teacher stops the unsafe cleanup idea and redirects everyone to the inspected dry area. Adults handle hazardous debris.','Pinahinto ng guro ang mapanganib na plano at itinuro ang nasuring tuyong lugar. Nakatatanda ang bahala sa mapanganib na kalat.'))
 ];
 const scene=(id,chapter,weather,npc,en,fil,titleEn,titleFil)=>({id,type:'scene',chapter,weather,npc,text:b(en,fil),title:b(titleEn,titleFil)});
 const taskDecision=n=>({id:'decision-'+n,type:'decision',chapter:n<=2?0:n<=4?1:n<=9?2:3,decisionId:'TY_D'+n,weather:n<3?'clear':n<5?'rain':n===5?'storm':n<=9?'outage':n===10?'lull':'recovery'});
 const mini=(id,game,chapter,weather,en,fil)=>({id,type:'activity',game,chapter,weather,text:b(en,fil)});
 const reflect=(chapter,weather)=>({id:'reflect-'+chapter,type:'reflect',chapter,weather});
 const tasks=[
 scene('opening',0,'storm','mara','Hello, {name}. This is a fictional exercise in Iloilo, Panay. Signal No. 3 is announced after a rapid change; classes have stopped and adults are arranging safe care. First, let’s look back at our earlier safety walk.','Kumusta, {name}. Kathang-isip na pagsasanay ito sa Iloilo, Panay. Mabilis na nagbago ang babala; huminto na ang klase at inaayos ng nakatatanda ang ligtas na pangangalaga. Balikan muna ang naunang paglibot.','Bagyo at Maliwanag','Bagyo sa Maliwanag'),
 scene('chapter-one',0,'clear','mara','Earlier, before dangerous weather: Mag-andam kita. Join our teacher-led school walk. We notice concerns and report them; adults handle repairs.','Mas maaga, bago ang mapanganib na panahon: Mag-andam kita. Sumama sa paglibot ng guro. Tutukoy at mag-uulat tayo; nakatatanda ang mag-aayos.','1 · Prevention & Mitigation','1 · Pag-iwas at Pagbawas ng Panganib'),
 {id:'walk-report',type:'walk',chapter:0,weather:'clear',map:'grounds',key:'noticeboard',text:b('Walk with the group to the noticeboard on the School Grounds. Use the classroom exit, corridor, and marked grounds doorway. Inspect the board nearby.','Lumakad kasama ang grupo sa noticeboard sa Bakuran. Dumaan sa labasan ng silid, pasilyo, at pintuan sa bakuran. Suriin ang board kapag malapit.')},
 mini('hazard-walk','hunt',0,'clear','Use our six-concern safety report. Report from a safe place; the adult team will inspect the roof, drains, branches, signs, latch, and corridor.','Gamitin ang ulat ng anim na panganib. Mag-ulat mula sa ligtas na lugar; nakatatanda ang susuri sa bubong, kanal, sanga, karatula, trangka, at pasilyo.'),
 taskDecision(1),taskDecision(2),reflect(0,'clear'),
 scene('chapter-two',1,'rain','ben','Tatay Ben: Families in Jaro and Molo have contact plans. Before travel becomes unsafe, adults follow official updates and the school plan. Let’s check our Go-Bag and learn the signals.','Tatay Ben: May plano sa kontak ang mga pamilya sa Jaro at Molo. Bago maging mapanganib ang pagbiyahe, susundin ng nakatatanda ang balita at plano. Suriin natin ang Go-Bag at mga signal.','2 · Preparedness','2 · Paghahanda'),
 mini('pack-bag','bag',1,'rain','Check eight useful supplies with Ma’am Mara. Medicine and rescue equipment are for trained adults.','Suriin ang walong kapaki-pakinabang na gamit kasama si Ma’am Mara. Para sa sanay na nakatatanda ang gamot at gamit sa pagsagip.'),
 {id:'wind-board',type:'board',chapter:1,weather:'rain',text:b('Read all five wind-signal cards. These show wind threats, not a complete flood or storm-surge forecast. Follow current school and local instructions.','Basahin ang limang kard ng wind signal. Banta ng hangin ang mga ito, hindi kumpletong babala sa baha o daluyong. Sundin ang kasalukuyang tagubilin ng paaralan at lokal na awtoridad.')},
 {id:'walk-plan',type:'walk',chapter:1,weather:'clear',map:'classroom',key:'evacuation_map',text:b('Earlier plan review: return with the teacher to the classroom evacuation map. This walk happens before dangerous weather. Ask which shelter and route the school approved.','Naunang pag-aaral ng plano: bumalik kasama ang guro sa mapa ng paglikas sa silid. Bago ang mapanganib na panahon ang paglakad na ito. Itanong ang aprubadong silungan at ruta.')},
 scene('warning-change',1,'storm','mara','Back to the exercise warning: Signal No. 3 is announced. Classes have stopped. Travel is unsafe, so adults use the school’s planned shelter and contact families. Coastal communities near Guimaras Strait use their own approved hazard plans.','Balik sa babala ng pagsasanay: inanunsiyo ang Signal No. 3. Huminto na ang klase. Mapanganib ang pagbiyahe kaya ginamit ng nakatatanda ang silungan at kinontak ang pamilya. Sariling aprubadong plano ang gamit sa baybayin ng Guimaras Strait.','A change in the warning','Nagbago ang babala'),
 taskDecision(3),taskDecision(4),reflect(1,'storm'),
 scene('chapter-three',2,'storm','mara','The wind grows stronger. Everyone stays in the planned protected room with Ma’am Mara. No outdoor errands now. Sige lang. We can help by following safe steps and caring for one another.','Lumalakas ang hangin. Kasama ni Ma’am Mara ang lahat sa protektadong silid. Wala nang paglabas para sa gamit. Sige lang. Makakatulong ang ligtas na hakbang at pag-aalaga sa isa’t isa.','3 · Response','3 · Pagtugon'),
 taskDecision(5),taskDecision(6),taskDecision(7),taskDecision(8),
 mini('calm-friends','breathe',2,'outage','Bea asks for quiet support. Choose comfortable breathing or notice five things instead. No one has to hold their breath to help the group.','Humingi si Bea ng tahimik na suporta. Pumili ng komportableng paghinga o pagtuon sa limang bagay. Hindi kailangang magpigil ng hininga upang makatulong.'),
 taskDecision(9),
 scene('care-scene',2,'outage','mara','A classmate has a small cut. Ma’am Mara begins care and calls the clinic. You fetch clean supplies and review the adult-led steps using the practice mannequin; children do not touch blood or glass.','May maliit na sugat ang kaklase. Inalagaan siya ni Ma’am Mara at tinawagan ang klinika. Kukuha ka ng malinis na gamit at babalikan ang mga hakbang sa manikin; hindi bata ang hahawak ng dugo o salamin.','Help the adult team','Tulungan ang nakatatanda'),
 mini('help-care','aid',2,'outage','Put the adult-led minor-cut steps in order. Calling an adult and protection come first; bleeding control comes before cleaning.','Ayusin ang hakbang ng nakatatanda sa maliit na sugat. Unahin ang pagtawag at proteksiyon; pigilin ang pagdurugo bago linisin.'),reflect(2,'outage'),
 scene('chapter-four',3,'lull','lino','Lino notices that the wind has become quiet. Ma’am Mara asks the class to stay put. The weather looking better is not an official all clear.','Napansin ni Lino na tahimik na ang hangin. Pinanatili ni Ma’am Mara sa loob ang klase. Hindi opisyal na all clear ang pagbuti ng hitsura ng panahon.','4 · Rehabilitation & Recovery','4 · Rehabilitasyon at Pagbangon'),
 taskDecision(10),
 scene('clearance',3,'recovery','kuya','Later in this exercise, authorities give safety instructions and adults inspect the school. Some areas stay closed, including the fallen-wire area. Children may help only in the approved dry craft space.','Kalaunan sa pagsasanay, nagbigay ng tagubilin ang awtoridad at sinuri ng nakatatanda ang paaralan. Sarado pa rin ang ilang lugar, pati ang may kawad. Sa aprubadong tuyong lugar lamang tutulong ang bata.','Adults check before we return','Susuri muna ang nakatatanda'),
 taskDecision(11),taskDecision(12),
 mini('brigada','cleanup',3,'recovery','Join Brigada Eskwela in the approved dry area. Sort clean teaching cards, assign adult repairs, paint a panel, plant seedlings, and thank the helpers.','Sumali sa Brigada Eskwela sa aprubadong tuyong lugar. Ayusin ang malilinis na kard, italaga sa nakatatanda ang pag-aayos, kulayan ang panel, magtanim, at magpasalamat.'),reflect(3,'recovery'),
 scene('together',3,'recovery','nena','Aling Nena prepares sealed biscocho for the approved food station. Jomar hopes for batchoy and pancit molo another day. Ay, ginhawa! Today, we thank helpers and share what we learned.','Naghanda si Aling Nena ng nakaselyong biscocho sa aprubadong puwesto ng pagkain. Umaasa si Jomar sa batchoy at pancit molo sa ibang araw. Ay, ginhawa! Ngayon, magpasalamat at ibahagi ang natutuhan.','A school ready together','Sama-samang handang paaralan'),
 {id:'ending',type:'ending',chapter:3,weather:'recovery'}
 ];
 const phrases=LE.Data.localPhrases||{ready:'Mag-andam kita.',encourage:'Sige lang.',relief:'Ay, ginhawa!'};
 for(const task of tasks)if(task.text)for(const language of ['en','fil'])task.text[language]=task.text[language].replace('Mag-andam kita.',phrases.ready).replace('Sige lang.',phrases.encourage).replace('Ay, ginhawa!',phrases.relief);
 for(const d of decisions)for(const c of d.choices)if(c.consequence)c.consequence='cons_'+d.id.toLowerCase()+'_'+c.id.toLowerCase();
 LE.Data.typhoon={id:'typhoon-story',storyId:'typhoon',version:1,decisions,tasks,requiredGames:['hazard-walk','pack-bag','calm-friends','help-care','brigada'],
 calmHelp:b('Finishing this story activity adds up to 20 Calm to this run. Comfortable breathing and grounding count equally.','Ang pagtapos sa gawaing ito ay magdaragdag ng hanggang 20 Kalmado sa kuwentong ito. Pareho ang komportableng paghinga at pagtuon sa paligid.'),
 signals:[['1','Strong winds','Malakas na hangin','39–61 km/h'],['2','Gale-force winds','Gale-force winds','62–88 km/h'],['3','Storm-force winds','Storm-force winds','89–117 km/h'],['4','Typhoon-force winds','Typhoon-force winds','118–184 km/h'],['5','Super typhoon-force winds','Super typhoon-force winds','185 km/h or higher']].map(([level,en,fil,range])=>({level,name:b(en,fil),range})),
 teacherNote:b('This is a fictional school exercise, not a current forecast. Confirm the latest PAGASA, DepEd, and local advisories and your approved school plan. Do not wait for Signal No. 3 before taking required action. Children do not repair structures, handle wires, or enter floodwater.','Kathang-isip na pagsasanay ito, hindi kasalukuyang taya ng panahon. Tiyakin ang pinakabagong abiso ng PAGASA, DepEd, at lokal na awtoridad at ang aprubadong plano. Huwag hintayin ang Signal No. 3 bago kumilos ayon sa tuntunin. Hindi bata ang mag-aayos, hahawak ng kawad, o lulusong sa baha.')};
 LE.Data.storyText={
 en:{play:'Play the typhoon story',resume:'Resume the typhoon story',title:'Bagyo at Maliwanag',exercise:'FICTIONAL EXERCISE · NOT A LIVE ADVISORY',pause:'Pause & options',continue:'Continue',titleBack:'Save & title',stories:'Save & stories',settings:'Settings',resumeButton:'Resume',chapter:'Chapter',objective:'Your next step',interact:'Inspect / talk',controls:'Walk: arrows / WASD or D-pad. E / Space: inspect. Click/tap a floor to walk. Esc: pause.',target:'Walk to',where:'You are at',look:'Walk closer to inspect an object.',blocked:'That route is blocked. Try a marked doorway.',missionDone:'Objective recorded. Return to the story.',beginActivity:'Begin this story activity',returnStory:'Continue the story',activity:'Typhoon story activity',miniNote:'This activity belongs to this story run. Studio best scores are kept separately.',unfinishedActivity:'Save activity & return to story menu',read:'Read aloud',time:'Active story time',chapterTime:'Chapter time',decisions:'Decision points',mini:'Activity component',quizPending:'Complete all four chapters, then take the final quiz and match the pillars to earn your full result.',reflection:'What I learned',hero:'Ready for the next chapter',learner:'A short review with Ma’am Mara',tryAgain:'Let’s practise this safer step together',coach:'Review with Ma’am Mara',reviewed:'I understand this safer step',memory:'Remember',allSignals:'Read all five signal cards before continuing.',signalIntro:'Higher numbers warn of stronger wind threats. Listen to official updates and follow current school/local instructions. Wind signals do not describe every flood or coastal hazard.',viewed:'Read',complete:'Four typhoon chapters complete!',finish:'Record the completed chapters',ending:'You helped the class prepare, respond, and recover together.',replay:'Start a new story run',resetNote:'Start this story again? Your studio practice, currency, outfits, and any earned results stay saved. The current typhoon run is replaced.',reset:'Start new run',cancel:'Keep this run',bonus:'Optional buddy-route challenge',bonusDone:'Buddy-route challenge completed',bonusNote:'After adults approve the dry area, practise helping a friend follow a dry route. This optional activity does not add scenario points.',safety:'Safety',calm:'Calm',progress:'Story chapters',storage:'Temporary save only. Keep this tab open.',stale:'The active student changed. Open the story for the current student.',restart:'This story save was incomplete or from another content version. A fresh run was opened.',paused:'Story progress is saved. Movement, timers, and active time are paused.',bag:'Go-Bag',packed:'Packed',noPacked:'Pack the Go-Bag in Chapter 2.',shelter:'Teacher-managed shelter · Outdoor movement is closed',map:'School map',notes:'Story notes',ready:'Four playable chapters, final assessment, results, and rewards are ready.'},
 fil:{play:'Laruin ang kuwento ng bagyo',resume:'Ituloy ang kuwento ng bagyo',title:'Bagyo sa Maliwanag',exercise:'KATHANG-ISIP NA PAGSASANAY · HINDI TUNAY NA ABISO',pause:'Ihinto at mga opsyon',continue:'Magpatuloy',titleBack:'I-save at pamagat',stories:'I-save at mga kuwento',settings:'Mga setting',resumeButton:'Ituloy',chapter:'Kabanata',objective:'Susunod na hakbang',interact:'Suriin / kausapin',controls:'Arrow keys / WASD o D-pad sa paglakad. E / Space sa pagsusuri. Pindutin ang sahig upang lumakad. Esc sa paghinto.',target:'Pumunta sa',where:'Nasa',look:'Lumapit upang suriin ang gamit.',blocked:'May harang. Subukan ang may markang pintuan.',missionDone:'Naitala ang layunin. Bumalik sa kuwento.',beginActivity:'Simulan ang gawain ng kuwento',returnStory:'Ituloy ang kuwento',activity:'Gawain sa kuwento ng bagyo',miniNote:'Bahagi ito ng kasalukuyang kuwento. Hiwalay ang pinakamataas na marka sa studio.',unfinishedActivity:'I-save ang gawain at bumalik sa menu ng kuwento',read:'Basahin nang malakas',time:'Aktibong oras ng kuwento',chapterTime:'Oras sa kabanata',decisions:'Puntos sa pasya',mini:'Bahagi ng mga gawain',quizPending:'Tapusin ang apat na kabanata, saka ang huling pagsusulit at pagtutugma para sa kabuuang resulta.',reflection:'Ang natutuhan ko',hero:'Handa sa susunod na kabanata',learner:'Maikling balik-aral kasama si Ma’am Mara',tryAgain:'Sanayin natin ang ligtas na hakbang',coach:'Balik-aral kasama si Ma’am Mara',reviewed:'Naunawaan ko ang ligtas na hakbang',memory:'Tandaan',allSignals:'Basahin ang limang kard bago magpatuloy.',signalIntro:'Mas malakas na banta ng hangin ang mas mataas na numero. Makinig sa opisyal na balita at sundin ang kasalukuyang tagubilin. Hindi lahat ng baha o panganib sa baybayin ay inilalarawan ng wind signal.',viewed:'Nabasa',complete:'Tapos ang apat na kabanata ng bagyo!',finish:'Itala ang natapos na kabanata',ending:'Tinulungan mo ang klase na maghanda, tumugon, at bumangon.',replay:'Magsimula ng bagong kuwento',resetNote:'Ulitin ang kuwento? Mananatili ang pagsasanay sa studio, salapi, kasuotan, at anumang gantimpala. Papalitan ang kasalukuyang kuwento ng bagyo.',reset:'Simulan ang bagong kuwento',cancel:'Panatilihin ito',bonus:'Opsyonal na hamon sa rutang may kapareha',bonusDone:'Tapos ang hamon sa ruta',bonusNote:'Kapag inaprubahan na ang tuyong lugar, sanaying sumama sa ligtas na ruta ang kaibigan. Walang dagdag na puntos ang opsyonal na gawain.',safety:'Kaligtasan',calm:'Kalmado',progress:'Mga kabanata ng kuwento',storage:'Pansamantalang save lamang. Panatilihing bukas ang tab.',stale:'Nagbago ang mag-aaral. Buksan ang kuwento para sa kasalukuyang mag-aaral.',restart:'Hindi tugma o kulang ang save. Nagbukas ng bagong kuwento.',paused:'Naka-save ang progreso. Nakahinto ang galaw, timer, at aktibong oras.',bag:'Go-Bag',packed:'Nakaimpake',noPacked:'Ihanda ang Go-Bag sa Kabanata 2.',shelter:'Silungang may gabay ng guro · Sarado ang paglalakad sa labas',map:'Mapa ng paaralan',notes:'Mga tala sa kuwento',ready:'Handa na ang apat na kabanata, huling pagsusulit, resulta, at gantimpala.'}
 };
})();

/* Live-map scenario plan. Durations are exercise cues, never real hazard predictions. */
(function(){
 'use strict';const LE=window.LE,b=(en,fil)=>({en,fil}),data=LE.Data.typhoon;
 const goal=(id,map,x,y,en,fil,weather='clear')=>({id,type:'goal',map,x,y,text:b(en,fil),weather});
 const event=(id,duration,weather,en,fil,sfx=[])=>({id,type:'event',duration,weather,title:b(en,fil),text:b(en,fil),sfx});
 const hazards=[
 {
  "id": "roof",
  "name": {
   "en": "Loose roof sheet",
   "fil": "Maluwag na bubong"
  },
  "prop": "roof_sheet",
  "hazard": true,
  "map": "grounds",
  "objectId": "scenario-typhoon-roof",
  "x": 8,
  "y": 8
 },
 {
  "id": "drain",
  "name": {
   "en": "Clogged drain",
   "fil": "Baradong kanal"
  },
  "prop": "clogged_drain",
  "hazard": true,
  "map": "grounds",
  "objectId": "scenario-typhoon-drain",
  "x": 32,
  "y": 14
 },
 {
  "id": "branch",
  "name": {
   "en": "Dead branch over the classroom",
   "fil": "Patay na sanga sa ibabaw ng silid"
  },
  "prop": "branch",
  "hazard": true,
  "map": "grounds",
  "objectId": "scenario-typhoon-branch",
  "x": 29,
  "y": 7
 },
 {
  "id": "sign",
  "name": {
   "en": "Unsecured signboard",
   "fil": "Hindi matibay na karatula"
  },
  "prop": "signboard",
  "hazard": true,
  "map": "hallway",
  "objectId": "scenario-typhoon-sign",
  "x": 31,
  "y": 12
 },
 {
  "id": "latch",
  "name": {
   "en": "Broken window latch",
   "fil": "Sirang trangka ng bintana"
  },
  "prop": "window_latch",
  "hazard": true,
  "map": "classroom",
  "objectId": "scenario-typhoon-latch",
  "x": 35,
  "y": 16
 },
 {
  "id": "exit",
  "name": {
   "en": "Cluttered corridor",
   "fil": "Makalat na pasilyo"
  },
  "prop": "books",
  "hazard": true,
  "map": "hallway",
  "objectId": "scenario-typhoon-exit",
  "x": 12,
  "y": 13
 }
];
 const plan={version:1,hazards,before:{},after:{},overrides:{opening:{weather:'clear',title:b('A normal day at Maliwanag','Karaniwang araw sa Maliwanag'),text:b('Ma’am Mara welcomes the Junior DRRM Club. Today we will prepare, practise, and work together through a fictional disaster exercise. Talk, report hazards, and follow the objective tracker.','Maligayang pagdating sa Junior DRRM Club. Maghahanda, magsasanay, at magtutulungan tayo sa kathang-isip na sakuna. Kausapin ang guro, mag-ulat, at sundin ang mga layunin.')}},chapterSpawns:[{map:'classroom',x:18,y:23},{map:'classroom',x:18,y:13},{map:'classroom',x:18,y:13},{map:'grounds',x:22,y:18}],blockers:[]};
 plan.before['hazard-walk']=[{id:'meet-mara',type:'talk',map:'classroom',npc:'mara',text:b('Talk to Ma’am Mara about the six hazard reports.','Kausapin si Ma’am Mara tungkol sa anim na panganib.'),weather:'clear'}];
 plan.before['pack-bag']=[{id:'reach-bag',type:'goal',map:'classroom',key:'bag',text:b('Walk to the classroom Go-Bag station.','Pumunta sa Go-Bag sa silid.'),weather:'clear'}];
 
 plan.before['warning-change']=[goal('storm-shelter-position','classroom',18,13,'Return to the strong classroom shelter before the wind warning changes.','Bumalik sa matibay na silungan bago magbago ang babala sa hangin.')];
 plan.overrides['chapter-three']={type:'event',duration:2600,weather:'storm',sfx:['alarm'],title:b('The storm reaches the school','Dumating ang bagyo sa paaralan'),text:b('Heavy wind and rain start. Outdoor movement is closed. Stay with Ma’am Mara away from windows.','Nagsimula ang malakas na hangin at ulan. Sarado ang paglabas. Manatili sa guro palayo sa bintana.')};
 plan.before['decision-6']=[event('power-outage',1500,'outage','The lights go out. Use the class flashlight.','Nawalan ng ilaw. Gamitin ang flashlight ng klase.')];
 plan.after['decision-5']=[goal('shelter-center','classroom',18,16,'Move to the marked central shelter spot, away from glass.','Pumunta sa gitnang silungan, palayo sa salamin.','storm')];
 plan.after['decision-7']=[goal('shelter-buddy','classroom',18,19,'Follow the safe indoor aisle to your buddy. Stay clear of wet electrical areas.','Dumaan sa ligtas na pasilyo patungo sa kapareha. Lumayo sa basang kuryente.','outage')];
 plan.before['brigada']=[goal('typhoon-recovery-space','center',18,12,'After adult clearance, follow the dry approved route to the recovery activity.','Pagkatapos ng pahintulot, dumaan sa aprubadong tuyong ruta sa gawain ng pagbangon.','recovery')];
 
 data.director=plan;
})();
