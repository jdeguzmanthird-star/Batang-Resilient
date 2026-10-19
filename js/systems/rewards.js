/* One atomic profile write claims a run reward. Shared callbacks must present the captured student/run. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},ids=['typhoon','flood','earthquake','tsunami'];
 const active=id=>{const p=LE.Save.active();return p&&p.id===id?p:null;};
 function story(profileId,id,runId){const p=active(profileId),saved=p&&p.storyRuns&&p.storyRuns[id];if(!ids.includes(id)||!saved||saved.runId!==runId||runId.startsWith('debug-'))return null;const m=LE.Story.create(saved,undefined,id);return !m.recovered()&&m.isComplete()&&m.score().mini!==null?m:null;}
 function quiz(profileId,id,runId){const p=active(profileId);if(!p||!story(profileId,id,runId))return null;return LE.Assessment.create(id,runId,p.assessments&&p.assessments[id]);}
 function saveQuiz(profileId,id,runId,snapshot){const p=active(profileId);if(!p||!story(profileId,id,runId))return false;const q=LE.Assessment.create(id,runId,snapshot);if(q.recovered())return false;LE.Save.updateActive({assessments:{...(p.assessments||{}),[id]:q.serialize()},checkpoint:{stage:'quiz',storyId:id,runId}});return true;}
 const rating=score=>score>=85?3:score>=60?2:1;
 function finalize(profileId,id,runId){
  const p=active(profileId),m=story(profileId,id,runId);if(!p||!m)return null;if(p.completedRuns&&p.completedRuns[runId])return p.completedRuns[runId];
  const q=quiz(profileId,id,runId);if(!q||q.recovered()||!q.score())return null;const parts=m.score(),quizScore=q.score(),total=parts.decisions+parts.mini+quizScore.total,stars=rating(total),currency=total+10*stars;
  const result={version:1,profileId,runId,story:id,name:p.name,completedAt:new Date().toISOString(),decisions:parts.decisions,mini:parts.mini,quiz:quizScore.total,total,stars,currency,activeMs:m.state.activeMs,chapterMs:{...m.state.chapterMs},assessment:q.serialize()};
  const old=p.scenarioProgress[id]||{},previous=Number.isFinite(old.bestScore)?old.bestScore:0,bestScore=Math.max(previous,total);
  const aux=p.scenarioDirectors&&p.scenarioDirectors[id];let directors=p.scenarioDirectors;if(aux&&aux.runId===runId&&LE.ScenarioDirector){const director=LE.ScenarioDirector.create(id,p.storyRuns[id],aux);director.markResults();directors={...p.scenarioDirectors,[id]:director.serialize()};}
  LE.Save.updateActive({scenarioDirectors:directors,stars:p.stars+currency,completedRuns:{...(p.completedRuns||{}),[runId]:result},scenarioProgress:{...p.scenarioProgress,[id]:{...old,completed:true,chaptersComplete:true,completedPillars:LE.Data.pillars.map(x=>x.id),quizPending:false,bestScore,stars:rating(bestScore),latestRunId:runId,bestRunId:!old.bestRunId||total>=previous?runId:old.bestRunId}},highScores:{...p.highScores,[id]:Math.max(Number(p.highScores[id])||0,total)},checkpoint:{stage:'results',storyId:id,runId}});return result;
 }
 function result(profileId,runId){const p=LE.Save.get().slots.find(p=>p&&p.id===profileId),r=p&&p.completedRuns&&p.completedRuns[runId];return r&&r.profileId===profileId?r:null;}
 function unlocked(p,item){return !item.unlock||ids.every(id=>p.scenarioProgress[id]&&p.scenarioProgress[id].completed===true&&p.scenarioProgress[id].bestScore>=85);}
 function buy(profileId,id){const p=active(profileId),item=LE.Data.outfits.find(x=>x.id===id);if(!p||!p.characterCreated||!item||!unlocked(p,item))return 'locked';if(p.ownedOutfits.includes(id))return 'owned';if(p.stars<item.price)return 'funds';LE.Save.updateActive({stars:p.stars-item.price,ownedOutfits:[...p.ownedOutfits,id]});return 'bought';}
 function equip(profileId,id){const p=active(profileId);if(!p||!LE.Data.outfits.some(x=>x.id===id)||!p.ownedOutfits.includes(id))return false;LE.Save.updateActive({equippedOutfit:id});return true;}
 function day(date=new Date()){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
 function daily(profileId){const p=active(profileId);if(!p||!p.characterCreated)return null;const today=day();if(p.dailyRewards&&p.dailyRewards[today])return {claimed:true,day:today};const old=p.dailyQuiz,s=old&&old.day===today&&ids.includes(old.story)?old.story:ids[Math.floor(Math.random()*ids.length)],runId='daily-'+today;
  return {claimed:false,day:today,story:s,model:LE.Assessment.create(s,runId,old&&old.day===today?old.quiz:null,{daily:true})};
 }
 function saveDaily(profileId,date,id,snapshot){const p=active(profileId);if(!p||date!==day()||!ids.includes(id)||p.dailyRewards&&p.dailyRewards[date])return false;const q=LE.Assessment.create(id,'daily-'+date,snapshot,{daily:true});if(q.recovered())return false;LE.Save.updateActive({dailyQuiz:{day:date,story:id,quiz:q.serialize()},checkpoint:{stage:'quick-quiz'}});return true;}
 function claimDaily(profileId){const p=active(profileId),d=daily(profileId);if(!p||!d||d.claimed||!d.model.score())return false;LE.Save.updateActive({stars:p.stars+10,dailyRewards:{...(p.dailyRewards||{}),[d.day]:true},checkpoint:{stage:'disaster-select'}});return true;}
 LE.Rewards={story,quiz,saveQuiz,rating,finalize,result,unlocked,buy,equip,day,daily,saveDaily,claimDaily};
})();
