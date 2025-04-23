class Stage {
 constructor() {
  this.level = 0;
  this.isStart = false;
 }

 stageGuide(text) {
  this.parentNode = document.querySelector(".game_app");
  this.textBox = document.createElement("div");
  this.textBox.className = "stage_box";
  this.textNode = document.createTextNode(text);
  this.textBox.appendChild(this.textNode);
  this.parentNode.appendChild(this.textBox)

  setTimeout(() => this.textBox.remove(), 1500);
 }
 callMonster() {
  for (let i = 0; i <= 12; i++) {
   if (i === 12) {
    allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.moveX + gameProp.screenWidth + 700 * i);
   } else {
    allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.moveX + gameProp.screenWidth + 900 * i);
   }
  }
 }
 clearCheck() {
  stageInfo.callPositon.forEach(arr => {
   // console.log(arr);
   if (hero.moveX >= arr && allMonsterComProp.arr.length === 0) {
    this.stageGuide("곧 몬스터가 몰려옵니다!");
    stageInfo.callPositon.shift();
    console.log(arr);
    setTimeout(() => {
     this.callMonster();
     this.level++;
     // if (!this.level < stageInfo.monster.length) this.stageGuide("ALL CLEAR!!");
    }, 1000);
   }
  });
  // if (allMonsterComProp.arr.length === 0 && this.isStart) {
  //  this.isStart = false;
  //  this.level++;
  //  if (this.level < stageInfo.monster.length) {
  //   this.stageStart();
  //   this.stageGuide("CLEAR!!");
  //  } else {
  //   this.stageGuide("ALL CLEAR!!");
  //  }
  // };
 }
}

class Hero {
 constructor(el) {
  this.el = document.querySelector(el);
  this.moveX = 0;
  this.speed = 8;
  this.direction = 'right'
  this.attackDamage = 10000;
  this.hpProgress = 0;
  this.hpValue = 100000;
  this.defaultHpValue = this.hpValue;
  this.realDamage = 0;
  this.slideSpeed = this.speed + 5;
  this.slideTime = 0;
  this.slideMaxTime = 30;
  this.slideDown = false;
  this.level = 1;
  this.exp = 0;
  this.maxExp = 3000;
  this.expProgress = 0;
 }
 keyMotion() {
  if (key.keyDown['left']) {
   this.direction = 'left'
   this.el.classList.add("run", "flip");
   this.moveX = this.moveX <= 0 ? 0 : this.moveX - this.speed
   // 
  } else if (key.keyDown['right']) {
   this.direction = 'right'
   this.el.classList.add("run");
   this.el.classList.remove("flip");
   this.moveX = this.moveX + this.speed
  }
  if (key.keyDown['attack']) {
   if (!bulletComProp.launch) {
    this.el.classList.add("attack");
    bulletComProp.arr.push(new Bullet());

    bulletComProp.launch = true;
   }
  }
  if (key.keyDown["slide"]) {
   if (!this.slideDown) {
    this.el.classList.add("slide");
    if (this.direction === "right") {
     this.moveX = this.moveX + this.slideSpeed;
    } else if (this.direction === "left") {
     this.moveX = this.moveX - this.slideSpeed;
    }
    if (this.slideTime > this.slideMaxTime) {
     this.el.classList.remove("slide");
     this.slideDown = true
    }

    this.slideTime += 1;
   }
  }

  if (!key.keyDown['left'] && !key.keyDown['right']) {
   this.el.classList.remove("run");
  }
  if (!key.keyDown['attack']) {
   this.el.classList.remove("attack");
   bulletComProp.launch = false;
  }
  if (!key.keyDown['attack']) {
   this.el.classList.remove("attack");
   bulletComProp.launch = false;
  }
  if (!key.keyDown['slide']) {
   this.el.classList.remove("slide");
   this.slideDown = false;
   this.slideTime = 0;
  }

  this.el.parentNode.style.transform = `translateX(${this.moveX}px)`
 }
 position() {
  return {
   left: this.el.getBoundingClientRect().left,
   right: this.el.getBoundingClientRect().right,
   top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
   bottom: gameProp.screenHeight - this.el.getBoundingClientRect().height - this.el.getBoundingClientRect().top,
  }
 }
 size() {
  return {
   width: this.el.offsetWidth,
   height: this.el.offsetHeight,
  }
 }
 minusHp(monsterDamage) {
  this.hpValue = Math.max(0, this.hpValue - monsterDamage);
  this.crash();
  if (this.hpValue === 0) {
   this.dead();
  }
  this.renderHp();
 }
 plusHp(hp) {
  this.hpValue = hp;
  this.renderHp();
 }
 renderHp() {
  this.hpProgress = this.hpValue / this.defaultHpValue * 100;
  const heroHpBox = document.querySelector('.state_box .hp span');
  heroHpBox.style.width = this.hpProgress + "%";
 }
 crash() {
  this.el.classList.add("crash");
  setTimeout(() => this.el.classList.remove("crash"), 800);
 }
 dead() {
  this.el.classList.add("dead");
  endGame();
 }
 hitDamage() {
  this.realDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1)
 }
 heroUpgrade(upDamage) {
  let damage = upDamage ?? 5000;
  this.attackDamage += damage;
 }
 updateExp(exp) {
  this.exp += exp;
  this.expProgress = this.exp / this.maxExp * 100;
  const heroExpBox = document.querySelector('.state_box .exp span');
  heroExpBox.style.width = this.expProgress + "%";

  if (this.exp >= this.maxExp) {
   this.levelUp();
  }
 }
 levelUp() {
  this.level++;
  this.exp = 0;
  this.maxExp = this.maxExp + this.level * 1000;

  document.querySelector(".level_box strong").innerHTML = this.level;
  const levelGuide = document.querySelector(".hero_box .level_up");

  levelGuide.classList.add("active");
  setTimeout(() => { levelGuide.classList.remove("active") }, 1000);
  this.updateExp(this.exp);
  this.heroUpgrade();
  this.plusHp(this.defaultHpValue);
 }
}

