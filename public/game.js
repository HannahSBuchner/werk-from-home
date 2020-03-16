const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-game',
    backgroundColor: 0xffffff,
    width: 1400,
    height: 780,
    _resolution: window.devicePixelRatio,
      resolution: 3,
    scene: {
      preload,
      create,
      update
    }
  };

const game = new Phaser.Game(config);

function preload () {
this.load.image('bg','assets/laptop.png');
this.load.image('cat', 'assets/cat.png');
this.load.audio ("cat", 'assets/cat.wav');
this.load.image('dog', 'assets/dog.png');
this.load.audio("dog", 'assets/dog.wav');
this.load.image('food1', 'assets/food1.png');
this.load.audio("food1", 'assets/silence.wav');
this.load.image('food2', 'assets/food2.png');
this.load.audio("food2", 'assets/food2.mp3');
this.load.image('full', 'assets/full.png');
this.load.audio("full", 'assets/silence.wav');
this.load.image('babysloth', 'assets/babysloth.png');
this.load.audio("babysloth", 'assets/silence.wav');
this.load.image('hand', 'assets/hand.png');
this.load.audio("hand", 'assets/hand.mp3');
this.load.image('butt', 'assets/butt.png');
this.load.audio("butt", 'assets/silence.wav');
this.load.image('msg', 'assets/msg.png');
this.load.audio("msg", 'assets/msg.wav')
this.load.image('troll', 'assets/troll.png');
this.load.audio("troll", 'assets/silence.wav');
this.load.image('exhausted', 'assets/exhausted.png');
this.load.audio("exhausted", 'assets/silence.wav');
this.load.image('emilio', 'assets/emilio.png');
this.load.audio("emilio", 'assets/emilio.mp3');
this.load.image('google', 'assets/the-k-hole.jpg');
this.load.audio("google", 'assets/silence.wav');
this.load.image('winner', 'assets/winner.png');
this.load.audio("winner", 'assets/winner.wav');
this.load.image('child', 'assets/child.png');
this.load.audio('child', 'assets/silence.wav');
this.load.image('coffee', 'assets/coffee.png');
this.load.audio("coffee", 'assets/silence.wav');
this.load.image('spiral', 'assets/spiral.png');
this.load.audio("spiral", 'assets/silence.wav');
}

let gameState = {}
let characters = [];

function create () {

  gameState.bg = this.add.image(0, 0, 'bg')
  gameState.bg.setOrigin(0,0)
  gameState.bg.setDisplaySize(1000,780)

  gameState.title=this.add.text(1050, 10, `werkin' from home: \na cautionary tale`,{ fontSize: 24, fill: '#000000'})
  gameState.subTitle=this.add.text(1050, 70, '<move distractions out of the way\n and try to stay on task!>', {fontSize: 16, fontStyle: 'italic', fill: '#000000'})

  gameState.cursors = this.input.keyboard.createCursorKeys();

  initializePage(this);

  const firstPage = fetchPage(1);
  displayPage(this, firstPage);
}

function update() {
   if(gameState.cursors.right.isDown) {
    gameState.character.x += 20;
    gameState.character.sound.play();
   }

   if(gameState.cursors.left.isDown) {
     gameState.character.x -= 20
     gameState.character.sound.play();
   }

  if(gameState.cursors.up.isDown) {
     gameState.character.y -= 20
     gameState.character.sound.play();
   }

   if(gameState.cursors.down.isDown) {
     gameState.character.y +=20
     gameState.character.sound.play();
   }
}

function renderCharacter (scene, key) {
    gameState.character= scene.add.sprite(500, 720, key)

    gameState.character.setOrigin(.5, 1).setScale(.9)

    characters.push(gameState.character);

    gameState.character.sound = scene.sound.add(key);
  }

