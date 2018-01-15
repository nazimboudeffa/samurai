var game = new Phaser.Game(20 * 16, 15 * 16, Phaser.CANVAS, 'samurai-lantern', { preload: preload, create: create, update: update, render: render });

function preload() {
    //  This sets a limit on the up-scale
    game.scale.maxWidth = 800;
    game.scale.maxHeight = 600;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //world
    game.load.tilemap('map', 'tilemaps/menu.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('belts', 'tilemaps/belts.png');

    //buttons
    game.load.image("title", "assets/title.png");
    game.load.image("skull", "assets/skull.png");
    game.load.image("play", "assets/play.png");
    game.load.image("how", "assets/how.png");
    game.load.image("quit", "assets/quit.png");

    //player
    game.load.spritesheet('samurai', 'assets/samurai-32x16.png', 32, 16, 9);

    //items
    game.load.image("lantern", "assets/lantern-16x16.png");

    //music
    game.load.audio('thegrinder', 'assets/menu-1.wav');

}

var player, lantern, skull, play, how, quit;
var facing = 'idle';
var cursors;
var jumpButton;
var jumpTimer = 0;
var map;
var layer, layer2;
var key;
var scaleRatio = 2;
var tile_size = 16;

function create() {

    game.scale.pageAlignHorizontally = !0,
    game.scale.pageAlignVertically = !0,

    //game.add.image(50, 0, 'title');
    game.stage.backgroundColor = '#333';

    map = game.add.tilemap('map');

    map.addTilesetImage('belts');

    layer = map.createLayer('Calque de Tile 1');
    //layer2 = map.createLayer('Calque 2');

    layer.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    map.setCollisionBetween(0, 1);

    game.physics.arcade.gravity.y = 250;

    skull = game.add.button(0,0,'skull');
    skull.scale.setTo(scaleRatio);
    skull.smoothed = false

    play = game.add.button(0,500+50,'play');
    play.scale.setTo(scaleRatio);
    play.smoothed = false

    how = game.add.button(400,500+50,'how');
    how.scale.setTo(scaleRatio);
    how.smoothed = false

    quit = game.add.button(700,500+50,'quit');
    quit.scale.setTo(scaleRatio);
    quit.smoothed = false

//player
    player = game.add.sprite(100, 200, 'samurai');
    player.scale.setTo(scaleRatio);
    player.smoothed = false

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

//items
    lantern = game.add.sprite(400, 200, 'lantern');
    lantern.scale.setTo(scaleRatio);
    lantern.smoothed = false

    game.physics.enable(lantern, Phaser.Physics.ARCADE);

    lantern.body.bounce.y = 0.2;
    lantern.body.linearDamping = 1;
    lantern.body.collideWorldBounds = true;

    player.animations.add('idle', [0, 1, 2], 10, true);
    player.animations.add('left', [0], 10, true);
    player.animations.add('right', [3, 4, 5, 6], 10, true);
    player.animations.add('attack', [7, 8, 7, 8, 7, 8], 10, true);

    game.camera.follow(player);

    music = game.add.audio('thegrinder');
    music.loop = true;
    music.play();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    key = game.input.keyboard.addKey(Phaser.Keyboard.X);


}

function update() {
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
      console.log("jmp");
  }

  if (key.isDown) {
      player.animations.play('attack', 2);
  }

}

function render() {

}
