var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var platforms;
var stars;
var cursors; 
var score = 0, scoreText, i;

var color = ['0xE81616','0xE87F16','0xF2E515','0x21C002','0x0081F3','0x4B0082','0xAE0DFF'];

function preload() {
    this.load.image('background', "../assets/images/city.png");
    this.load.image('ground', "../assets/images/platform.png");
    this.load.image('star', "../assets/images/star.png");
    this.load.image('bomb', "../assets/images/bomb.png");
    this.load.spritesheet('dude', "../assets/images/catcher.png",
    { frameWidth: 50, frameHeight: 49} 
    );
}

function create(){

    this.add.image(400,300, 'background');

    platforms = this.physics.add.staticGroup();

    platforms.create(400,568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    player = this.physics.add.sprite(100, 400, 'dude');
    
    player.setBounce(.3);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player,platforms);

    this.anims.create({
        key: 'left',
        frames: [ { key: 'dude', frame: 0 } ],
        frameRate: 1,
      });
    
      this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 1 } ],
        frameRate: 20
      });
    
      this.anims.create({
        key: 'right',
        frames: [ { key: 'dude', frame: 2 } ],
        frameRate: 1,
      });

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child)  {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);

    function collectStar (player, star) {
        star.disableBody(true, true);
        score += 1;
        scoreText.setText('Stars Collected: ' + score);
  
        if (stars.countActive(true) < 10) {
          stars.create(Phaser.Math.RND.between(0, 700), Phaser.Math.RND.between(0, 500), 'star');
        }

        player.setTint(color[0]);
        color.shift();
        if(color.length===0) {
         color.push('0xE81616','0xE87F16','0xF2E515','0x21C002','0x0081F3','0x4B0082','0xAE0DFF');
       }
 
       var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

       if(score % 5 == 0){
         player.scale += 0.1;
 
         var bomb = bombs.create(x, 16, 'bomb');
         bomb.setBounce(1);
         bomb.setCollideWorldBounds(true);
         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
       }
     } 

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb) {

        this.physics.pause();
        player.setTint('0xE81616');
        player.anims.play('turn');
        gameOver = true;

        if(gameOver = true) {
            return alert("Game Over")
        }
    }
    scoreText = this.add.text(16, 16, 'Stars Collected: 0', {fontSize: '30px', fill:'#FFFFFF' });
    
    cursors = this.input.keyboard.createCursorKeys();
}


function update () {
    if (cursors.left.isDown)
{
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0);

    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down)
{
    player.setVelocityY(-330);
}

}