function restartCharacters () {
    for (let i=0; i<characters.length; i++){
        characters[i].destroy()
      }
      characters=[];
  }

  function initializePage(scene) {
    if (!gameState.options) {
      gameState.options = [];
    }
  }

  function destroyPage() {
    if (gameState.narrative) {
      gameState.narrative.destroy();
    }
    for (let option of gameState.options) {
      if(option.optionBox) option.optionBox.destroy();
      option.optionText.destroy();
    }
  }

  var n=0;

  function displayPage(scene, page) {

    const narrativeStyle = { fill: '#000000', fontSize: 26, fontWeight: 'bold', align: 'left', wordWrap: { width: 740 }, lineSpacing: 8};

    // display general page character
    // & narrative here:
    if(page.character) {
        setTimeout(function(){renderCharacter(scene, page.character)}, 2000);
    }
    gameState.narrative = scene.add.text(150, 90, '', narrativeStyle);

    function typeWriter(text, n, innerText) {
    var text=gameState.narrative;
    var innerText=page.narrative;
    if(n<innerText.length)
    {  text.text += innerText.charAt(n);  n++; setTimeout(function(){    typeWriter(text, n, innerText)},10); }}

    typeWriter(gameState.narrative, 0, page.narrative)

    // for-loop creates different options
    // need the index i for spacing the boxes
    for (let i=0; i<page.options.length; i++) {
      let option = page.options[i];

      // add in the option text
      const baseX = 250 + i * 300;
      const optionText = scene.add.text(baseX, 320, option.option, { fontSize:20, fontWeight: 'bold', fill:'#000000', align: 'center', wordWrap: {width: 250}, maxLines: 4})

      const optionTextBounds = optionText.getBounds()

      // centering each option text
      optionText.setX(optionTextBounds.x + 90 - (optionTextBounds.width / 2));
      optionText.setY(optionTextBounds.y + 10 - (optionTextBounds.height / 2));

      // add in gameplay functionality
      // for options here
    optionText.setInteractive();

    optionText.on('pointerup', function () {
    const newPage = this.option.nextPage;
    if(newPage === 1){
      destroyPage();
      displayPage(scene, fetchPage(newPage));
      restartCharacters()
      }
      else if(newPage!== undefined){
      destroyPage();
      displayPage(scene, fetchPage(newPage));
    }
  }, { option });
  gameState.options.push({optionText});
    }
  }

