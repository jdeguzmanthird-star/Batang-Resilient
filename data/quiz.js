/* Editable final assessment bank: 20 questions and 8 pillar actions per disaster. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};LE.Data=LE.Data||{};
 LE.Data.quiz={
 "typhoon": [
  {
   "id": "typhoon-q1",
   "pillar": "prevention",
   "text": {
    "en": "You see garbage clogging the canal before the storm. What will you do?",
    "fil": "Bago ang bagyo, nakita mong may basura sa kanal. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Ignore it.",
     "fil": "Pabayaan ito."
    },
    {
     "en": "Tell the teacher. Help only with an approved, dry cleanup task; adults clear the drain.",
     "fil": "Sabihin sa guro. Tumulong lang sa aprubadong tuyong gawain; nakatatanda ang maglilinis ng kanal."
    },
    {
     "en": "Throw more trash into it.",
     "fil": "Dagdagan pa ang basura."
    }
   ],
   "best": 1,
   "why": {
    "en": "A blocked drain can keep rainwater from flowing away. Tell an adult where the blockage is. Children stay out of drains and dirty water.",
    "fil": "Maaaring maipon ang ulan kapag barado ang kanal. Sabihin sa nakatatanda kung nasaan ang bara. Lalayo ang mga bata sa kanal at maruming tubig."
   }
  },
  {
   "id": "typhoon-q2",
   "pillar": "prevention",
   "text": {
    "en": "A branch leans over the classroom roof. What is the safest help?",
    "fil": "May nakasangang kahoy sa ibabaw ng bubong ng silid. Ano ang pinakaligtas na tulong?"
   },
   "choices": [
    {
     "en": "Climb up to cut it.",
     "fil": "Umakyat upang putulin ito."
    },
    {
     "en": "Report it so trained adults can trim it safely.",
     "fil": "Iulat ito upang ligtas na maputol ng sanay na nakatatanda."
    },
    {
     "en": "Shake the branch.",
     "fil": "Alugin ang sanga."
    }
   ],
   "best": 1,
   "why": {
    "en": "A branch may fall or break without warning. Stay clear and report it. Trained adults choose how to trim it safely.",
    "fil": "Maaaring mabali o mahulog ang sanga nang biglaan. Lumayo at iulat ito. Sanay na nakatatanda ang pipili ng ligtas na paraan ng pagputol."
   }
  },
  {
   "id": "typhoon-q3",
   "pillar": "preparedness",
   "text": {
    "en": "In this fictional exercise, the radio announces Wind Signal No. 3. Classes have stopped. What will you do?",
    "fil": "Sa kathang-isip na pagsasanay, inanunsiyo ang Wind Signal No. 3. Huminto na ang klase. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Go outside to look at the storm.",
     "fil": "Lumabas upang tingnan ang bagyo."
    },
    {
     "en": "Follow the teacher to the planned shelter, away from windows, and listen for updates.",
     "fil": "Sundin ang guro sa nakaplanong silungan, malayo sa bintana, at makinig sa balita."
    },
    {
     "en": "Walk home alone.",
     "fil": "Umuwi nang mag-isa."
    }
   ],
   "best": 1,
   "why": {
    "en": "Follow the school’s approved plan and the adults caring for your class. Stay away from glass in the chosen shelter. Do not set off alone.",
    "fil": "Sundin ang aprubadong plano at ang nakatatandang nag-aalaga sa klase. Lumayo sa salamin sa napiling silungan. Huwag umalis nang mag-isa."
   }
  },
  {
   "id": "typhoon-q4",
   "pillar": "preparedness",
   "text": {
    "en": "Jomar wants to share videos instead of listening to the radio. What will you do?",
    "fil": "Gustong magbahagi ni Jomar ng video sa halip na makinig sa radyo. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Join him and ignore the update.",
     "fil": "Sumali at huwag pansinin ang balita."
    },
    {
     "en": "Save phone battery for needed contact and listen to official updates.",
     "fil": "Tipirin ang baterya para sa mahalagang kontak at makinig sa opisyal na balita."
    },
    {
     "en": "Charge the phone beside a wet area.",
     "fil": "Mag-charge sa tabi ng basang lugar."
    }
   ],
   "best": 1,
   "why": {
    "en": "Official updates help adults make safe plans. Keep devices dry and save battery for needed contact. Ask the teacher before using a charger.",
    "fil": "Tumutulong ang opisyal na balita sa ligtas na plano ng nakatatanda. Panatilihing tuyo ang gamit at tipirin ang baterya. Magtanong sa guro bago mag-charge."
   }
  },
  {
   "id": "typhoon-q5",
   "pillar": "response",
   "text": {
    "en": "Strong wind rattles the windows. What will you do?",
    "fil": "Pinapakalampag ng malakas na hangin ang bintana. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Stand close to the glass to watch.",
     "fil": "Tumayo malapit sa salamin upang manood."
    },
    {
     "en": "Move away from glass and follow the teacher to the protected part of the room.",
     "fil": "Lumayo sa salamin at sumunod sa guro sa protektadong bahagi ng silid."
    },
    {
     "en": "Open the window to equalize pressure.",
     "fil": "Buksan ang bintana upang pantayin ang presyon."
    }
   ],
   "best": 1,
   "why": {
    "en": "Wind and flying objects can break glass. Stay in the protected area the teacher chose. Adults handle shutters only when it is safe.",
    "fil": "Maaaring mabasag ang salamin dahil sa hangin at lumilipad na bagay. Manatili sa protektadong lugar na pinili ng guro. Nakatatanda ang bahala sa shutter kung ligtas."
   }
  },
  {
   "id": "typhoon-q6",
   "pillar": "response",
   "text": {
    "en": "The lights go out. What should the class use?",
    "fil": "Namatay ang ilaw. Ano ang dapat gamitin ng klase?"
   },
   "choices": [
    {
     "en": "A candle and matches.",
     "fil": "Kandila at posporo."
    },
    {
     "en": "A flashlight or battery emergency light.",
     "fil": "Flashlight o de-bateryang emergency light."
    },
    {
     "en": "No light; wander around in the dark.",
     "fil": "Walang ilaw; gumala sa dilim."
    }
   ],
   "best": 1,
   "why": {
    "en": "A battery light helps you see without an open flame. Stay together and keep the path clear. Ask an adult to check any electrical problem.",
    "fil": "Makakakita ka gamit ang de-bateryang ilaw nang walang apoy. Magsama-sama at panatilihing maluwag ang daan. Ipasuri sa nakatatanda ang problema sa kuryente."
   }
  },
  {
   "id": "typhoon-q7",
   "pillar": "response",
   "text": {
    "en": "Rain leaks near an electrical outlet. What will you do?",
    "fil": "May tumutulong ulan malapit sa saksakan. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Touch the outlet to dry it.",
     "fil": "Hawakan ang saksakan upang patuyuin."
    },
    {
     "en": "Stay well away and tell the teacher.",
     "fil": "Lumayo nang mabuti at magsabi sa guro."
    },
    {
     "en": "Pour water on it.",
     "fil": "Buhusan ito ng tubig."
    }
   ],
   "best": 1,
   "why": {
    "en": "Wet electrical equipment can be dangerous. Stay away from the outlet, wires, and nearby water. Tell an adult; children do not touch switches or try repairs.",
    "fil": "Mapanganib ang basang gamit na de-kuryente. Lumayo sa saksakan, kawad, at tubig sa paligid. Magsabi sa nakatatanda; hindi bata ang hahawak sa switch o mag-aayos."
   }
  },
  {
   "id": "typhoon-q8",
   "pillar": "response",
   "text": {
    "en": "Bea is crying and scared. What can you do?",
    "fil": "Umiiyak at natatakot si Bea. Ano ang maaari mong gawin?"
   },
   "choices": [
    {
     "en": "Laugh at her.",
     "fil": "Tawanan siya."
    },
    {
     "en": "Stay kindly nearby, listen, and ask the teacher to help her feel supported.",
     "fil": "Manatili nang mabait sa malapit, makinig, at humingi ng tulong sa guro."
    },
    {
     "en": "Leave her alone without telling an adult.",
     "fil": "Iwan siya nang walang paalam sa nakatatanda."
    }
   ],
   "best": 1,
   "why": {
    "en": "Feelings can differ during a storm. Listen kindly without forcing Bea to talk. A trusted adult can help both of you find support.",
    "fil": "Maaaring magkaiba ang damdamin sa bagyo. Makinig nang mabuti nang hindi pinipilit si Bea. Makakatulong ang pinagkakatiwalaang nakatatanda sa inyong dalawa."
   }
  },
  {
   "id": "typhoon-q9",
   "pillar": "response",
   "text": {
    "en": "Jomar wants to run onto the field for his bag. What will you do?",
    "fil": "Gustong tumakbo ni Jomar sa bakuran para sa bag. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Follow him outside.",
     "fil": "Sundan siya sa labas."
    },
    {
     "en": "Ask him to stay and tell the teacher immediately.",
     "fil": "Hilinging manatili siya at sabihin agad sa guro."
    },
    {
     "en": "Throw him an umbrella so he can go.",
     "fil": "Hagisan siya ng payong upang makalabas."
    }
   ],
   "best": 1,
   "why": {
    "en": "Strong wind can carry dangerous objects. Belongings can wait. Ask Jomar to stay in shelter and get the teacher’s help.",
    "fil": "Maaaring tangayin ng hangin ang mapanganib na bagay. Makapaghihintay ang gamit. Hilinging manatili si Jomar sa silungan at humingi ng tulong sa guro."
   }
  },
  {
   "id": "typhoon-q10",
   "pillar": "recovery",
   "text": {
    "en": "The wind becomes quiet. Is it time to leave?",
    "fil": "Humina at tumahimik ang hangin. Maaari na bang umalis?"
   },
   "choices": [
    {
     "en": "Run outside now.",
     "fil": "Tumakbo na sa labas."
    },
    {
     "en": "Stay with the teacher and wait for official safety instructions.",
     "fil": "Manatili sa guro at hintayin ang opisyal na tagubilin sa kaligtasan."
    },
    {
     "en": "Walk home alone.",
     "fil": "Umuwi nang mag-isa."
    }
   ],
   "best": 1,
   "why": {
    "en": "A calm spell does not prove the storm is over. Strong wind may return, including after the eye passes. Stay sheltered until authorities and the school give safe instructions.",
    "fil": "Hindi patunay ang katahimikan na tapos na ang bagyo. Maaaring bumalik ang hangin, pati matapos dumaan ang mata nito. Manatili sa silungan hanggang magbigay ng ligtas na tagubilin ang awtoridad at paaralan."
   }
  },
  {
   "id": "typhoon-q11",
   "pillar": "recovery",
   "text": {
    "en": "Adults report fallen wires outside. What should you do?",
    "fil": "Iniulat ng nakatatanda na may bumagsak na kawad sa labas. Ano ang dapat mong gawin?"
   },
   "choices": [
    {
     "en": "Touch a wire with a stick.",
     "fil": "Hawakan gamit ang patpat."
    },
    {
     "en": "Stay well back and ask adults to report it to the proper utility or authorities.",
     "fil": "Lumayo nang mabuti at ipauulat sa nakatatanda sa tamang utility o awtoridad."
    },
    {
     "en": "Go close for a photograph.",
     "fil": "Lumapit para kumuha ng larawan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not touch fallen wires or objects beside them. Keep away and tell an adult. Only authorized workers can make electrical hazards safe.",
    "fil": "Huwag hawakan ang bumagsak na kawad o bagay sa tabi nito. Lumayo at magsabi sa nakatatanda. Awtorisadong manggagawa lamang ang mag-aalis ng panganib sa kuryente."
   }
  },
  {
   "id": "typhoon-q12",
   "pillar": "recovery",
   "text": {
    "en": "Adults inspect a classroom that was flooded and approve a dry, safe craft area. How may students help?",
    "fil": "Sinuri ng nakatatanda ang binahang silid at nagtakda ng tuyo at ligtas na lugar. Paano tutulong ang mag-aaral?"
   },
   "choices": [
    {
     "en": "Join only approved tasks with adult supervision and the protection they require.",
     "fil": "Sumali lang sa aprubadong gawain na may gabay at kailangang proteksiyon."
    },
    {
     "en": "Walk barefoot through mud and debris.",
     "fil": "Maglakad nang nakapaa sa putik at kalat."
    },
    {
     "en": "Drink water from a puddle.",
     "fil": "Uminom ng tubig mula sa lusak."
    }
   ],
   "best": 0,
   "why": {
    "en": "Adults first check the area and choose safe tasks for children. Stay out of floodwater and hazardous debris. Follow their instructions about footwear, gloves, and other protection.",
    "fil": "Susuriin muna ng nakatatanda ang lugar at pipili ng ligtas na gawain para sa bata. Lumayo sa baha at mapanganib na kalat. Sundin ang tagubilin sa sapatos, guwantes, at ibang proteksiyon."
   }
  },
  {
   "id": "typhoon-q13",
   "pillar": "prevention",
   "text": {
    "en": "Which task belongs to prevention?",
    "fil": "Alin ang pag-iwas sa panganib?"
   },
   "choices": [
    {
     "en": "Report a loose roof before storm season.",
     "fil": "Iulat ang maluwag na bubong bago ang bagyo."
    },
    {
     "en": "Pack after the storm arrives.",
     "fil": "Mag-impake pagdating ng bagyo."
    },
    {
     "en": "Wait beside a window.",
     "fil": "Maghintay sa tabi ng bintana."
    }
   ],
   "best": 0,
   "why": {
    "en": "Reporting a loose roof early lets trained adults reduce danger.",
    "fil": "Sa maagang pag-uulat, maaayos ng mga sinanay na adulto ang panganib."
   }
  },
  {
   "id": "typhoon-q14",
   "pillar": "prevention",
   "text": {
    "en": "Who should trim a damaged high branch?",
    "fil": "Sino ang dapat magputol ng sirang mataas na sanga?"
   },
   "choices": [
    {
     "en": "A child on a chair",
     "fil": "Bata sa ibabaw ng upuan"
    },
    {
     "en": "Trained adults with safe equipment",
     "fil": "Mga sinanay na adulto na may ligtas na kagamitan"
    },
    {
     "en": "Friends pulling it",
     "fil": "Magkakaibigang humihila rito"
    }
   ],
   "best": 1,
   "why": {
    "en": "Report the branch. Children stay away from falling branches.",
    "fil": "Iulat ang sanga. Lumayo ang mga bata sa maaaring mahulog."
   }
  },
  {
   "id": "typhoon-q15",
   "pillar": "preparedness",
   "text": {
    "en": "What does a wind signal describe?",
    "fil": "Ano ang inilalarawan ng wind signal?"
   },
   "choices": [
    {
     "en": "The water depth in every street",
     "fil": "Lalim ng tubig sa bawat kalsada"
    },
    {
     "en": "The exact time a roof will break",
     "fil": "Eksaktong oras ng pagkasira ng bubong"
    },
    {
     "en": "The expected wind threat in an area",
     "fil": "Inaasahang panganib ng hangin sa isang lugar"
    }
   ],
   "best": 2,
   "why": {
    "en": "PAGASA wind signals describe wind threats. Rainfall and flood warnings also need attention.",
    "fil": "Tungkol sa hangin ang wind signals ng PAGASA. Pakinggan din ang babala sa ulan at baha."
   }
  },
  {
   "id": "typhoon-q16",
   "pillar": "preparedness",
   "text": {
    "en": "Which is a preparedness activity?",
    "fil": "Alin ang gawain sa paghahanda?"
   },
   "choices": [
    {
     "en": "Practise the school emergency plan.",
     "fil": "Magsanay sa planong pang-emergency ng paaralan."
    },
    {
     "en": "Inspect a roof during strong winds.",
     "fil": "Suriin ang bubong habang malakas ang hangin."
    },
    {
     "en": "Share an unverified storm post.",
     "fil": "Ibahagi ang di-tiyak na post sa bagyo."
    }
   ],
   "best": 0,
   "why": {
    "en": "A drill before danger helps the class remember the plan.",
    "fil": "Nakatutulong ang pagsasanay bago ang panganib upang matandaan ang plano."
   }
  },
  {
   "id": "typhoon-q17",
   "pillar": "response",
   "text": {
    "en": "What should you do during a power outage?",
    "fil": "Ano ang gagawin kapag nawalan ng kuryente?"
   },
   "choices": [
    {
     "en": "Wander alone.",
     "fil": "Gumala nang mag-isa."
    },
    {
     "en": "Use a flashlight with the class.",
     "fil": "Gumamit ng flashlight kasama ang klase."
    },
    {
     "en": "Use matches near curtains.",
     "fil": "Magsindi ng posporo malapit sa kurtina."
    }
   ],
   "best": 1,
   "why": {
    "en": "A flashlight gives light without an open flame. Stay with your teacher.",
    "fil": "May liwanag ang flashlight nang walang apoy. Manatili kasama ang guro."
   }
  },
  {
   "id": "typhoon-q18",
   "pillar": "response",
   "text": {
    "en": "Which update should guide the class?",
    "fil": "Aling ulat ang dapat sundin ng klase?"
   },
   "choices": [
    {
     "en": "An old screenshot",
     "fil": "Lumang screenshot"
    },
    {
     "en": "A rumor in a game chat",
     "fil": "Tsismis sa game chat"
    },
    {
     "en": "Current official updates and the school plan",
     "fil": "Kasalukuyang opisyal na ulat at plano ng paaralan"
    }
   ],
   "best": 2,
   "why": {
    "en": "Listen to current official guidance through the teacher. Old posts may no longer apply.",
    "fil": "Pakinggan ang kasalukuyang opisyal na gabay sa guro. Maaaring luma na ang ibang post."
   }
  },
  {
   "id": "typhoon-q19",
   "pillar": "recovery",
   "text": {
    "en": "Which activity belongs to recovery?",
    "fil": "Alin ang gawain sa pagbangon?"
   },
   "choices": [
    {
     "en": "Make thank-you cards in a cleared safe space.",
     "fil": "Gumawa ng pasasalamat sa ligtas na lugar na pinayagan."
    },
    {
     "en": "Test fallen wires.",
     "fil": "Subukan ang bumagsak na kawad."
    },
    {
     "en": "Return before clearance.",
     "fil": "Bumalik nang wala pang pahintulot."
    }
   ],
   "best": 0,
   "why": {
    "en": "Recovery includes safe community help and emotional support. Adults handle dangerous repairs.",
    "fil": "Kasama sa pagbangon ang ligtas na pagtulong at pagdamay. Adulto ang gumagawa ng mapanganib na pagkukumpuni."
   }
  },
  {
   "id": "typhoon-q20",
   "pillar": "recovery",
   "text": {
    "en": "A friend is still worried after the storm. What helps?",
    "fil": "Nag-aalala pa ang kaibigan matapos ang bagyo. Ano ang makatutulong?"
   },
   "choices": [
    {
     "en": "Tease them.",
     "fil": "Asarin siya."
    },
    {
     "en": "Listen kindly and ask a trusted adult for support.",
     "fil": "Makinig nang mabuti at humingi ng suporta sa pinagkakatiwalaang adulto."
    },
    {
     "en": "Tell them to hide their feelings.",
     "fil": "Sabihing itago ang damdamin."
    }
   ],
   "best": 1,
   "why": {
    "en": "People recover at different speeds. Kind listening and trusted adults can help.",
    "fil": "Magkakaiba ang bilis ng pagbangon. Nakatutulong ang pakikinig at mga pinagkakatiwalaang adulto."
   }
  }
 ],
 "flood": [
  {
   "id": "flood-q1",
   "pillar": "prevention",
   "text": {
    "en": "Your friends are throwing candy wrappers into the canal. What will you do?",
    "fil": "Nagtatapon ng balat ng kendi sa kanal ang mga kaibigan mo. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Join them.",
     "fil": "Sumali sa kanila."
    },
    {
     "en": "Use the bin and remind them that trash blocks drainage. Report rubbish in the canal to an adult.",
     "fil": "Gamitin ang basurahan at ipaalalang bumabara ang basura. Iulat sa nakatatanda ang basura sa kanal."
    },
    {
     "en": "Walk away without telling anyone.",
     "fil": "Umalis nang walang sinasabihan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Keep your own litter in the proper bin. Ask friends to do the same. Adults clear drains; children never reach into them.",
    "fil": "Ilagay ang sariling basura sa tamang basurahan. Paalalahanan din ang kaibigan. Nakatatanda ang maglilinis ng kanal; hindi bata ang aabot dito."
   }
  },
  {
   "id": "flood-q2",
   "pillar": "prevention",
   "text": {
    "en": "The garden club wants to care for the bare riverbank. Which plan helps?",
    "fil": "Nais alagaan ng garden club ang kalbong pampang. Aling plano ang makatutulong?"
   },
   "choices": [
    {
     "en": "Ask adults to assess suitable trees or vetiver and choose a safe planting site.",
     "fil": "Ipasuri sa nakatatanda ang angkop na puno o vetiver at ligtas na taniman."
    },
    {
     "en": "Cut all remaining plants.",
     "fil": "Putulin ang lahat ng natitirang halaman."
    },
    {
     "en": "Pave everything without an assessment.",
     "fil": "Sementuhan ang lahat nang walang pagsusuri."
    }
   ],
   "best": 0,
   "why": {
    "en": "Suitable vegetation can help hold soil and slow runoff. Adults assess the riverbank; children plant only in an approved dry garden. Plants do not stop every flood.",
    "fil": "Makatutulong ang angkop na halaman sa pagkapit ng lupa at pagbagal ng agos. Nakatatanda ang susuri sa pampang; sa aprubadong tuyong hardin lamang magtatanim ang bata. Hindi napipigil ng halaman ang lahat ng baha."
   }
  },
  {
   "id": "flood-q3",
   "pillar": "preparedness",
   "text": {
    "en": "The exercise radio announces an Orange rainfall warning. What will you do?",
    "fil": "Nag-anunsiyo ang radyo ng pagsasanay ng Orange rainfall warning. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Keep playing near the river.",
     "fil": "Maglaro pa malapit sa ilog."
    },
    {
     "en": "Listen to the teacher, review the approved dry route, and help move light valuables higher only if safe.",
     "fil": "Makinig sa guro, balikan ang aprubadong tuyong ruta, at tumulong sa pag-angat ng magaan na gamit kung ligtas."
    },
    {
     "en": "Try swimming outside.",
     "fil": "Subukang lumangoy sa labas."
    }
   ],
   "best": 1,
   "why": {
    "en": "Orange calls for preparedness because flooding threatens. Follow current official instructions early. Never delay evacuation to collect belongings.",
    "fil": "Paghahanda ang kailangan sa Orange dahil nagbabanta ang baha. Sundin nang maaga ang kasalukuyang opisyal na tagubilin. Huwag ipagpaliban ang paglikas para sa gamit."
   }
  },
  {
   "id": "flood-q4",
   "pillar": "preparedness",
   "text": {
    "en": "Where should your emergency contacts be kept?",
    "fil": "Saan dapat nakatago ang mga kontak sa emerhensiya?"
   },
   "choices": [
    {
     "en": "On an ID/contact card protected inside the Go-Bag.",
     "fil": "Sa ID o kard ng mga kontak na protektado sa Go-Bag."
    },
    {
     "en": "Nowhere; I will remember everything.",
     "fil": "Wala; tatandaan ko na lang lahat."
    },
    {
     "en": "In an uncovered notebook left in the rain.",
     "fil": "Sa bukas na kuwadernong naiwan sa ulan."
    }
   ],
   "best": 0,
   "why": {
    "en": "Keep a paper contact card protected from water. With an adult, check the school and family numbers. Share your location clearly in a real emergency.",
    "fil": "Protektahan sa tubig ang papel na kard. Tiyakin kasama ang nakatatanda ang numero ng paaralan at pamilya. Sabihin nang malinaw ang lokasyon sa tunay na emerhensiya."
   }
  },
  {
   "id": "flood-q5",
   "pillar": "response",
   "text": {
    "en": "Water is entering the lower school grounds. The teacher gives an evacuation instruction. Where do you go?",
    "fil": "Pumapasok ang tubig sa mababang bakuran. Nagbigay ng tagubilin sa paglikas ang guro. Saan ka pupunta?"
   },
   "choices": [
    {
     "en": "To the basement.",
     "fil": "Sa basement."
    },
    {
     "en": "With the teacher by the checked dry route to the school-designated safe upper assembly area.",
     "fil": "Kasama ang guro sa nasuring tuyong ruta patungo sa itinakdang ligtas na pagtitipunan sa itaas."
    },
    {
     "en": "Stay alone at the doorway near the water.",
     "fil": "Manatiling mag-isa sa pintuang malapit sa tubig."
    }
   ],
   "best": 1,
   "why": {
    "en": "Use the destination and dry route approved for this school and this hazard. If a route becomes wet or blocked, stop in a safe dry place and tell the teacher. Not every upper floor is a safe shelter.",
    "fil": "Gamitin ang lugar at tuyong rutang aprubado sa paaralan at panganib na ito. Kung nabasa o naharangan ang ruta, huminto sa ligtas na tuyong lugar at magsabi sa guro. Hindi lahat ng itaas na palapag ay ligtas."
   }
  },
  {
   "id": "flood-q6",
   "pillar": "response",
   "text": {
    "en": "The teacher notices water close to low electrical sockets. What should students do?",
    "fil": "Napansin ng guro ang tubig malapit sa mababang saksakan. Ano ang gagawin ng mga bata?"
   },
   "choices": [
    {
     "en": "Stay away and tell adults. Only authorized adults arrange power isolation if it is safe.",
     "fil": "Lumayo at magsabi. Awtorisadong nakatatanda lamang ang bahala sa pagputol ng kuryente kung ligtas."
    },
    {
     "en": "Unplug wet appliances ourselves.",
     "fil": "Tanggalin mismo ang basang saksak."
    },
    {
     "en": "Go near the sockets to watch.",
     "fil": "Lumapit upang manood."
    }
   ],
   "best": 0,
   "why": {
    "en": "Water near electricity can be deadly. Children touch no plugs, switches, wires, or nearby water. Tell the teacher from a dry safe place; the adult arranges qualified help.",
    "fil": "Maaaring ikamatay ang tubig na malapit sa kuryente. Hindi hahawak ang bata ng saksak, switch, kawad, o tubig sa paligid. Magsabi mula sa tuyong ligtas na lugar; nakatatanda ang hihingi ng sanay na tulong."
   }
  },
  {
   "id": "flood-q7",
   "pillar": "response",
   "text": {
    "en": "The usual hallway is flooded. What is the safest next step?",
    "fil": "Baha ang karaniwang pasilyo. Ano ang pinakaligtas na susunod na hakbang?"
   },
   "choices": [
    {
     "en": "Wade barefoot through it.",
     "fil": "Lumusong nang nakapaa."
    },
    {
     "en": "Stop on dry ground and ask the teacher for a checked dry alternative; wait safely if none is available.",
     "fil": "Huminto sa tuyo at humingi sa guro ng nasuring tuyong alternatibo; ligtas na maghintay kung wala."
    },
    {
     "en": "Ride a basin through it.",
     "fil": "Sumakay sa palanggana."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not enter floodwater. Depth, current, hidden holes, contamination, and electricity can be hard to judge. Boots or a rope do not make a flooded crossing safe. Adults arrange rescue if needed.",
    "fil": "Huwag lumusong sa baha. Mahirap tantiyahin ang lalim, agos, butas, dumi, at kuryente. Hindi ginagawang ligtas ng bota o lubid ang pagtawid. Nakatatanda ang mag-aayos ng pagsagip kung kailangan."
   }
  },
  {
   "id": "flood-q8",
   "pillar": "response",
   "text": {
    "en": "From a protected dry area, you see a child being swept toward a drain. What do you do?",
    "fil": "Mula sa protektadong tuyong lugar, may nakita kang batang tinatangay papunta sa kanal. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Jump into the water.",
     "fil": "Tumalon sa tubig."
    },
    {
     "en": "Shout for the teacher and trained rescuers, point out the location, and stay safely back.",
     "fil": "Sumigaw para sa guro at sanay na tagasagip, ituro ang lokasyon, at manatiling malayo."
    },
    {
     "en": "Say nothing.",
     "fil": "Manahimik."
    }
   ],
   "best": 1,
   "why": {
    "en": "Call adults immediately. “Reach or throw, don’t go” means never enter to rescue. Trained adults decide whether equipment can be used from a secure place; children do not improvise rope rescues or human chains in water.",
    "fil": "Tumawag agad ng nakatatanda. Ang “reach or throw, don’t go” ay huwag lumusong para sumagip. Sanay na nakatatanda ang magpapasya kung ligtas ang gamit mula sa matatag na lugar; hindi bata ang gagawa ng pagsagip gamit ang lubid o kadena ng tao sa tubig."
   }
  },
  {
   "id": "flood-q9",
   "pillar": "response",
   "text": {
    "en": "A classmate is cold in rain-soaked clothes after reaching the dry shelter. What helps?",
    "fil": "Nilalamig ang kaklaseng basa sa ulan matapos makarating sa tuyong silungan. Ano ang makatutulong?"
   },
   "choices": [
    {
     "en": "Keep the wet clothes on without telling anyone.",
     "fil": "Huwag magpalit at huwag magsabi."
    },
    {
     "en": "Tell the teacher; provide privacy, dry clothes, warmth, and safe drinking water.",
     "fil": "Magsabi sa guro; magbigay ng pribadong lugar, tuyong damit, init, at ligtas na inuming tubig."
    },
    {
     "en": "Give floodwater to drink.",
     "fil": "Painumin ng baha."
    }
   ],
   "best": 1,
   "why": {
    "en": "Ask an adult to help your classmate get dry and comfortable. Use sealed safe drinking water. Adults seek medical help for illness, injury, or worrying symptoms.",
    "fil": "Humingi ng tulong upang maging tuyo at komportable ang kaklase. Ligtas na nakaselyong tubig ang inumin. Hihingi ng medikal na tulong ang nakatatanda sa karamdaman, pinsala, o nakababahalang sintomas."
   }
  },
  {
   "id": "flood-q10",
   "pillar": "recovery",
   "text": {
    "en": "The water has receded. What should the class do before returning?",
    "fil": "Humupa na ang tubig. Ano ang gagawin bago bumalik ang klase?"
   },
   "choices": [
    {
     "en": "Walk barefoot through the mud.",
     "fil": "Maglakad nang nakapaa sa putik."
    },
    {
     "en": "Wait for official instructions and adult checks. Avoid floodwater and wash with soap and clean water after accidental contact.",
     "fil": "Hintayin ang opisyal na tagubilin at pagsusuri. Iwasan ang baha at maghugas ng sabon at malinis na tubig matapos ang di-sinasadyang pagkabasa."
    },
    {
     "en": "Eat food that floated in the flood.",
     "fil": "Kainin ang pagkaing inanod."
    }
   ],
   "best": 1,
   "why": {
    "en": "Floodwater and contaminated soil can spread illness, including leptospirosis. Tell an adult after exposure and seek prompt health advice, especially for wounds or fever. Do not take medicine on your own.",
    "fil": "Maaaring magdala ng sakit, kabilang ang leptospirosis, ang baha at kontaminadong lupa. Magsabi matapos malantad at humingi agad ng payong pangkalusugan, lalo kung may sugat o lagnat. Huwag basta uminom ng gamot."
   }
  },
  {
   "id": "flood-q11",
   "pillar": "recovery",
   "text": {
    "en": "Books and electronics got wet. What should happen?",
    "fil": "Nabasa ang mga aklat at kagamitang de-kuryente. Ano ang dapat gawin?"
   },
   "choices": [
    {
     "en": "Plug them in to dry them faster.",
     "fil": "Isaksak upang mabilis matuyo."
    },
    {
     "en": "Tell adults: qualified staff check electronics; adults assess books and discard unsafe food.",
     "fil": "Ipaalam: sanay na kawani ang susuri sa electronics; nakatatanda ang susuri sa aklat at magtatapon ng di-ligtas na pagkain."
    },
    {
     "en": "Hide the damage and use them secretly.",
     "fil": "Itago ang sira at lihim na gamitin."
    }
   ],
   "best": 1,
   "why": {
    "en": "Students never test wet electronics. Adults decide which books can be dried safely and which contaminated items must be discarded. Help only with clean, approved materials.",
    "fil": "Hindi susubukan ng bata ang basang electronics. Nakatatanda ang pipili ng ligtas patuyuin at kontaminadong dapat itapon. Sa malinis at aprubadong gamit lamang tumulong."
   }
  },
  {
   "id": "flood-q12",
   "pillar": "recovery",
   "text": {
    "en": "Water remains in uncovered containers around the school. How can the community reduce dengue risk?",
    "fil": "May naiwang tubig sa bukas na lalagyan sa paaralan. Paano mababawasan ang panganib ng dengue?"
   },
   "choices": [
    {
     "en": "Ignore the containers.",
     "fil": "Pabayaan ang mga lalagyan."
    },
    {
     "en": "Ask adults to empty, clean, or cover suitable containers and follow DOH’s 4S guidance.",
     "fil": "Ipaubos, ipalinis, o ipatakip sa nakatatanda ang angkop na lalagyan at sundin ang 4S ng DOH."
    },
    {
     "en": "Spray unknown chemicals by ourselves.",
     "fil": "Magwisik mismo ng di-kilalang kemikal."
    }
   ],
   "best": 1,
   "why": {
    "en": "Mosquito control includes removing breeding sites and personal protection. Seek early consultation for illness. Only authorized teams conduct fogging or spraying in hotspot or outbreak areas as advised by health authorities.",
    "fil": "Kasama sa pag-iwas sa lamok ang pag-alis ng pamugaran at pagprotekta sa sarili. Magpakonsulta nang maaga kapag may sakit. Awtorisadong pangkat lamang ang magfo-fogging o spraying sa hotspot o outbreak ayon sa payo ng awtoridad."
   }
  },
  {
   "id": "flood-q13",
   "pillar": "prevention",
   "text": {
    "en": "Which action reduces a flood hazard before rain?",
    "fil": "Alin ang nakababawas ng panganib bago umulan?"
   },
   "choices": [
    {
     "en": "Dump wrappers in drains.",
     "fil": "Itapon ang balot sa kanal."
    },
    {
     "en": "Report a blocked drain to adults.",
     "fil": "Iulat sa adulto ang baradong kanal."
    },
    {
     "en": "Hide the flood map.",
     "fil": "Itago ang mapa ng baha."
    }
   ],
   "best": 1,
   "why": {
    "en": "Clear drainage helps water flow. Children report blocked or dirty drains for safe adult work.",
    "fil": "Nakatutulong ang malinis na daluyan. Iulat ng mga bata ang baradong kanal para sa ligtas na gawain ng adulto."
   }
  },
  {
   "id": "flood-q14",
   "pillar": "prevention",
   "text": {
    "en": "Why keep exits clear?",
    "fil": "Bakit panatilihing walang sagabal ang mga labasan?"
   },
   "choices": [
    {
     "en": "To store more desks there",
     "fil": "Para mag-imbak ng mga mesa roon"
    },
    {
     "en": "To make the corridor darker",
     "fil": "Para dumilim ang pasilyo"
    },
    {
     "en": "So people can use the approved route",
     "fil": "Para madaanan ang aprubadong ruta"
    }
   ],
   "best": 2,
   "why": {
    "en": "Clear exits support the school evacuation plan. Report heavy obstructions.",
    "fil": "Nakatutulong ang maluwag na labasan sa plano ng paaralan. Iulat ang mabibigat na sagabal."
   }
  },
  {
   "id": "flood-q15",
   "pillar": "preparedness",
   "text": {
    "en": "What does the Orange rainfall warning teach us?",
    "fil": "Ano ang itinuturo ng Orange rainfall warning?"
   },
   "choices": [
    {
     "en": "Be prepared and follow official instructions.",
     "fil": "Maghanda at sundin ang opisyal na tagubilin."
    },
    {
     "en": "Swim before the water rises.",
     "fil": "Lumangoy bago tumaas ang tubig."
    },
    {
     "en": "Ignore the warning.",
     "fil": "Balewalain ang babala."
    }
   ],
   "best": 0,
   "why": {
    "en": "Orange means be prepared. Follow local warnings and the school plan.",
    "fil": "Maghanda sa Orange. Sundin ang lokal na babala at plano ng paaralan."
   }
  },
  {
   "id": "flood-q16",
   "pillar": "preparedness",
   "text": {
    "en": "Who verifies a school or barangay contact number?",
    "fil": "Sino ang tumitiyak sa numero ng paaralan o barangay?"
   },
   "choices": [
    {
     "en": "A random online comment",
     "fil": "Kung sinong nagkomento online"
    },
    {
     "en": "The teacher using official local information",
     "fil": "Guro gamit ang opisyal na lokal na impormasyon"
    },
    {
     "en": "A child inventing a number",
     "fil": "Batang nag-iimbento ng numero"
    }
   ],
   "best": 1,
   "why": {
    "en": "A trusted adult checks local contacts. Keep real family contacts private on your ID.",
    "fil": "Sinusuri ng pinagkakatiwalaang adulto ang lokal na numero. Itago nang pribado sa ID ang numero ng pamilya."
   }
  },
  {
   "id": "flood-q17",
   "pillar": "response",
   "text": {
    "en": "What if the planned path is flooded?",
    "fil": "Paano kung baha na ang planong daan?"
   },
   "choices": [
    {
     "en": "Try it because boots make all water safe.",
     "fil": "Subukan dahil ligtas ang lahat ng tubig kapag may bota."
    },
    {
     "en": "Follow a friend into moving water.",
     "fil": "Sundan ang kaibigan sa rumaragasang tubig."
    },
    {
     "en": "Stop in a safe place and tell the teacher.",
     "fil": "Huminto sa ligtas na lugar at sabihin sa guro."
    }
   ],
   "best": 2,
   "why": {
    "en": "Boots do not make floodwater safe. Adults arrange a safe route or trained rescue.",
    "fil": "Hindi nagiging ligtas ang baha dahil sa bota. Adulto ang naghahanap ng ligtas na ruta o sinanay na rescuer."
   }
  },
  {
   "id": "flood-q18",
   "pillar": "response",
   "text": {
    "en": "What is the child role near wet electrical equipment?",
    "fil": "Ano ang tungkulin ng bata malapit sa basang kagamitang de-kuryente?"
   },
   "choices": [
    {
     "en": "Stay away and report it.",
     "fil": "Lumayo at iulat ito."
    },
    {
     "en": "Unplug it with wet hands.",
     "fil": "Tanggalin sa saksakan gamit ang basang kamay."
    },
    {
     "en": "Try the main switch.",
     "fil": "Subukan ang main switch."
    }
   ],
   "best": 0,
   "why": {
    "en": "Water and electricity are dangerous together. Adults handle controls only when safe.",
    "fil": "Mapanganib ang tubig at kuryente. Adulto lamang ang hahawak sa kontrol kung ligtas."
   }
  },
  {
   "id": "flood-q19",
   "pillar": "recovery",
   "text": {
    "en": "What should you do after accidental floodwater contact?",
    "fil": "Ano ang gagawin matapos ang di-sinasadyang pagdikit sa baha?"
   },
   "choices": [
    {
     "en": "Hide it.",
     "fil": "Itago ito."
    },
    {
     "en": "Tell an adult, wash with soap and clean water, and get health advice if needed.",
     "fil": "Sabihin sa adulto, maghugas ng sabon at malinis na tubig, at humingi ng payong pangkalusugan kung kailangan."
    },
    {
     "en": "Choose your own antibiotics.",
     "fil": "Pumili ng sariling antibiotic."
    }
   ],
   "best": 1,
   "why": {
    "en": "Floodwater may carry germs. An adult helps with cleaning and health care, especially for wounds or illness.",
    "fil": "Maaaring may mikrobyo ang baha. Adulto ang tutulong sa paglilinis at pagpapagamot, lalo na kung may sugat o karamdaman."
   }
  },
  {
   "id": "flood-q20",
   "pillar": "recovery",
   "text": {
    "en": "Who decides on targeted fogging for dengue control?",
    "fil": "Sino ang nagpapasya sa targeted fogging laban sa dengue?"
   },
   "choices": [
    {
     "en": "Children mixing chemicals",
     "fil": "Batang naghahalo ng kemikal"
    },
    {
     "en": "Any friend with a spray",
     "fil": "Kaibigang may spray"
    },
    {
     "en": "Health authorities when indicated",
     "fil": "Mga awtoridad sa kalusugan kung kailangan"
    }
   ],
   "best": 2,
   "why": {
    "en": "The 4S approach includes supporting targeted fogging when health authorities advise it. Children do not handle chemicals.",
    "fil": "Kasama sa 4S ang pagsuporta sa targeted fogging kung payo ng awtoridad. Hindi humahawak ng kemikal ang mga bata."
   }
  }
 ],
 "earthquake": [
  {
   "id": "earthquake-q1",
   "pillar": "prevention",
   "text": {
    "en": "A tall bookshelf is not anchored. What will you do?",
    "fil": "Hindi nakakabit sa pader ang mataas na estante. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Leave it as it is.",
     "fil": "Pabayaan ito."
    },
    {
     "en": "Report it. Ask adults to secure it and put heavy items on low shelves.",
     "fil": "Iulat ito. Ipakabit sa nakatatanda at ipalagay sa ibabang istante ang mabibigat na gamit."
    },
    {
     "en": "Climb it to test its strength.",
     "fil": "Akyatin upang subukan ang tibay."
    }
   ],
   "best": 1,
   "why": {
    "en": "Stay clear and report the location. Trained adults choose suitable anchors and move heavy items. Children do not climb or repair shelves.",
    "fil": "Lumayo at iulat ang lokasyon. Sanay na nakatatanda ang pipili ng angkop na kabit at maglilipat ng mabigat na gamit. Hindi bata ang aakyat o mag-aayos."
   }
  },
  {
   "id": "earthquake-q2",
   "pillar": "prevention",
   "text": {
    "en": "You notice cracks in a classroom wall. What is the safe step?",
    "fil": "May napansin kang bitak sa dingding. Ano ang ligtas na hakbang?"
   },
   "choices": [
    {
     "en": "Draw on the cracks.",
     "fil": "Guhitan ang bitak."
    },
    {
     "en": "Tell the teacher or principal so qualified engineers can assess it.",
     "fil": "Sabihin sa guro o punong-guro upang masuri ng kuwalipikadong inhinyero."
    },
    {
     "en": "Cover them with a poster.",
     "fil": "Takpan ng poster."
    }
   ],
   "best": 1,
   "why": {
    "en": "Report cracks without going close to test them. A qualified professional assesses damage. Children cannot decide structural safety by looking at a wall.",
    "fil": "Iulat ang bitak nang hindi nilalapitan upang subukan. Propesyonal ang susuri sa sira. Hindi bata ang magpapasya sa tibay sa pagtingin lang."
   }
  },
  {
   "id": "earthquake-q3",
   "pillar": "preparedness",
   "text": {
    "en": "Where should the class practise taking cover indoors?",
    "fil": "Saan dapat magsanay ang klase sa pagkubli sa loob?"
   },
   "choices": [
    {
     "en": "Under a nearby sturdy desk, away from windows and tall shelves.",
     "fil": "Sa ilalim ng malapit na matibay na mesa, malayo sa bintana at mataas na estante."
    },
    {
     "en": "In a doorway as the only safe spot.",
     "fil": "Sa pintuan bilang tanging ligtas na lugar."
    },
    {
     "en": "Beside a window.",
     "fil": "Sa tabi ng bintana."
    }
   ],
   "best": 0,
   "why": {
    "en": "Practise Drop, Cover, and Hold On with your teacher. Protect your head and neck. A doorway is not a special protective shelter in an ordinary modern classroom.",
    "fil": "Magsanay ng Dapa, Kubli, Kapit kasama ang guro. Protektahan ang ulo at leeg. Hindi espesyal na silungan ang pintuan sa karaniwang makabagong silid."
   }
  },
  {
   "id": "earthquake-q4",
   "pillar": "preparedness",
   "text": {
    "en": "Which place should be planned as the earthquake assembly area?",
    "fil": "Alin ang dapat planuhing pagtitipunan matapos ang lindol?"
   },
   "choices": [
    {
     "en": "A designated open area away from buildings, trees, poles, and wires.",
     "fil": "Itinakdang bukas na lugar na malayo sa gusali, puno, poste, at kawad."
    },
    {
     "en": "Beside the tallest tree.",
     "fil": "Sa tabi ng pinakamataas na puno."
    },
    {
     "en": "Under an electrical post.",
     "fil": "Sa ilalim ng poste ng kuryente."
    }
   ],
   "best": 0,
   "why": {
    "en": "The school identifies a suitable open assembly area and routes before an emergency. Go there after shaking stops, following safe evacuation instructions. Stay away from falling hazards.",
    "fil": "Pipili ang paaralan ng angkop na bukas na lugar at ruta bago ang emerhensiya. Pumunta matapos huminto ang pagyanig ayon sa ligtas na tagubilin. Lumayo sa maaaring mahulog."
   }
  },
  {
   "id": "earthquake-q5",
   "pillar": "response",
   "text": {
    "en": "The science lesson is interrupted by strong shaking. What do you do now?",
    "fil": "Naputol ang klase sa agham dahil sa malakas na pagyanig. Ano ang gagawin mo ngayon?"
   },
   "choices": [
    {
     "en": "Run outside while the room is shaking.",
     "fil": "Tumakbo palabas habang umuuga ang silid."
    },
    {
     "en": "Drop, cover under the nearby sturdy desk, protect head and neck, and hold on until shaking stops.",
     "fil": "Dumapa, kumubli sa malapit na matibay na mesa, protektahan ang ulo at leeg, at kumapit hanggang huminto."
    },
    {
     "en": "Stand beside the blackboard.",
     "fil": "Tumayo sa tabi ng pisara."
    }
   ],
   "best": 1,
   "why": {
    "en": "Protect yourself where you are. Use nearby sturdy cover and hold on. If no cover is within safe reach, get low and protect head and neck away from glass and falling objects. Do not run outside during shaking.",
    "fil": "Protektahan ang sarili kung nasaan ka. Gumamit ng malapit na matibay na kublihan at kumapit. Kung walang ligtas na maabot, yumuko at takpan ang ulo at leeg malayo sa salamin at mahuhulog na bagay. Huwag tumakbo palabas habang umuuga."
   }
  },
  {
   "id": "earthquake-q6",
   "pillar": "response",
   "text": {
    "en": "The shaking stops. How should the class leave for the assembly area?",
    "fil": "Huminto ang pagyanig. Paano aalis ang klase patungo sa pagtitipunan?"
   },
   "choices": [
    {
     "en": "Push others and rush down the stairs.",
     "fil": "Magtulakan at magmadali sa hagdan."
    },
    {
     "en": "Follow the teacher’s safe-route instruction, walk calmly, and watch for glass and debris.",
     "fil": "Sundin ang guro sa ligtas na ruta, mahinahong lumakad, at bantayan ang salamin at kalat."
    },
    {
     "en": "Use the elevator.",
     "fil": "Gamitin ang elevator."
    }
   ],
   "best": 1,
   "why": {
    "en": "After shaking stops, leave by a safe route without pushing or using elevators. If the planned way is blocked, stop in a safe place and ask for an alternative. Do not wait inside a visibly dangerous area for a routine roll call.",
    "fil": "Pagkatapos ng pagyanig, umalis sa ligtas na ruta nang walang tulakan o elevator. Kung may harang, huminto sa ligtas na lugar at humingi ng ibang ruta. Huwag manatili sa mapanganib na loob para sa karaniwang pagtawag ng pangalan."
   }
  },
  {
   "id": "earthquake-q7",
   "pillar": "response",
   "text": {
    "en": "You can hear Lino behind fallen ceiling debris. How can you help safely?",
    "fil": "Naririnig mo si Lino sa likod ng nahulog na kisame. Paano makatutulong nang ligtas?"
   },
   "choices": [
    {
     "en": "Pull him hard and move the heavy pieces ourselves.",
     "fil": "Hilahin siya at buhatin mismo ang mabibigat na piraso."
    },
    {
     "en": "Call the teacher and trained rescuers, report his location, and keep clear of unstable debris.",
     "fil": "Tumawag ng guro at sanay na tagasagip, iulat ang lokasyon, at lumayo sa di-matatag na kalat."
    },
    {
     "en": "Leave without telling anyone.",
     "fil": "Umalis nang walang sinasabihan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Tell adults immediately. Do not enter damaged areas or lift unstable debris. If trapped yourself, limit movement and dust, protect your mouth if possible, and use a whistle or tapping to help rescuers locate you.",
    "fil": "Magsabi agad. Huwag pumasok sa sirang lugar o magbuhat ng di-matatag na kalat. Kung ikaw ang naipit, bawasan ang galaw at alikabok, takpan ang bibig kung maaari, at gumamit ng pito o katok upang matunton ka."
   }
  },
  {
   "id": "earthquake-q8",
   "pillar": "response",
   "text": {
    "en": "You notice a gas smell near the canteen exit. What is the safe step?",
    "fil": "May naamoy kang gas malapit sa labasan ng kantina. Ano ang ligtas na hakbang?"
   },
   "choices": [
    {
     "en": "Use a lighter to look for the leak.",
     "fil": "Gumamit ng lighter upang hanapin ang tagas."
    },
    {
     "en": "Move away with the class and tell adults from a safe place. Avoid switches, flames, and using devices near the smell.",
     "fil": "Lumayo kasama ang klase at magsabi mula sa ligtas na lugar. Iwasan ang switch, apoy, at paggamit ng device malapit sa amoy."
    },
    {
     "en": "Try to carry the stove outside.",
     "fil": "Buhatin ang kalan palabas."
    }
   ],
   "best": 1,
   "why": {
    "en": "Leave the suspected leak area. Do not investigate, operate switches or valves, or use a phone there. From a safe place, tell adults to call emergency or utility professionals. Authorized people handle gas isolation and ventilation only if safe.",
    "fil": "Umalis sa pinaghihinalaang tagas. Huwag mag-imbestiga, humawak ng switch o balbula, o gumamit ng telepono roon. Mula sa ligtas na lugar, magsabi upang tumawag sa propesyonal. Awtorisadong tao lamang ang bahala sa gas at bentilasyon kung ligtas."
   }
  },
  {
   "id": "earthquake-q9",
   "pillar": "response",
   "text": {
    "en": "An aftershock begins while you are in the designated clear open area. What will you do?",
    "fil": "May aftershock habang nasa itinakdang maluwag na lugar. Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Run back into the building.",
     "fil": "Tumakbo pabalik sa gusali."
    },
    {
     "en": "Stay outside in the clear, get low, and protect your head and neck until shaking stops.",
     "fil": "Manatili sa maluwag na labas, yumuko, at protektahan ang ulo at leeg hanggang huminto."
    },
    {
     "en": "Climb a tree.",
     "fil": "Umakyat sa puno."
    }
   ],
   "best": 1,
   "why": {
    "en": "Stay in the clear open area, away from buildings, trees, poles, and wires. Get low and protect head and neck with your arms or a bag. Do not go inside to look for a desk.",
    "fil": "Manatili sa maluwag na bukas na lugar, malayo sa gusali, puno, poste, at kawad. Yumuko at protektahan ang ulo at leeg gamit ang braso o bag. Huwag pumasok para humanap ng mesa."
   }
  },
  {
   "id": "earthquake-q10",
   "pillar": "recovery",
   "text": {
    "en": "May the class go back into a damaged building now?",
    "fil": "Maaari na bang bumalik sa sirang gusali ang klase?"
   },
   "choices": [
    {
     "en": "Yes, as soon as it is quiet.",
     "fil": "Oo, kapag tahimik na."
    },
    {
     "en": "Wait outside safely for qualified inspection and official clearance.",
     "fil": "Ligtas na maghintay sa labas ng pagsusuri at opisyal na pahintulot."
    },
    {
     "en": "Send a student inside to check.",
     "fil": "Magpadala ng batang susuri sa loob."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not re-enter a damaged building. Qualified engineers and authorities assess safety. Return only when officially allowed, following the school’s instructions. Quiet does not mean safe.",
    "fil": "Huwag bumalik sa sirang gusali. Kuwalipikadong inhinyero at awtoridad ang susuri. Bumalik lamang kapag opisyal na pinahintulutan ayon sa tagubilin. Hindi patunay ng kaligtasan ang katahimikan."
   }
  },
  {
   "id": "earthquake-q11",
   "pillar": "recovery",
   "text": {
    "en": "A post claims “a bigger earthquake will happen today.” What should you do?",
    "fil": "May post na “may mas malaking lindol ngayong araw.” Ano ang gagawin mo?"
   },
   "choices": [
    {
     "en": "Share it quickly.",
     "fil": "Ibahagi agad."
    },
    {
     "en": "Ask an adult to check official PHIVOLCS and NDRRMC information. Do not spread an unverified claim.",
     "fil": "Ipasuri sa nakatatanda ang opisyal na impormasyon ng PHIVOLCS at NDRRMC. Huwag ikalat ang di-tiyak na balita."
    },
    {
     "en": "Invent a time and forward it.",
     "fil": "Gumawa ng oras at ipasa."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not forward a frightening prediction. Check official sources with an adult. Scientists cannot reliably name the exact date, time, place, and size of a future earthquake. Keep practising safe actions.",
    "fil": "Huwag ipasa ang nakatatakot na hula. Suriin kasama ang nakatatanda ang opisyal na sanggunian. Hindi mapagkakatiwalaang masasabi ang eksaktong petsa, oras, lugar, at laki ng susunod na lindol. Patuloy na magsanay."
   }
  },
  {
   "id": "earthquake-q12",
   "pillar": "recovery",
   "text": {
    "en": "A friend feels shaky and has trouble sleeping after the exercise. How can you help?",
    "fil": "Nanginginig at hirap matulog ang kaibigan matapos ang pagsasanay. Paano makatutulong?"
   },
   "choices": [
    {
     "en": "Tease the friend.",
     "fil": "Tuksuhin siya."
    },
    {
     "en": "Listen kindly, offer a quiet drawing activity, and tell Ma’am Mara or the guidance counselor. Ask before offering a hug.",
     "fil": "Makinig nang mabait, mag-alok ng tahimik na pagguhit, at magsabi sa guro o guidance counselor. Magtanong bago yumakap."
    },
    {
     "en": "Force the friend to retell everything.",
     "fil": "Pilitin siyang ikuwento ang lahat."
    }
   ],
   "best": 1,
   "why": {
    "en": "Stay kind without forcing someone to speak or accept touch. A trusted adult can help arrange support, especially if sleep or everyday activities remain difficult.",
    "fil": "Maging mabait nang hindi pinipilit magsalita o magpahawak. Makatutulong ang nakatatanda sa suporta, lalo kung patuloy na nahihirapan sa pagtulog o gawain."
   }
  },
  {
   "id": "earthquake-q13",
   "pillar": "prevention",
   "text": {
    "en": "Who anchors a heavy shelf safely?",
    "fil": "Sino ang ligtas na magkakabit ng mabigat na estante?"
   },
   "choices": [
    {
     "en": "Trained adults",
     "fil": "Mga sinanay na adulto"
    },
    {
     "en": "A student climbing it",
     "fil": "Mag-aaral na umaakyat dito"
    },
    {
     "en": "A child holding it during shaking",
     "fil": "Batang hahawak dito habang lumilindol"
    }
   ],
   "best": 0,
   "why": {
    "en": "Report unanchored shelves. Trained adults secure them before an earthquake.",
    "fil": "Iulat ang estanteng hindi nakakabit. Sinanay na adulto ang magkakabit bago lumindol."
   }
  },
  {
   "id": "earthquake-q14",
   "pillar": "prevention",
   "text": {
    "en": "Where should heavy items be stored?",
    "fil": "Saan dapat ilagay ang mabibigat na gamit?"
   },
   "choices": [
    {
     "en": "Above a classroom door",
     "fil": "Sa ibabaw ng pinto ng silid"
    },
    {
     "en": "On lower secure shelves, arranged by adults",
     "fil": "Sa mababang matibay na estante, inayos ng adulto"
    },
    {
     "en": "On an unstable stack",
     "fil": "Sa hindi matatag na patong"
    }
   ],
   "best": 1,
   "why": {
    "en": "Lower secure storage reduces falling-object hazards. Ask an adult to move heavy items.",
    "fil": "Nababawasan ang panganib ng pagbagsak sa mababang ligtas na imbakan. Adulto ang palilipatin ng mabibigat."
   }
  },
  {
   "id": "earthquake-q15",
   "pillar": "preparedness",
   "text": {
    "en": "What does earthquake intensity describe?",
    "fil": "Ano ang inilalarawan ng intensity ng lindol?"
   },
   "choices": [
    {
     "en": "An exact date of the next quake",
     "fil": "Eksaktong petsa ng susunod na lindol"
    },
    {
     "en": "A storm wind speed",
     "fil": "Bilis ng hangin sa bagyo"
    },
    {
     "en": "Shaking and effects at a place",
     "fil": "Pagyanig at mga epekto sa isang lugar"
    }
   ],
   "best": 2,
   "why": {
    "en": "Intensity describes local shaking and effects. Magnitude describes the size of the earthquake.",
    "fil": "Inilalarawan ng intensity ang lokal na pagyanig at epekto. Sukat ng lindol ang magnitude."
   }
  },
  {
   "id": "earthquake-q16",
   "pillar": "preparedness",
   "text": {
    "en": "Which statement about exact earthquake predictions is correct?",
    "fil": "Aling pahayag sa eksaktong paghula ng lindol ang tama?"
   },
   "choices": [
    {
     "en": "No one can reliably give its exact future date, place, and size.",
     "fil": "Walang maaasahang eksaktong petsa, lugar, at laki ng lindol sa hinaharap."
    },
    {
     "en": "A viral post always knows the exact time.",
     "fil": "Laging alam ng viral post ang eksaktong oras."
    },
    {
     "en": "A pet can tell the exact magnitude.",
     "fil": "Masasabi ng alaga ang eksaktong magnitude."
    }
   ],
   "best": 0,
   "why": {
    "en": "Use official information and practise the plan instead of sharing exact-date predictions.",
    "fil": "Gumamit ng opisyal na impormasyon at magsanay sa plano sa halip na ibahagi ang eksaktong hula."
   }
  },
  {
   "id": "earthquake-q17",
   "pillar": "response",
   "text": {
    "en": "During indoor shaking, what protects you?",
    "fil": "Ano ang proteksiyon habang lumilindol sa loob?"
   },
   "choices": [
    {
     "en": "Run to the stairs.",
     "fil": "Tumakbo sa hagdan."
    },
    {
     "en": "Drop, Cover, and Hold On away from glass.",
     "fil": "Drop, Cover, and Hold On palayo sa salamin."
    },
    {
     "en": "Stand beside a tall shelf.",
     "fil": "Tumayo sa tabi ng mataas na estante."
    }
   ],
   "best": 1,
   "why": {
    "en": "Protect your head and neck. Hold on to sturdy cover and wait for shaking to stop before evacuation.",
    "fil": "Protektahan ang ulo at leeg. Humawak sa matibay na silong at hintaying tumigil ang pagyanig bago lumikas."
   }
  },
  {
   "id": "earthquake-q18",
   "pillar": "response",
   "text": {
    "en": "What can a trapped child do to signal trained rescuers?",
    "fil": "Paano makasasenyas ang batang naipit sa sinanay na rescuer?"
   },
   "choices": [
    {
     "en": "Light a match.",
     "fil": "Magsindi ng posporo."
    },
    {
     "en": "Keep shouting until exhausted.",
     "fil": "Sumigaw hanggang mapagod."
    },
    {
     "en": "Tap or use a whistle, then rest and listen.",
     "fil": "Kumatok o gumamit ng pito, saka magpahinga at makinig."
    }
   ],
   "best": 2,
   "why": {
    "en": "A whistle or tapping can help signal rescuers. Save energy and avoid dust.",
    "fil": "Nakatutulong ang pito o pagkatok sa pagsenyas. Magtipid ng lakas at umiwas sa alikabok."
   }
  },
  {
   "id": "earthquake-q19",
   "pillar": "recovery",
   "text": {
    "en": "Who checks whether a damaged school is safe to enter?",
    "fil": "Sino ang sumusuri kung ligtas pasukin ang nasirang paaralan?"
   },
   "choices": [
    {
     "en": "Authorized trained adults",
     "fil": "Awtorisadong sinanay na adulto"
    },
    {
     "en": "The fastest student",
     "fil": "Pinakamabilis na mag-aaral"
    },
    {
     "en": "Friends inspecting cracks",
     "fil": "Mga kaibigang sumusuri sa bitak"
    }
   ],
   "best": 0,
   "why": {
    "en": "Wait for official clearance. Children do not inspect or test damaged buildings.",
    "fil": "Hintayin ang opisyal na pahintulot. Hindi bata ang sumusuri o sumusubok sa sirang gusali."
   }
  },
  {
   "id": "earthquake-q20",
   "pillar": "recovery",
   "text": {
    "en": "Which recovery task is suitable in a cleared safe space?",
    "fil": "Alin ang angkop sa ligtas na lugar na pinayagan?"
   },
   "choices": [
    {
     "en": "Repair a cracked column.",
     "fil": "Ayusin ang bitak sa haligi."
    },
    {
     "en": "Make thank-you art with adult guidance.",
     "fil": "Gumawa ng pasasalamat na sining sa gabay ng adulto."
    },
    {
     "en": "Lift heavy rubble.",
     "fil": "Buhatin ang mabigat na guho."
    }
   ],
   "best": 1,
   "why": {
    "en": "Children can help through safe art and support. Structural repairs and rubble are adult work.",
    "fil": "Makatutulong ang mga bata sa ligtas na sining at pagdamay. Adulto ang gagawa sa istruktura at guho."
   }
  }
 ],
 "tsunami": [
  {
   "id": "tsunami-q1",
   "pillar": "prevention",
   "text": {
    "en": "The club is planning how to care for mangroves. Which choice helps?",
    "fil": "Nagpaplano ang club ng pag-aalaga sa bakawan. Alin ang makatutulong?"
   },
   "choices": [
    {
     "en": "Cut them for firewood.",
     "fil": "Putulin para panggatong."
    },
    {
     "en": "Protect them and join only an adult-approved planting activity in a safe area.",
     "fil": "Alagaan at sumali lamang sa aprubadong ligtas na pagtatanim na may gabay."
    },
    {
     "en": "Use the trees as a reason to ignore evacuation.",
     "fil": "Gawing dahilan ang mga puno para hindi lumikas."
    }
   ],
   "best": 1,
   "why": {
    "en": "Mangroves support fish habitat and help protect coasts from erosion and some wave effects. They cannot guarantee safety from a tsunami. Adults choose suitable species and sites; evacuate on a natural warning.",
    "fil": "Tumutulong ang bakawan sa tirahan ng isda at pagprotekta sa baybayin mula sa pagguho at ilang epekto ng alon. Hindi nito matitiyak ang kaligtasan sa tsunami. Nakatatanda ang pipili ng uri at lugar; lumikas kapag may likas na babala."
   }
  },
  {
   "id": "tsunami-q2",
   "pillar": "prevention",
   "text": {
    "en": "The tsunami hazard map is dusty and unused. What should the class do?",
    "fil": "Maalikabok at hindi ginagamit ang mapa ng panganib sa tsunami. Ano ang gagawin?"
   },
   "choices": [
    {
     "en": "Ignore it.",
     "fil": "Balewalain ito."
    },
    {
     "en": "Study the current approved map with the teacher and find the route to safe high ground.",
     "fil": "Pag-aralan kasama ang guro ang kasalukuyang aprubadong mapa at ruta sa ligtas na mataas na lugar."
    },
    {
     "en": "Invent a route along the beach.",
     "fil": "Gumawa ng ruta sa dalampasigan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Know your school’s hazard zone, evacuation signs, destination, and alternatives before an emergency. Teachers verify the current local map and plan. This game’s diagram is not a real evacuation map.",
    "fil": "Alamin bago ang emerhensiya ang hazard zone, karatula, pupuntahan, at alternatibo. Titiyakin ng guro ang kasalukuyang lokal na mapa at plano. Hindi tunay na mapa ng paglikas ang nasa laro."
   }
  },
  {
   "id": "tsunami-q3",
   "pillar": "preparedness",
   "text": {
    "en": "A strong, long earthquake has just stopped near the coast. What comes next?",
    "fil": "Huminto na ang malakas at mahabang lindol malapit sa baybayin. Ano ang susunod?"
   },
   "choices": [
    {
     "en": "Wait for a phone alert before moving.",
     "fil": "Hintayin ang alerto sa telepono bago kumilos."
    },
    {
     "en": "Evacuate promptly on the approved route to safe high ground or the pre-designated assessed refuge.",
     "fil": "Lumikas agad sa aprubadong ruta sa ligtas na mataas na lugar o itinakdang nasuring refuge."
    },
    {
     "en": "Go to the beach to check the water.",
     "fil": "Pumunta sa dalampasigan upang tingnan ang tubig."
    }
   ],
   "best": 1,
   "why": {
    "en": "During shaking, Drop, Cover, and Hold On. As soon as shaking stops and you can move safely, leave the coastal hazard area. Do not wait for another sign or an official alert. Use designated vertical refuge only as planned when safe high ground cannot be reached.",
    "fil": "Habang umuuga, Dapa, Kubli, Kapit. Kapag huminto at ligtas nang makagalaw, umalis sa panganib sa baybayin. Huwag maghintay ng ibang palatandaan o opisyal na alerto. Itinakdang vertical refuge lang ang gamitin ayon sa plano kung hindi maabot ang ligtas na mataas na lugar."
   }
  },
  {
   "id": "tsunami-q4",
   "pillar": "preparedness",
   "text": {
    "en": "Which planned route avoids the river mouth and shoreline?",
    "fil": "Aling nakaplanong ruta ang umiiwas sa bukana ng ilog at dalampasigan?"
   },
   "choices": [
    {
     "en": "Follow the river down to the sea.",
     "fil": "Sundan ang ilog pababa sa dagat."
    },
    {
     "en": "Follow approved signs inland and uphill to the designated safe destination.",
     "fil": "Sundin ang aprubadong karatula papaloob at paakyat sa itinakdang ligtas na lugar."
    },
    {
     "en": "Take a beach shortcut.",
     "fil": "Dumaan sa shortcut sa dalampasigan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Use the approved evacuation route away from beaches and waterways. If it is blocked, follow the preplanned safe alternative with adults; never test a wet shortcut. Routes and destinations must be checked locally.",
    "fil": "Gamitin ang aprubadong ruta na malayo sa dalampasigan at daluyan ng tubig. Kung may harang, sundin kasama ang nakatatanda ang nakaplanong ligtas na alternatibo; huwag subukan ang basang shortcut. Lokal na dapat suriin ang ruta at pupuntahan."
   }
  },
  {
   "id": "tsunami-q5",
   "pillar": "response",
   "text": {
    "en": "In the exercise diagram the sea suddenly pulls back, exposing fish and sand. What is the safe action?",
    "fil": "Sa diagram, biglang umatras ang dagat at lumitaw ang isda at buhangin. Ano ang ligtas na kilos?"
   },
   "choices": [
    {
     "en": "Collect the fish.",
     "fil": "Kunin ang isda."
    },
    {
     "en": "Keep moving to safety and warn others while going. Never approach the shore.",
     "fil": "Magpatuloy sa ligtas na lugar at magbabala habang papalayo. Huwag lumapit sa dalampasigan."
    },
    {
     "en": "Stop for a selfie.",
     "fil": "Huminto para sa selfie."
    }
   ],
   "best": 1,
   "why": {
    "en": "A sudden unusual sea-level change is a natural warning. Move away from the coast immediately. You do not need to see water recede, hear a roar, or see a wave before acting on strong or long shaking.",
    "fil": "Likas na babala ang biglang kakaibang pagbabago ng dagat. Lumayo agad. Hindi kailangang makitang umatras ang tubig, makarinig ng ugong, o makakita ng alon bago kumilos sa malakas o mahabang pagyanig."
   }
  },
  {
   "id": "tsunami-q6",
   "pillar": "response",
   "text": {
    "en": "The road is jammed. How should this class continue its approved evacuation?",
    "fil": "Siksikan ang kalsada. Paano magpapatuloy ang klase sa aprubadong paglikas?"
   },
   "choices": [
    {
     "en": "Wait in a car in the traffic.",
     "fil": "Maghintay sa kotse sa trapiko."
    },
    {
     "en": "Move quickly on the approved foot route with adults, using arranged assistance where needed. Leave belongings behind.",
     "fil": "Mabilis na sumunod sa aprubadong lakarang ruta kasama ang nakatatanda at itinakdang tulong kung kailangan. Iwan ang gamit."
    },
    {
     "en": "Go back for a toy.",
     "fil": "Bumalik para sa laruan."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not delay to collect a bag or toy. Take a Go-Bag only if immediately at hand and it does not slow escape. Follow the school’s accessible evacuation plan and adults’ instructions; students do not arrange their own transport.",
    "fil": "Huwag maantala para kumuha ng bag o laruan. Dalhin lang ang Go-Bag kung abot agad at hindi makabagal. Sundin ang planong angkop sa pangangailangan at tagubilin ng nakatatanda; hindi bata ang mag-aayos ng sasakyan."
   }
  },
  {
   "id": "tsunami-q7",
   "pillar": "response",
   "text": {
    "en": "Bea’s ankle hurts on the route. How can you help?",
    "fil": "Masakit ang bukung-bukong ni Bea habang lumilikas. Paano makatutulong?"
   },
   "choices": [
    {
     "en": "Leave without telling anyone.",
     "fil": "Umalis nang walang sinasabihan."
    },
    {
     "en": "Tell the teacher immediately. Let trained adults arrange safe assisted evacuation; stay supportive.",
     "fil": "Magsabi agad sa guro. Sanay na nakatatanda ang mag-aayos ng ligtas na paglikas na may tulong; manatiling sumusuporta."
    },
    {
     "en": "Force her to walk or have children carry her.",
     "fil": "Pilitin siyang maglakad o ipabuhat sa mga bata."
    }
   ],
   "best": 1,
   "why": {
    "en": "Do not force a painful limb or try a student carry. Adults use the preplanned assistance and decide how to move someone away from immediate danger. Children report, make space, and follow instructions.",
    "fil": "Huwag piliting igalaw ang masakit na bahagi o subukang magbuhat. Nakatatanda ang gagamit ng nakaplanong tulong at magpapasya sa ligtas na paglayo sa agarang panganib. Mag-uulat, magbibigay ng daan, at susunod ang bata."
   }
  },
  {
   "id": "tsunami-q8",
   "pillar": "response",
   "text": {
    "en": "You have reached the designated assessed vertical refuge. A wave has passed below. What now?",
    "fil": "Nasa itinakdang nasuring vertical refuge na kayo. Lumampas na ang isang alon sa ibaba. Ano ngayon?"
   },
   "choices": [
    {
     "en": "Go down to see what happened.",
     "fil": "Bumaba upang tingnan ang nangyari."
    },
    {
     "en": "Stay in the safe refuge area with the teacher. More waves may follow.",
     "fil": "Manatili sa ligtas na bahagi ng refuge kasama ang guro. Maaaring may sumunod pang alon."
    },
    {
     "en": "Go to the edge to film.",
     "fil": "Lumapit sa gilid upang mag-video."
    }
   ],
   "best": 1,
   "why": {
    "en": "The first wave may not be the largest. Dangerous waves and currents can continue for hours. Stay away from edges and do not descend until authorities say it is safe and adults confirm the route.",
    "fil": "Maaaring hindi pinakamalaki ang unang alon. Maaaring tumagal nang ilang oras ang alon at agos. Lumayo sa gilid at huwag bumaba hangga’t hindi pinapayagan at nasusuri ang ruta."
   }
  },
  {
   "id": "tsunami-q9",
   "pillar": "response",
   "text": {
    "en": "Water is rushing near the school gate below the refuge. What should students do?",
    "fil": "Rumaragasa ang tubig sa may gate sa ibaba ng refuge. Ano ang gagawin?"
   },
   "choices": [
    {
     "en": "Try to swim through it.",
     "fil": "Subukang languyin ito."
    },
    {
     "en": "Remain in the designated safe area, away from edges. Tell adults; signal rescuers only from safety as instructed.",
     "fil": "Manatili sa itinakdang ligtas na lugar, malayo sa gilid. Magsabi; sumenyas lamang mula sa ligtas ayon sa tagubilin."
    },
    {
     "en": "Go down for a floating bag.",
     "fil": "Bumaba para sa inanod na bag."
    }
   ],
   "best": 1,
   "why": {
    "en": "Never enter rushing water or climb outside to signal. Adults manage contact with rescuers. A whistle or bright cloth may help from a secure place if needed and directed. Follow any updated evacuation instructions.",
    "fil": "Huwag pumasok sa rumaragasang tubig o umakyat sa labas para sumenyas. Nakatatanda ang bahala sa kontak. Makatutulong ang pito o matingkad na tela mula sa matatag na lugar kung kailangan at ipinag-utos. Sundin ang bagong tagubilin."
   }
  },
  {
   "id": "tsunami-q10",
   "pillar": "recovery",
   "text": {
    "en": "The water looks lower. Is that the all clear?",
    "fil": "Mukhang mas mababa ang tubig. All clear na ba ito?"
   },
   "choices": [
    {
     "en": "Yes. Leave immediately.",
     "fil": "Oo. Umalis agad."
    },
    {
     "en": "No. Stay in safety until official instructions allow leaving and adults check the way.",
     "fil": "Hindi. Manatili hanggang payagan ng opisyal na tagubilin at masuri ang daan."
    },
    {
     "en": "Let a child check the coast.",
     "fil": "Ipasuri sa bata ang baybayin."
    }
   ],
   "best": 1,
   "why": {
    "en": "A quiet sea or receding water cannot prove the danger is over. Follow current PHIVOLCS and local instructions. A warning cancellation does not by itself certify every building, road, or water source safe.",
    "fil": "Hindi patunay na tapos na ang panganib ang tahimik na dagat o humuhupang tubig. Sundin ang kasalukuyang tagubilin. Hindi awtomatikong ligtas ang lahat ng gusali, kalsada, o tubig kapag kinansela ang babala."
   }
  },
  {
   "id": "tsunami-q11",
   "pillar": "recovery",
   "text": {
    "en": "Later, adults approve a dry route to the evacuation center. Debris and seawater remain elsewhere. What is safe?",
    "fil": "Kalaunan, inaprubahan ang tuyong ruta sa evacuation center. May kalat at tubig-dagat pa sa ibang lugar. Ano ang ligtas?"
   },
   "choices": [
    {
     "en": "Walk barefoot across the debris.",
     "fil": "Maglakad nang nakapaa sa kalat."
    },
    {
     "en": "Use sturdy footwear on the approved dry route, avoid glass and wires, and drink only safe water.",
     "fil": "Gumamit ng matibay na sapatos sa aprubadong tuyong ruta, umiwas sa salamin at kawad, at ligtas na tubig lang ang inumin."
    },
    {
     "en": "Drink seawater or floodwater.",
     "fil": "Uminom ng tubig-dagat o baha."
    }
   ],
   "best": 1,
   "why": {
    "en": "Footwear does not make floodwater or debris fields safe. Stay on the checked route, keep away from damaged structures and wires, and tell adults about exposure or injury. Adults handle hazardous cleanup.",
    "fil": "Hindi ginagawang ligtas ng sapatos ang baha o tambak na kalat. Manatili sa nasuring ruta, lumayo sa sirang gusali at kawad, at magsabi kung nabasa o nasaktan. Nakatatanda ang bahala sa mapanganib na paglilinis."
   }
  },
  {
   "id": "tsunami-q12",
   "pillar": "recovery",
   "text": {
    "en": "How can children help at the approved evacuation-center activity area?",
    "fil": "Paano makatutulong ang mga bata sa aprubadong lugar ng gawain sa evacuation center?"
   },
   "choices": [
    {
     "en": "Sort clean teaching donations with adults and share safe toys fairly.",
     "fil": "Ayusin kasama ang nakatatanda ang malinis na donasyong pang-aralin at patas na magbahagi ng ligtas na laruan."
    },
    {
     "en": "Hide all supplies for ourselves.",
     "fil": "Itago para sa sarili ang lahat ng gamit."
    },
    {
     "en": "Give out unknown medicine without an adult.",
     "fil": "Mamigay ng di-kilalang gamot nang walang nakatatanda."
    }
   ],
   "best": 0,
   "why": {
    "en": "Help through clean, supervised tasks. Adults check food and handle medicine or damaged goods. Share fairly and respect other families’ needs and privacy.",
    "fil": "Tumulong sa malinis na gawaing may gabay. Nakatatanda ang susuri ng pagkain at hahawak ng gamot o sirang gamit. Magbahagi nang patas at igalang ang pangangailangan at pribasiya."
   }
  },
  {
   "id": "tsunami-q13",
   "pillar": "prevention",
   "text": {
    "en": "Which map helps a coastal school reduce risk?",
    "fil": "Aling mapa ang makatutulong sa paaralang baybayin?"
   },
   "choices": [
    {
     "en": "A beach selfie map",
     "fil": "Mapa ng selfie sa dalampasigan"
    },
    {
     "en": "A snack shop map only",
     "fil": "Mapa lang ng tindahan"
    },
    {
     "en": "An approved hazard and evacuation map",
     "fil": "Aprubadong mapa ng panganib at paglikas"
    }
   ],
   "best": 2,
   "why": {
    "en": "An approved map helps the school plan safer routes and refuges before danger.",
    "fil": "Nakatutulong ang aprubadong mapa sa mas ligtas na ruta at kanlungan bago ang panganib."
   }
  },
  {
   "id": "tsunami-q14",
   "pillar": "prevention",
   "text": {
    "en": "Who keeps refuge access ready?",
    "fil": "Sino ang nagpapanatiling handa sa daan patungong kanlungan?"
   },
   "choices": [
    {
     "en": "Adults checking the approved route before danger",
     "fil": "Mga adultong sumusuri sa aprubadong ruta bago ang panganib"
    },
    {
     "en": "Children clearing a damaged roof",
     "fil": "Mga batang naglilinis ng sirang bubong"
    },
    {
     "en": "Friends blocking the stairs",
     "fil": "Mga kaibigang humaharang sa hagdan"
    }
   ],
   "best": 0,
   "why": {
    "en": "Report blocked access early. Adults keep approved routes usable.",
    "fil": "Iulat nang maaga ang sagabal. Adulto ang nagpapanatiling madaraanan sa aprubadong ruta."
   }
  },
  {
   "id": "tsunami-q15",
   "pillar": "preparedness",
   "text": {
    "en": "Which building can be used for vertical tsunami evacuation?",
    "fil": "Aling gusali ang magagamit sa patayong paglikas sa tsunami?"
   },
   "choices": [
    {
     "en": "Any third floor",
     "fil": "Anumang ikatlong palapag"
    },
    {
     "en": "A refuge designated after professional assessment in the local plan",
     "fil": "Kanlungang itinalaga matapos ang propesyonal na pagsusuri sa lokal na plano"
    },
    {
     "en": "Any roof with a view",
     "fil": "Anumang bubong na tanaw ang dagat"
    }
   ],
   "best": 1,
   "why": {
    "en": "A tall building is not automatically a tsunami refuge. Follow the assessed local plan.",
    "fil": "Hindi awtomatikong kanlungan ang mataas na gusali. Sundin ang lokal na planong nasuri."
   }
  },
  {
   "id": "tsunami-q16",
   "pillar": "preparedness",
   "text": {
    "en": "A bulletin is headed Tsunami Information. What must adults read?",
    "fil": "Tsunami Information ang pamagat ng bulletin. Ano ang dapat basahin ng adulto?"
   },
   "choices": [
    {
     "en": "Only the title",
     "fil": "Pamagat lang"
    },
    {
     "en": "Only the picture",
     "fil": "Larawan lang"
    },
    {
     "en": "Its actual advice, location, and time",
     "fil": "Aktuwal na payo, lugar, at oras"
    }
   ],
   "best": 2,
   "why": {
    "en": "A title alone does not tell you the action. Read current PHIVOLCS advice and local instructions.",
    "fil": "Hindi sapat ang pamagat para malaman ang gagawin. Basahin ang kasalukuyang payo ng PHIVOLCS at lokal na tagubilin."
   }
  },
  {
   "id": "tsunami-q17",
   "pillar": "response",
   "text": {
    "en": "Strong coastal shaking stops. Should you wait for all three natural warning signs?",
    "fil": "Tumigil ang malakas na pagyanig sa baybayin. Hihintayin ba ang tatlong likas na babala?"
   },
   "choices": [
    {
     "en": "No. Act on one sign and follow the safe evacuation plan.",
     "fil": "Hindi. Kumilos sa isang babala at sundin ang ligtas na plano ng paglikas."
    },
    {
     "en": "Yes, wait for the sea to retreat too.",
     "fil": "Oo, hintaying umatras din ang dagat."
    },
    {
     "en": "Yes, wait for a photo.",
     "fil": "Oo, maghintay ng larawan."
    }
   ],
   "best": 0,
   "why": {
    "en": "Any one natural warning can be enough. After shaking stops, leave the coast by the safe route without waiting for an alert.",
    "fil": "Maaaring sapat ang isang likas na babala. Pagtigil ng pagyanig, lumayo sa baybayin sa ligtas na ruta nang hindi naghihintay ng alerto."
   }
  },
  {
   "id": "tsunami-q18",
   "pillar": "response",
   "text": {
    "en": "Does the sea always pull back before a tsunami?",
    "fil": "Lagi bang umaatras ang dagat bago ang tsunami?"
   },
   "choices": [
    {
     "en": "Yes, so wait for it.",
     "fil": "Oo, kaya hintayin ito."
    },
    {
     "en": "No. Do not wait at the shore.",
     "fil": "Hindi. Huwag maghintay sa dalampasigan."
    },
    {
     "en": "Yes, so go closer.",
     "fil": "Oo, kaya lumapit."
    }
   ],
   "best": 1,
   "why": {
    "en": "A tsunami can arrive without the sea first pulling back. Stay away and act on warnings.",
    "fil": "Maaaring dumating ang tsunami nang hindi muna umaatras ang dagat. Lumayo at kumilos sa babala."
   }
  },
  {
   "id": "tsunami-q19",
   "pillar": "recovery",
   "text": {
    "en": "Where can children sort clean donations?",
    "fil": "Saan maaaring mag-ayos ng malinis na donasyon ang mga bata?"
   },
   "choices": [
    {
     "en": "At an uncleared wet shore",
     "fil": "Sa basang dalampasigang hindi pa pinayagan"
    },
    {
     "en": "Inside a damaged boat",
     "fil": "Sa loob ng sirang bangka"
    },
    {
     "en": "In a cleared dry center with adult guidance",
     "fil": "Sa tuyong sentrong pinayagan sa gabay ng adulto"
    }
   ],
   "best": 2,
   "why": {
    "en": "Safe donation work is away from water and debris. Adults check food and medicines.",
    "fil": "Malayo sa tubig at kalat ang ligtas na pag-aayos. Adulto ang sumusuri sa pagkain at gamot."
   }
  },
  {
   "id": "tsunami-q20",
   "pillar": "recovery",
   "text": {
    "en": "Who gives instructions for leaving a tsunami refuge?",
    "fil": "Sino ang nagbibigay ng tagubilin sa pag-alis sa kanlungan?"
   },
   "choices": [
    {
     "en": "Authorities through the teacher, after checks",
     "fil": "Awtoridad sa pamamagitan ng guro, matapos ang pagsusuri"
    },
    {
     "en": "A friend seeing one quiet wave",
     "fil": "Kaibigang nakakita ng tahimik na alon"
    },
    {
     "en": "A child counting ten minutes",
     "fil": "Batang nagbilang ng sampung minuto"
    }
   ],
   "best": 0,
   "why": {
    "en": "A quiet sea is not an all clear. Waves and damaged routes can remain dangerous.",
    "fil": "Hindi pahintulot ang tahimik na dagat. Maaaring mapanganib pa ang mga alon at sirang ruta."
   }
  }
 ]
};
 LE.Data.pillarMatches={
 "typhoon": [
  {
   "id": "typhoon-m1",
   "pillar": "prevention",
   "text": {
    "en": "Report a loose roof before rain.",
    "fil": "Iulat ang maluwag na bubong bago umulan."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "typhoon-m2",
   "pillar": "prevention",
   "text": {
    "en": "Adults trim a dangerous branch before storms.",
    "fil": "Putulin ng adulto ang mapanganib na sanga bago bumagyo."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "typhoon-m3",
   "pillar": "preparedness",
   "text": {
    "en": "Pack a Go-Bag before danger.",
    "fil": "Maghanda ng Go-Bag bago ang panganib."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "typhoon-m4",
   "pillar": "preparedness",
   "text": {
    "en": "Practise the emergency plan.",
    "fil": "Magsanay sa planong pang-emergency."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "typhoon-m5",
   "pillar": "response",
   "text": {
    "en": "Move away from rattling windows during the storm.",
    "fil": "Lumayo sa kumakalabog na bintana habang bumabagyo."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "typhoon-m6",
   "pillar": "response",
   "text": {
    "en": "Use a flashlight during the outage.",
    "fil": "Gumamit ng flashlight habang walang kuryente."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "typhoon-m7",
   "pillar": "recovery",
   "text": {
    "en": "Make thank-you art after official clearance.",
    "fil": "Gumawa ng pasasalamat matapos ang opisyal na pahintulot."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  },
  {
   "id": "typhoon-m8",
   "pillar": "recovery",
   "text": {
    "en": "Support a worried friend after the storm.",
    "fil": "Damayan ang nag-aalalang kaibigan matapos ang bagyo."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  }
 ],
 "flood": [
  {
   "id": "flood-m1",
   "pillar": "prevention",
   "text": {
    "en": "Report a blocked drain before rain.",
    "fil": "Iulat ang baradong kanal bago umulan."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "flood-m2",
   "pillar": "prevention",
   "text": {
    "en": "Keep exits clear before danger.",
    "fil": "Panatilihing walang sagabal ang labasan bago ang panganib."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "flood-m3",
   "pillar": "preparedness",
   "text": {
    "en": "Check verified emergency contacts.",
    "fil": "Tiyakin ang opisyal na numero sa emergency."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "flood-m4",
   "pillar": "preparedness",
   "text": {
    "en": "Plan a dry evacuation route before flooding.",
    "fil": "Magplano ng tuyong ruta bago bumaha."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "flood-m5",
   "pillar": "response",
   "text": {
    "en": "Follow the teacher to the approved refuge as water rises.",
    "fil": "Sundin ang guro sa aprubadong kanlungan habang tumataas ang tubig."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "flood-m6",
   "pillar": "response",
   "text": {
    "en": "Stay away from wet electrical equipment during the flood.",
    "fil": "Lumayo sa basang kagamitang de-kuryente habang bumabaha."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "flood-m7",
   "pillar": "recovery",
   "text": {
    "en": "Adults check wet electronics after clearance.",
    "fil": "Ipasuri sa adulto ang basang electronics matapos ang pahintulot."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  },
  {
   "id": "flood-m8",
   "pillar": "recovery",
   "text": {
    "en": "Help with clean donation cards in the dry center after the flood.",
    "fil": "Tumulong sa malinis na donasyon sa tuyong sentro matapos ang baha."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  }
 ],
 "earthquake": [
  {
   "id": "earthquake-m1",
   "pillar": "prevention",
   "text": {
    "en": "Adults anchor shelves before an earthquake.",
    "fil": "Ikabit ng adulto ang estante bago lumindol."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "earthquake-m2",
   "pillar": "prevention",
   "text": {
    "en": "Adults store heavy items low before shaking.",
    "fil": "Ilagay ng adulto sa mababa ang mabibigat bago lumindol."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "earthquake-m3",
   "pillar": "preparedness",
   "text": {
    "en": "Practise Drop, Cover, and Hold On in a drill.",
    "fil": "Magsanay sa Drop, Cover, and Hold On sa drill."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "earthquake-m4",
   "pillar": "preparedness",
   "text": {
    "en": "Prepare a Go-Bag before an earthquake.",
    "fil": "Maghanda ng Go-Bag bago lumindol."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "earthquake-m5",
   "pillar": "response",
   "text": {
    "en": "Drop, Cover, and Hold On during shaking.",
    "fil": "Drop, Cover, and Hold On habang lumilindol."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "earthquake-m6",
   "pillar": "response",
   "text": {
    "en": "Signal trained rescuers if trapped.",
    "fil": "Sumenyas sa sinanay na rescuer kung naipit."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "earthquake-m7",
   "pillar": "recovery",
   "text": {
    "en": "Make thank-you art in a cleared space after the quake.",
    "fil": "Gumawa ng pasasalamat sa pinayagang lugar matapos lumindol."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  },
  {
   "id": "earthquake-m8",
   "pillar": "recovery",
   "text": {
    "en": "Adults repair structures after professional assessment.",
    "fil": "Ayusin ng adulto ang istruktura matapos ang propesyonal na pagsusuri."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  }
 ],
 "tsunami": [
  {
   "id": "tsunami-m1",
   "pillar": "prevention",
   "text": {
    "en": "Adults clear approved refuge access before danger.",
    "fil": "Alisin ng adulto ang sagabal sa aprubadong kanlungan bago ang panganib."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "tsunami-m2",
   "pillar": "prevention",
   "text": {
    "en": "Adults assess and designate a refuge before danger.",
    "fil": "Suriin at italaga ng adulto ang kanlungan bago ang panganib."
   },
   "why": {
    "en": "Reducing hazards before danger is prevention and mitigation.",
    "fil": "Pag-iwas at mitigasyon ang pagbawas ng panganib bago ito mangyari."
   }
  },
  {
   "id": "tsunami-m3",
   "pillar": "preparedness",
   "text": {
    "en": "Learn natural tsunami warnings before a drill.",
    "fil": "Alamin ang likas na babala ng tsunami bago ang drill."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "tsunami-m4",
   "pillar": "preparedness",
   "text": {
    "en": "Practise the inland and uphill route.",
    "fil": "Magsanay sa rutang papaloob at paakyat."
   },
   "why": {
    "en": "Planning, packing, learning, and drills before danger are preparedness.",
    "fil": "Paghahanda ang pagpaplano, pag-iimpake, pag-aaral, at drill bago ang panganib."
   }
  },
  {
   "id": "tsunami-m5",
   "pillar": "response",
   "text": {
    "en": "Leave the coast after strong shaking stops.",
    "fil": "Lumikas mula sa baybayin matapos ang malakas na pagyanig."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "tsunami-m6",
   "pillar": "response",
   "text": {
    "en": "Stay in the refuge during a lull between waves.",
    "fil": "Manatili sa kanlungan habang humuhupa sa pagitan ng alon."
   },
   "why": {
    "en": "Protecting people while danger is happening is response.",
    "fil": "Pagtugon ang pagprotekta sa tao habang may panganib."
   }
  },
  {
   "id": "tsunami-m7",
   "pillar": "recovery",
   "text": {
    "en": "Sort clean donations in a cleared dry center after clearance.",
    "fil": "Ayusin ang malinis na donasyon sa tuyong sentro matapos ang pahintulot."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  },
  {
   "id": "tsunami-m8",
   "pillar": "recovery",
   "text": {
    "en": "Redraw a practice hazard map during safe recovery.",
    "fil": "Iguhit muli ang pagsasanay na mapa habang ligtas na bumabangon."
   },
   "why": {
    "en": "Safe rebuilding, health, and emotional support after danger are recovery.",
    "fil": "Pagbangon ang ligtas na pag-aayos, kalusugan, at pagdamay matapos ang panganib."
   }
  }
 ]
};
})();
