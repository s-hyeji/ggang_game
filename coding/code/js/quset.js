const levelQuest = {
 positionX: 4500,
 idleMessage: '큰일이야..<br>사람들이 좀비로 변하고 있어..',
 quest: () => {
  const message = {
   start: "마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 5이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수				있도록 내 힘을 빌려주게!",
   ing: "이런 아직 레벨을 달성하지 못했구나..",
   suc: "레벨을 달성했구나! 힘을 줄게!",
   end: "고마워! 행운을 빌어!"
  }
  // 
  let messageState = "";
  // 
  if (!npcOne.qusetStat) {
   messageState = message.start;
   npcOne.qusetStat = true;
  } else if (npcOne.qusetStat && !npcOne.qusetEnd && hero.level < 5) {
   messageState = message.ing;
  } else if (npcOne.qusetStat && !npcOne.qusetEnd && hero.level >= 5) {
   messageState = message.suc;
   npcOne.qusetEnd = true;
   hero.heroUpgrade(10000);
   hero.updateExp(55000);
  } else if (npcOne.qusetEnd) {
   messageState = message.end;
  };
  // 
  let text = `<figure class="npc_img"><img src="../../lib/images/npc.png" alt="NPC"></figure>	<p>${messageState}</p>`;
  const modalInner = document.querySelector(".inner_box .quest_talk");
  modalInner.innerHTML = text;
 }
}

const levelQuestTwo = {
 positionX: 10000,
 idleMessage: '곧 좀비왕이 부활<br>하려고해...',
 quest: () => {
  const level = 9
  const message = {
   start: `마을에 몬스터가 출몰해 주민들을 좀비로 만들고 있어.. 몬스터를 사냥해 주민을 구하고 <span>레벨을 ${level}이상</span>으로 만들어 힘을 증명한다면 좀비왕을 물리칠 수	있도록 내 힘을 빌려주게!`,
   ing: "이런 아직 레벨을 달성하지 못했구나..",
   suc: "레벨을 달성했구나! 힘을 줄게!",
   end: "좀비왕은 오른쪽으로 더 가면 있어! 행운을 빌어!"
  }
  // 
  let messageState = "";
  // 
  if (!npcTwo.qusetStat) {
   messageState = message.start;
   npcTwo.qusetStat = true;
  } else if (npcTwo.qusetStat && !npcTwo.qusetEnd && hero.level < level) {
   messageState = message.ing;
  } else if (npcTwo.qusetStat && !npcTwo.qusetEnd && hero.level >= level) {
   messageState = message.suc;
   npcTwo.qusetEnd = true;
   hero.heroUpgrade(30000);
   hero.updateExp(500000);
  } else if (npcTwo.qusetEnd) {
   messageState = message.end;
  };
  // 
  let text = `<figure class="npc_img"><img src="../../lib/images/npc.png" alt="NPC"></figure>	<p>${messageState}</p>`;
  const modalInner = document.querySelector(".inner_box .quest_talk");
  modalInner.innerHTML = text;
 }
}

