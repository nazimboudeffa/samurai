var game = new Phaser.Game(20 * 16, 15 * 16, Phaser.CANVAS, 'samurai-lantern');

var player, lantern, sword, skull, play, how, quit;
var facing = 'idle';
var cursors;
var jumpButton;
var jumpTimer = 0;
var map;
var layer, layer2;
var key;
var scaleRatio = 2;
var tile_size = 16;

bootState = {
  preload: function() {
    game.load.image("progressBar", "assets/preloader.png"),
    game.load.image("progressBarBg", "assets/preloaderbg.png"),
    game.load.image("logo", "assets/logo.png")
  },
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL,
    game.scale.maxWidth = 800,
    game.scale.maxHeight = 600,
    game.scale.pageAlignHorizontally = !0,
    game.scale.pageAlignVertically = !0,
    document.body.style.backgroundColor = "#000",
    game.stage.backgroundColor = "#333",
    game.physics.startSystem(Phaser.Physics.ARCADE),
    game.state.start("load")
  }
},

loadState = {
  preload: function() {
    var a = game.add.image(game.world.centerX, 150, "logo");
    a.anchor.setTo(.5, .5);
    var b = game.add.sprite(game.world.centerX, 200, "progressBarBg");
    b.anchor.setTo(.5, .5);
    var c = game.add.sprite(game.world.centerX, 200, "progressBar");
    c.anchor.setTo(.5, .5),
    game.load.setPreloadSprite(c),

    //world
    game.load.tilemap('level', 'tilemaps/level-1.json', null, Phaser.Tilemap.TILED_JSON),
    game.load.image('belts', 'tilemaps/belts.png'),

    //buttons
    game.load.image("title", "assets/title.png"),
    game.load.image("skull", "assets/skull.png"),
    game.load.image("play", "assets/play.png"),
    game.load.image("how", "assets/how.png"),
    game.load.image("quit", "assets/quit.png"),

    //player
    game.load.spritesheet('samurai', 'assets/samurai-32x16.png', 32, 16, 9),

    //items
    game.load.image("lantern", "assets/lantern-16x16.png"),
    //game.load.image("sword", "assets/sword.png", 32, 16, 2),

    //music
    game.load.audio('thegrinder', 'assets/menu-1.wav')

  },

  create: function() {
    game.state.start("menu")
  }

},

menuState = {
  create: function(){
    var sprite = game.add.sprite(game.world.centerX, game.world.centerY - 20, 'title');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.alpha = 0;

    //  Create our tween. This will fade the sprite to alpha 1 over the duration of 2 seconds
    var tween = game.add.tween(sprite).to( { alpha: 1 }, 3000, "Linear", true);

    skull = game.add.button(0,0,'skull');
    skull.scale.setTo(scaleRatio);
    skull.smoothed = false

    play = game.add.button(game.world.centerX - 130, game.world.centerY + 60,'play', this.start);
    play.scale.setTo(scaleRatio);
    play.smoothed = false
/*
    how = game.add.button(game.world.centerX - 30, game.world.centerY + 60,'how');
    how.scale.setTo(scaleRatio);
    how.smoothed = false

    quit = game.add.button(game.world.centerX + 70, game.world.centerY + 60,'quit');
    quit.scale.setTo(scaleRatio);
    quit.smoothed = false
*/
    music = game.add.audio('thegrinder');
    music.loop = true;
    music.play();
  },

  start: function() {
    game.state.start("play")
  }
},

playState = {
  create: function() {

    map = game.add.tilemap('level');

    map.addTilesetImage('belts');

    layer = map.createLayer('Calque de Tile 1');
    //layer2 = map.createLayer('Calque 2');

    layer.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    map.setCollisionBetween(0, 1);

    game.physics.arcade.gravity.y = 250;

//player
    player = game.add.sprite(100, 200, 'samurai');
    player.scale.setTo(scaleRatio);
    player.smoothed = false

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

//items
    lantern = game.add.sprite(100, 100, 'lantern');
    lantern.scale.setTo(scaleRatio);
    lantern.smoothed = false

/*
    sword = game.add.sprite(45, 55, 'sword');
    sword.scale.setTo(scaleRatio);
    sword.smoothed = false
*/
    //player.addChild(sword);

    game.physics.enable(lantern, Phaser.Physics.ARCADE);

    player.animations.add('idle', [0, 1, 2], 10, true);
    player.animations.add('left', [0], 10, true);
    player.animations.add('jump', [4], 10, true);
    player.animations.add('right', [3, 4, 5, 6], 10, true);
    player.animations.add('attack', [7, 8], 10, true);

    //sword.animations.add('attack', [0, 1], 10, true)

    game.camera.follow(player);

    lantern.body.bounce.y = 0.2;
    lantern.body.linearDamping = 1;
    lantern.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key = game.input.keyboard.addKey(Phaser.Keyboard.X);
  },

  update: function() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(lantern, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -300;
        player.animations.play('left', 10);
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 300;
        player.animations.play('right', 10);
    }

    else
    {
        player.animations.play('idle', 10, true);
    }


    if (jumpButton.isDown)
    {
        player.body.velocity.y = -100;
        player.animations.play('jump', 10);
    }

    if (key.isDown) {
        player.animations.play('attack', 2);
        //sword.animations.play('attack', 2);
    }

  },

  render: function() {

  }
},

game.state.add("boot", bootState),
game.state.add("load", loadState),
//game.state.add("instruction", instructionState),
//game.state.add("about", aboutState),
game.state.add("menu", menuState),
game.state.add("play", playState),
//game.state.add("gameover", gameOverState),
game.state.start("boot");
