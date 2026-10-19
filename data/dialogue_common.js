/* Editable Stage 3 menu copy. Names are inserted as text, never as HTML. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};LE.Data=LE.Data||{};
  // Editable local expressions. A Hiligaynon-speaking teacher should review them.
  LE.Data.localPhrases={ready:'Mag-andam kita.',encourage:'Sige lang.',relief:'Ay, ginhawa!'};
  LE.Data.profileText={
    en:{
      create:'Create your character',edit:'Edit your character',intro:'You are a Grade 5 student and a new member of the Junior DRRM Club.',
      name:'Your name',nameHint:'Letters only, up to 12 characters. Leave blank to use Bata.',nameLetters:'Use letters only, without numbers, spaces, or punctuation.',nameLength:'Choose a name with 12 letters or fewer.',
      gender:'Gender preference',boy:'Boy',girl:'Girl',unspecified:'Prefer not to say',spriteSet:'Hair style set',short:'Short styles',long:'Long styles',
      skin:'Skin tone',tone:'Tone',hair:'Hair style',hairColor:'Hair color',black:'Black',brown:'Brown',chestnut:'Chestnut',blue:'Blue-black',
      short0:'Cropped',short1:'Side part',short2:'Curly',long0:'Bob',long1:'Ponytail',long2:'Twin tails',
      facing:'Preview direction',down:'Down',left:'Left',right:'Right',up:'Up',idle:'Idle',walk:'Walk',
      uniform:'Your school uniform',draft:'Preview changes are not saved until you select Save character.',save:'Save character',cancel:'Back',
      saved:'Character saved.',temporary:'Your character is ready, but this browser can only keep it during this open session.',
      profileChanged:'The active save slot changed. Return to the title and choose your slot again.',
      choose:'Choose your story',chooseIntro:'Four stories. Four ways to practise safer choices together.',
      profile:'Student profile',slot:'Slot',switchSlot:'Switch slot',editProfile:'Edit character',selected:'Selected',select:'Choose this story',details:'View selected story',
      notPlayed:'Not played',noStars:'No stars earned yet',best:'Best score',completed:'Completed',of:'of',pillars:'pillars completed',
      planned:'Full story: Stage {stage}',ready:'Your story is selected',storySaved:'This choice is saved. You can change it from the story menu.',
      stageNotice:'All four stories include a final quiz, results, rewards, and certificates.',
      backStories:'Back to stories',backTitle:'Back to title',meet:'Meet Ma’am Mara',chapter:'Chapter',notStarted:'Selecting a story does not start a mission or award points.',
      teacherTitle:'Ma’am Mara · Welcome to the club',teacherWelcome:'Hello, {name}! I’m Ma’am Mara. Welcome to our Junior DRRM Club at Maliwanag Elementary in Iloilo. Mag-andam kita! We will learn and practise together.',
      storyIntro:'{name}, our {story} story will take us through all four DRRM pillars. We can explore the school with our classmates now. The typhoon, flood, earthquake, and tsunami chapters are ready.',
      skinHelp:'Choose the skin tone you prefer.',hairHelp:'Each style has a four-direction walking animation.',
      starLabel:'Safety stars',status:'Story status',motion:'Reduced motion is on. The preview shows a still pose.',preview:'Your character, standing and walking',
      pillarsIntro:'Every story follows these four chapters.',unknownDisaster:'Choose one of the four stories.',createFirst:'Save your character first.'
    },
    fil:{
      create:'Likhain ang iyong karakter',edit:'Baguhin ang iyong karakter',intro:'Isa kang mag-aaral sa Grade 5 at bagong kasapi ng Junior DRRM Club.',
      name:'Iyong pangalan',nameHint:'Titik lamang, hanggang 12 karakter. Iwang blangko para gamitin ang Bata.',nameLetters:'Titik lamang. Huwag gumamit ng numero, puwang, o bantas.',nameLength:'Pumili ng pangalang may hanggang 12 titik.',
      gender:'Kasarian',boy:'Lalaki',girl:'Babae',unspecified:'Mas nais kong hindi sabihin',spriteSet:'Pangkat ng estilo ng buhok',short:'Maiikling estilo',long:'Mahahabang estilo',
      skin:'Kulay ng balat',tone:'Kulay',hair:'Estilo ng buhok',hairColor:'Kulay ng buhok',black:'Itim',brown:'Kayumanggi',chestnut:'Chestnut',blue:'Asul-itim',
      short0:'Maikli',short1:'Hati sa gilid',short2:'Kulot',long0:'Bob',long1:'Nakatali',long2:'Dalawang tali',
      facing:'Direksyon sa preview',down:'Pababa',left:'Pakaliwa',right:'Pakanan',up:'Pataas',idle:'Nakatayo',walk:'Naglalakad',
      uniform:'Ang iyong uniporme sa paaralan',draft:'Hindi naka-save ang mga pagbabago hangga’t hindi pinipili ang I-save ang karakter.',save:'I-save ang karakter',cancel:'Bumalik',
      saved:'Naka-save na ang karakter.',temporary:'Handa na ang karakter, ngunit sa bukas na session lamang ito maitatago ng browser.',
      profileChanged:'Nagbago ang aktibong save slot. Bumalik sa pamagat at piliin muli ang iyong slot.',
      choose:'Piliin ang iyong kuwento',chooseIntro:'Apat na kuwento. Sama-samang magsanay ng ligtas na pagpapasya.',
      profile:'Profile ng mag-aaral',slot:'Slot',switchSlot:'Palitan ang slot',editProfile:'Baguhin ang karakter',selected:'Napili',select:'Piliin ang kuwentong ito',details:'Tingnan ang napiling kuwento',
      notPlayed:'Hindi pa nalaro',noStars:'Wala pang bituin',best:'Pinakamataas na puntos',completed:'Natapos',of:'sa',pillars:'natapos na haligi',
      planned:'Buong kuwento: Yugto {stage}',ready:'Napili na ang iyong kuwento',storySaved:'Naka-save ang pagpili. Maaari mo itong baguhin sa menu ng kuwento.',
      stageNotice:'May apat na kabanata, huling pagsusulit, resulta, gantimpala, at sertipiko ang bawat kuwento.',
      backStories:'Bumalik sa mga kuwento',backTitle:'Bumalik sa pamagat',meet:'Kilalanin si Ma’am Mara',chapter:'Kabanata',notStarted:'Hindi nagsisimula ng misyon o nagbibigay ng puntos ang pagpili ng kuwento.',
      teacherTitle:'Ma’am Mara · Maligayang pagdating',teacherWelcome:'Kumusta, {name}! Ako si Ma’am Mara. Maligayang pagdating sa Junior DRRM Club ng Maliwanag Elementary sa Iloilo. Mag-andam kita! Sama-sama tayong matututo at magsasanay.',
      storyIntro:'{name}, dadaan sa apat na haligi ng DRRM ang ating kuwentong {story}. Maaari na tayong maglibot sa paaralan kasama ang mga kaklase. Handa na ang mga kabanata ng bagyo, baha, lindol, at tsunami.',
      skinHelp:'Piliin ang kulay ng balat na gusto mo.',hairHelp:'May paggalaw sa apat na direksyon ang bawat estilo.',
      starLabel:'Mga bituin',status:'Kalagayan ng kuwento',motion:'Naka-on ang bawas-galaw. Nakatigil ang karakter sa preview.',preview:'Ang iyong karakter habang nakatayo at naglalakad',
      pillarsIntro:'May apat na kabanata ang bawat kuwento.',unknownDisaster:'Pumili sa apat na kuwento.',createFirst:'I-save muna ang iyong karakter.'
    }
  };
})();
