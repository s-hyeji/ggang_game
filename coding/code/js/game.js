const key = {
 keyDown: {},
 keyValue: {
  37: 'left',
  39: 'right',
  38: 'up',
  40: 'down',
  88: 'attack',
  67: "slide",
  13: "enter"
 }
}

const allMonsterComProp = {
 arr: [],
}

const bulletComProp = {
 launch: false,
 arr: [],
}

const gameBackground = {
 gameBox: document.querySelector(".game")
}
const stageInfo = {
 stage: [],
 totalScore: 0,
 monster: [
  { defaultMon: greenMon, bossMon: greenMonBoss },
  { defaultMon: yellowMon, bossMon: yellowMonBoss },
  { defaultMon: pinkMon, bossMon: pinkMonBoss },
  { defaultMon: pinkMon, bossMon: zobieKing },
 ],
 callPositon: [1000, 5000, 9000, 20000]
}
const gameProp = {
 screenWidth: window.innerWidth,
 screenHeight: window.innerHeight,
 gameOver: false,
}

const renderGame = () => {
 hero.keyMotion();
 npcOne.crash();
 npcTwo.crash();

 setGameBackground();
 bulletComProp.arr.forEach((arr, i) => { arr.moveBullet(); });
 allMonsterComProp.arr.forEach((arr, i) => { arr.moveMonster(); });
 stageInfo.stage.clearCheck();
 // 
 window.requestAnimationFrame(renderGame);
}

const endGame = () => {
 gameProp.gameOver = true;
 key.keyDown.left = false;
 key.keyDown.right = false;
 document.querySelector(".game_over").classList.add("on");
}

const setGameBackground = () => {
 let parallaxValue = Math.min(0, (hero.moveX - gameProp.screenWidth / 3) * -1);
 gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`
}

const windowEvent = () => {
 // 
 window.addEventListener("keydown", e => {
  // console.log(e.which);
  if (!gameProp.gameOver) key.keyDown[key.keyValue[e.which]] = true;
  if (key.keyDown["enter"]) {
   npcOne.talk();
   npcTwo.talk();
  }
 });
 window.addEventListener("keyup", e => {
  key.keyDown[key.keyValue[e.which]] = false;
 });
 // 
 window.addEventListener("resize", e => {
  gameProp.screenWidth = window.innerWidth;
  gameProp.screenHeight = window.innerHeight;
 });
};

const loadImg = () => {
 const preLoadImgSrc = [
  '../../lib/images/ninja_attack.png',
  '../../lib/images/ninja_run.png',
  '../../lib/images/ninja_slide.png',
 ]
 preLoadImgSrc.forEach(arr => {
  const img = new Image();
  img.src = arr;
 })
}

let hero;
let npcOne;
let npcTwo;

const init = () => {
 hero = new Hero('.hero');
 stageInfo.stage = new Stage();
 npcOne = new Npc(levelQuest);
 npcTwo = new Npc(levelQuestTwo);

 windowEvent();
 loadImg();
 renderGame();
}

window.onload = () => {
 init();
}