class Npc {
 constructor(property) {
  this.property = property;
  this.parentNode = document.querySelector(".game");
  this.el = document.createElement('div');
  this.el.className = "npc_box";
  this.npcCrash = false;
  this.talkOn = false;
  this.modal = document.querySelector(".quest_modal");
  this.qusetStat = false;
  this.qusetEnd = false;

  this.init();
 }
 init() {
  let npcTalk = `<div class="talk_box"><p> ${this.property.idleMessage}<br> <span>대화 Enter</span></p></div><div class="npc"></div>`;
  this.el.innerHTML = npcTalk;
  this.el.style.left = this.property.positionX + "px";
  this.parentNode.appendChild(this.el);
 }
 position() {
  return {
   left: this.el.getBoundingClientRect().left,
   right: this.el.getBoundingClientRect().right,
   top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
   bottom: gameProp.screenHeight - this.el.getBoundingClientRect().height - this.el.getBoundingClientRect().top,
  }
 }
 crash() {
  if (hero.position().right > this.position().left && hero.position().left < this.position().right) {
   this.npcCrash = true;
  } else {
   this.npcCrash = false;
  }
 }
 talk() {
  if (!this.talkOn && this.npcCrash) {
   this.talkOn = true;
   this.property.quest();
   this.modal.classList.add("active");
  } else if (this.talkOn) {
   this.talkOn = false;
   this.modal.classList.remove("active");
  }
 }

}

