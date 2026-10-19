/* A draft editor: only Save character changes the active student's profile. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};
  function open(options={}){
    const profile=LE.Save.active();if(!profile)return LE.UI.slots();
    const h=LE.UI.h,language=LE.Save.get().settings.language,T=LE.Data.profileText[language];
    const draft={name:profile.name,gender:profile.gender||'unspecified',appearance:{...profile.appearance}};
    draft.appearance.spriteSet=draft.appearance.spriteSet||(draft.gender==='girl'?'girl':'boy');
    let direction='down',alive=true,raf=null,last=-100,dirty=true;
    const nameplate=h('strong',{id:'character-nameplate'},draft.name);
    const error=h('p',{id:'character-name-error',className:'form-error',role:'alert'});
    const counter=h('span',{id:'character-name-count',className:'field-counter'},Array.from(draft.name).length+'/12');
    const nameInput=h('input',{id:'character-name',type:'text',value:draft.name,maxLength:12,autoComplete:'off',spellcheck:false,'aria-describedby':'character-name-hint character-name-error',oninput:()=>{
      draft.name=nameInput.value;validate();dirty=true;
    }});
    const form=h('form',{id:'character-form',noValidate:true});
    const saveButton=h('button',{type:'submit',id:'save-character',className:'primary'},T.save);
    // HTMLButtonElement.form is read-only; associate the footer button as an attribute.
    saveButton.setAttribute('form',form.id);
    function validate(){
      const checked=LE.Save.validateCharacter(draft);
      saveButton.disabled=!checked.ok;
      nameInput.setAttribute('aria-invalid',String(!checked.ok));
      error.textContent=checked.ok?'':T[checked.reason];
      counter.textContent=Array.from(draft.name.trim()).length+'/12';
      nameplate.textContent=draft.name.trim()||'Bata';
      return checked;
    }
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!validate().ok){nameInput.focus();return;}
      const result=LE.Save.saveCharacter(draft,profile.id);
      if(!result.ok){error.textContent=T[result.reason]||T.profileChanged;return;}
      LE.Audio.play('success');
      LE.DisasterSelectScene.open();
      LE.UI.toast(result.persistent?T.saved:T.temporary);
    });
    form.append(h('div',{className:'profile-field'},h('div',{className:'field-heading'},h('label',{htmlFor:nameInput.id},T.name),counter),nameInput,
      h('p',{id:'character-name-hint',className:'hint'},T.nameHint),error));
    const genderFields=h('fieldset',{className:'gender-options'},h('legend',{},T.gender));
    const genderControls=[];
    for(const gender of ['boy','girl','unspecified']){
      const input=h('input',{type:'radio',name:'character-gender',id:'character-gender-'+gender,value:gender,checked:draft.gender===gender});
      input.addEventListener('change',()=>{
        if(!input.checked)return;
        draft.gender=gender;
        if(gender!=='unspecified'){draft.appearance.spriteSet=gender;setSelect.value=gender;updateHairOptions();}
        genderControls.forEach(other=>{other.checked=other===input;});dirty=true;
      });
      genderControls.push(input);genderFields.append(h('label',{className:'gender-choice',htmlFor:input.id},input,h('span',{},T[gender])));
    }
    form.append(genderFields);
    function selectField(id,label,items,value,onChange){
      const select=h('select',{id:'character-'+id});
      items.forEach(([key,text])=>select.append(h('option',{value:String(key),selected:String(key)===String(value)},text)));
      select.addEventListener('change',()=>{onChange(select.value);dirty=true;});
      form.append(h('div',{className:'profile-field compact-field'},h('label',{htmlFor:select.id},label),select));
      return select;
    }
    const setSelect=selectField('sprite-set',T.spriteSet,[['boy',T.short],['girl',T.long]],draft.appearance.spriteSet,value=>{draft.appearance.spriteSet=value;updateHairOptions();});
    const hairSelect=selectField('hair-style',T.hair,[0,1,2].map(i=>[i,T[(draft.appearance.spriteSet==='girl'?'long':'short')+i]]),draft.appearance.hairStyle,value=>{draft.appearance.hairStyle=Number(value);});
    function updateHairOptions(){
      hairSelect.replaceChildren(...[0,1,2].map(i=>h('option',{value:String(i),selected:i===draft.appearance.hairStyle},T[(draft.appearance.spriteSet==='girl'?'long':'short')+i])));
    }
    function swatches(key,label,colors,labels){
      const group=h('fieldset',{className:'profile-swatches'},h('legend',{},label));
      const buttons=[];
      colors.forEach((color,index)=>{
        const button=h('button',{type:'button',id:'character-'+key+'-'+index,className:'swatch-button','aria-label':labels[index],'aria-pressed':String(draft.appearance[key]===index),onclick:()=>{
          draft.appearance[key]=index;
          buttons.forEach((other,i)=>{other.setAttribute('aria-pressed',String(i===index));other.classList.toggle('is-selected',i===index);});dirty=true;
        }},h('span',{className:'swatch-dot','aria-hidden':'true'}),h('span',{},labels[index]));
        button.style.setProperty('--swatch',color);button.classList.toggle('is-selected',draft.appearance[key]===index);
        buttons.push(button);group.append(button);
      });form.append(group);
    }
    swatches('skin',T.skin,LE.Art.skinTones,LE.Art.skinTones.map((_,i)=>T.tone+' '+(i+1)));
    swatches('hairColor',T.hairColor,LE.Art.hairColors,[T.black,T.brown,T.chestnut,T.blue]);
    const preview=h('canvas',{id:'character-preview',width:384,height:208,className:'art-canvas','aria-label':T.preview,role:'img'}),c=preview.getContext('2d');
    const previewBox=h('div',{className:'character-preview-box'},h('span',{className:'stage-label'},'JUNIOR DRRM CLUB'),preview,
      h('div',{className:'character-nameplate'},nameplate,h('small',{},T.uniform)),h('p',{className:'hint'},T.idle+' / '+T.walk));
    const facing=h('select',{id:'character-direction','aria-label':T.facing});
    LE.Art.directions.forEach(value=>facing.append(h('option',{value,selected:value===direction},T[value])));
    facing.addEventListener('change',()=>{direction=facing.value;dirty=true;});
    previewBox.append(h('div',{className:'art-control'},h('label',{htmlFor:facing.id},T.facing),facing));
    if(LE.Save.get().settings.reducedMotion)previewBox.append(h('p',{className:'hint'},T.motion));
    const body=h('div',{},h('p',{},T.intro),h('div',{className:'character-layout'},previewBox,form),h('p',{className:'draft-note'},T.draft));
    const back=h('button',{type:'button',className:'secondary',onclick:()=>options.from==='selection'?LE.DisasterSelectScene.open():LE.UI.slots()},T.cancel);
    const dialog=LE.UI.modal(profile.characterCreated?T.edit:T.create,body,[back,saveButton],()=>{alive=false;if(raf!==null)window.cancelAnimationFrame(raf);});
    dialog.classList.add('character-dialog');
    validate();
    function paint(timestamp){
      if(!alive)return;
      const reduced=LE.Save.get().settings.reducedMotion;
      if(c&&!document.hidden&&(dirty||!reduced&&timestamp-last>=80)){
        c.clearRect(0,0,384,208);
        for(let y=0;y<208;y+=32)for(let x=0;x<384;x+=32)LE.Art.drawTile(c,y>=144?'grass':'floor_blue',x,y);
        LE.Art.drawProp(c,'noticeboard',22,24,1.5);LE.Art.drawProp(c,'flowerpot',319,127,1.5);
        const art={...draft.appearance,gender:draft.appearance.spriteSet,outfit:profile.equippedOutfit,direction,time:timestamp/1000,reducedMotion:reduced};
        LE.Art.drawCharacter(c,115,193,{...art,walking:false},4);
        LE.Art.drawCharacter(c,254,190,{...art,walking:true},3);
        LE.Art.drawCharacter(c,307,195,{npc:'bantay',direction:'left',frame:0,vest:profile.equippedOutfit==='k9',reducedMotion:reduced},1.5);
        dirty=false;last=timestamp;
      }
      raf=window.requestAnimationFrame(paint);
    }
    paint(0);nameInput.focus();
  }
  LE.CharacterScene={open};
})();
