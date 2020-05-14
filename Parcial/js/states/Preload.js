Preload = function(game){}

Preload.prototype = {
	preload:function(){
		//No se necesita
		this.load.image('titlepage', 'assets/titlepage.png');
		
		this.load.audio('explosion', ['assets/explosion.ogg']);
    	this.load.audio('fire', ['assets/enemy-fire.ogg']);

		//this.load.image('circulo', 'assets/circulo.png'); No existe??? 
		this.load.image('shoot', 'assets/arrowButton.png');
		this.load.image('arrow', 'assets/actionButton.png');
	    this.load.image('sea', 'assets/sea.png');
	    this.load.image('bullet', 'assets/bullet.png');
	    this.load.image('enemyBullet', 'assets/enemy-bullet.png');
	    this.load.image('powerup1', 'assets/powerup1.png');
	    this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
	    this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32);
	    this.load.spritesheet('boss', 'assets/boss.png', 93, 75);
	    this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
	    this.load.spritesheet('player', 'assets/player.png', 64, 64);
	},
	create:function(){
		//Error en que no se llamaba a la funcion create, por lo que nunca iniciaba
		this.state.start("Menu");
	}

}