class Bullet {
 constructor() {
  this.parentNode = document.querySelector(".game");
  this.el = document.createElement('div');
  this.el.className = 'hero_bullet';
  this.x = 0;
  this.y = 0;
  this.speed = 30;
  this.distance = 0;
  this.bulletDirection = "right";
  this.init();
 }
 init() {
  this.bulletDirection = hero.direction === "left" ? "left" : "right"
  this.x = this.bulletDirection === 'right' ? hero.moveX + hero.size().width / 2 : (hero.moveX + 50) - hero.size().width / 2;
  this.y = hero.position().bottom - hero.size().height / 2;
  this.distance = this.x;
  // 
  this.el.style.transform = `translate(${this.x}px, ${this.y}px)`
  this.parentNode.appendChild(this.el);
 }
 moveBullet() {
  let setRotate = "";
  if (this.bulletDirection === "left") { this.distance -= this.speed; setRotate = 'rotate(180deg)' }
  else this.distance += this.speed;

  this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`
  this.crashBullet();
 }
 position() {
  return {
   left: this.el.getBoundingClientRect().left,
   right: this.el.getBoundingClientRect().right,
   top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
   bottom: gameProp.screenHeight - this.el.getBoundingClientRect().height - this.el.getBoundingClientRect().top,
  }
 }
 crashBullet() {
  for (let j = 0; j < allMonsterComProp.arr.length; j++) {

   if (this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right) {
    for (let i = 0; i < bulletComProp.arr.length; i++) {
     if (bulletComProp.arr[i] === this) {
      hero.hitDamage();
      bulletComProp.arr.splice(i, 1);
      this.el.remove();
      this.damegeView(allMonsterComProp.arr[j]);
      allMonsterComProp.arr[j].updateHp(j);
     }
    }
   }
  }
  if (this.position().left > gameProp.screenWidth || this.position().right < 0) {
   for (let i = 0; i < bulletComProp.arr.length; i++) {
    if (bulletComProp.arr[i] === this) {
     bulletComProp.arr.splice(i, 1);
     this.el.remove();
    }
   }
  }
 }
 damegeView(monster) {
  this.parentNode = document.querySelector(".game_app");
  this.textDamageNode = document.createElement("div");
  this.textDamageNode.className = "text_damage";
  this.textDamage = document.createTextNode(hero.realDamage);
  this.textDamageNode.appendChild(this.textDamage);
  this.parentNode.appendChild(this.textDamageNode);
  let textPositon = Math.random() * -100;
  let damegeX = monster.position().left + textPositon;
  let damegeY = monster.position().top;

  this.textDamageNode.style.transform = `translate(${damegeX}px, ${-damegeY}px)`;
  setTimeout(() => this.textDamageNode.remove(), 500);
 }
}

class Monster {
 constructor(property, positionX) {
  this.parentNode = document.querySelector(".game");
  this.el = document.createElement('div');
  this.el.className = "monster_box " + property.name;
  this.elChildren = document.createElement('div');
  this.elChildren.className = "monster";
  this.hpNode = document.createElement('div');
  this.hpNode.className = "hp";
  this.hpValue = property.hpValue;
  this.defaultHpValue = property.hpValue;
  this.hpInner = document.createElement('span');
  this.progress = 0;
  this.positionX = positionX;
  this.moveX = 0;
  this.speed = property.speed;
  this.crashDamage = property.crashDamage;
  this.score = property.score;
  this.exp = property.exp;

  this.init();
 }
 init() {
  this.hpNode.appendChild(this.hpInner);
  this.el.appendChild(this.hpNode);
  this.el.appendChild(this.elChildren);
  this.parentNode.appendChild(this.el);

  this.el.style.left = this.positionX + 'px';
 }
 position() {
  return {
   left: this.el.getBoundingClientRect().left,
   right: this.el.getBoundingClientRect().right,
   top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
   bottom: gameProp.screenHeight - this.el.getBoundingClientRect().height - this.el.getBoundingClientRect().top,
  }
 }
 updateHp(index) {
  this.hpValue = Math.max(0, this.hpValue - hero.realDamage)
  this.progress = this.hpValue / this.defaultHpValue * 100;
  this.el.children[0].children[0].style.width = this.progress + "%";
  // console.log(this.progress);

  if (this.hpValue === 0) {
   this.dead(index);
  }
 }
 dead(index) {
  this.el.classList.add("remove");
  setTimeout(() => this.el.remove(), 200);
  allMonsterComProp.arr.splice(index, 1)
  this.setScore();
  this.setExp();
 }
 moveMonster() {
  if (this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.moveX <= 0) {
   this.moveX = hero.moveX - this.positionX + gameProp.screenWidth - hero.position().left;
  } else {
   this.moveX -= this.speed;
  }

  this.el.style.transform = `translateX(${this.moveX}px)`;
  this.crash();
 }
 crash() {
  let rightDiff = 30;
  let leftDiff = 90;

  if (hero.position().right - rightDiff >= this.position().left && hero.position().left + leftDiff < this.position().right) {
   hero.minusHp(this.crashDamage);
  }
 }
 setScore() {
  stageInfo.totalScore += this.score;
  document.querySelector('.score_box').innerHTML = stageInfo.totalScore;
 }
 setExp() {
  hero.updateExp(this.exp);
 }
}