function fetchPage(page) {
   const pages = [
     {
      page: 1,
      narrative: `Turns out you're working from home today due to personal reasons and/or a global health apocalypse! Your boss just emailed. She's counting on YOU to get the deck to the client by 4pm. Can you do it? Working from home ain't always as easy as it seems!`,
      options: [
        { option: `CLICK TO START`,   nextPage: 2 }
      ]
    },

    {
      character: 'cat',
      page: 2,
      narrative: `Just as you're about to put down some of the finest ideas ever crafted by the human mind, Fluffles has other plans. And those plans involve sitting directly atop your keyboard.`,
      options: [
        { option: '//Pet Fluffles with one hand while typing around him with the other.//',     nextPage: 3 },
        { option: '//Ask Fluffles to move, like the heartless monster you are.//',   nextPage: 4 },
      ]
    },

    {
      character: 'dog',
      page: 4,
      narrative: "Fluffles grows bored of you and leaves. Finally! It's business time. Or so you thought. Now Scruffles is whining at you. God damn it, Scruffles!  ",
      options: [
        { option: '//Pretend to see a squirrel in the hallway. Shut office door.//',   nextPage: 11 },
        { option: '//Sigh loudly and get up to feed Scruffles.//',   nextPage: 5 },
      ]
    },

    {
      character: 'food1',
      page: 5,
      narrative: `If Scruffles gets to eat, why shouldn't you? Don't you also deserve a treat for...existing?`,
      options: [
        { option: '//Grab a snack.//',   nextPage: 6 }]
    },

    {
      character: 'food2',
      page: 6,
      narrative: `You have now consumed all cheese-based food items in your possession. Suddenly, you remember there is \nice cream in the freezer. F%#@ yeah.`,
      options: [
        { option: '//Keep Eating.//',   nextPage: 7 },
      ]
    },

    {
      character: 'full',
      page: 7,
      narrative: `Oh god. You are so full. You attempt to return to your desk but you can't even sit comfortably.`,
      options: [
        { option: '//Lie down and take a 4 hour nap.//',   nextPage: 8 }]
    },

    {
      character: 'babysloth',
      page: 8,
      narrative: '//Who takes a FOUR hour nap?! Are you a newborn? A sloth? A newborn sloth? GAME OVER! YOU LOSE!//',
      options: [
        { option: 'PLAY AGAIN!',   nextPage:  1}]
    },


    {
      character: 'hand',
      page: 3,
      narrative: `All the petting is making your hand cramp up. Uh oh. You're fairly young. Why is that happening? Is that normal?`,
      options: [
        { option: `//Google: 'hand cramp possible sign of imminent death?//`,   nextPage: 9 }, { option: '//Power Through!//',   nextPage: 10 }
      ]
    },

    {
      character: 'butt',
      page: 10,
      narrative: `You are finally getting into a work groove. Yay. After reading your boss's latest email, you mindlessly check Instagram and notice your crush just posted an epic thirst trap.`,
      options: [
        { option: '//Fall right in it.//',   nextPage: 16 }, { option: '//Summon willpower, put phone down.//',   nextPage: 18 },
      ]
    },

    {
      character: 'msg',
      page: 16,
      narrative: `DING! You just got a DM! OMG it's your crush! You tap on the message, heart pounding. The message begins: "Hey...Do I know you?"`,
      options: [
        { option: '//Cry under your covers for at least an hour//',   nextPage: 12 },
      ]
    },

    {
      character: 'troll',
      page: 18,
      narrative: `You read a blogpost, telling yourself it is 'research'. You spot a suuuuper ignorant and annoying comment at the bottom.`,
      options: [
        { option: `//Hit 'Reply'.//`, nextPage: 19 }, {option: '//Roll eyes, move on.//', nextPage: 20 }
      ]
    },

    {
      character: 'exhausted',
      page: 19,
      narrative: `It is now 3AM. You have been arguing with a Russian internet bot for 14 straight hours. GAME OVER! YOU LOSE!`,
      options: [
        { option: 'PLAY AGAIN!',  nextPage: 1 }
      ]
    },

    {
      character: 'emilio',
      page: 20,
      narrative: 'Wow. 3/4 of the deck is done! The finish line is near. Out of nowhere, you remember that Emilio Estevez exists. Say, where has that guy been?',
      options: [
        { option: 'Google: "Is Emilio Estevez OK?"',  nextPage: 9 },
        { option: '//Resist Urge to Google Random 80s Celeb//',   nextPage: 21 },
      ]
    },

    {
      character: 'google',
      page: 9,
      narrative: `Oh no! You have been sucked into the dreaded Google K-Hole! Even if you wanted to stop Googling, you couldn't! All hope for productivity is now lost forever. GAME OVER! YOU LOSE!`,
      options: [
        { option: 'PLAY AGAIN!',  nextPage: 1 },
      ]
    },

    {
      character: 'winner',
      page: 21,
      narrative: 'YOU WIN AT WORKING FROM HOME!!!!!!!!!!!!!!!!! YOU. ARE. SPARTACUS!',
      options: [
        { option: 'PLAY AGAIN!',     nextPage: 1 }
      ]
    },

    {
      character: 'child',
      page: 11,
      narrative: `A small, crying child pulls at your sleeve. You pat their head comfortingly for several moments, then remember you don't have any kids.`,
      options: [
        { option: '//Return lost child to neighbor//.', nextPage: 12 }
      ]
    },

    {
      character: 'coffee',
      page: 12,
      narrative: `You've been back at your desk for a solid 12 minutes. Woo! How about a coffee break?`,
      options: [
        { option: `//Had 4 cups already today but OK! SURE! Weee!//`, nextPage: 13 }, {option: `//Stay the Course.//`, nextPage: 20}
      ]
    },

    {
      character: 'spiral',
      page: 13,
      narrative: `You are officially over-caffeinated. You are now entering the PANIC SPIRAL of DOOM. Enjoy rocking back and forth in your chair until sundown. GAME OVER!`,
      options: [
        { option: 'PLAY AGAIN!', nextPage: 1 },
      ]
    }

   ]

  return pages.find(function(e) { if(e.page == page) return e });
}
