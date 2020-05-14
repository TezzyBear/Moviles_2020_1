Enemy = function(game, key, snd){

    Phaser.Sprite.call(this,game,0,0,key); 
    this.game = game;   
    this.key = key;
    this.snd = snd;
    this.anchor.setTo(0.5);
    this.y = -this.height/2;
    this.game.physics.arcade.enable(this);
    this.body.velocity.y = 200;
    this.animations.add('fly', [ 0, 1, 2 ], 20, true);
    this.destroyEnemy = new Phaser.Signal();
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.destroy = function(){
    this.showExplosion();
		if(this.key == "greenEnemy"){
			this.score=10;
		}
		if(this.key == "whiteEnemy"){
			this.score=20;
		}
		if(this.key == "boss"){
			this.score=40;
		}
		this.kill();
		
        this.destroyEnemy.dispatch(this.score);
}

Enemy.prototype.showExplosion = function(){
    let explosion = this.game.add.sprite(this.x,this.y,'explosion');
		explosion.anchor.setTo(0.5);
		explosion.width = this.width;
		explosion.height = this.height;
		explosion.animations.add('boom');
        explosion.animations.play('boom',7,false,true);
        this.snd.play();
}