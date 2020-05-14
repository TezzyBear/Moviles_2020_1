Game = function(game){}

Game.prototype = {
	
	create:function(){

		//Creacion del tileSprite que vendria a ser el awa

		this.background = this.game.add.tileSprite(0,0,this.game.world.width,this.game.world.height,'sea');
		this.background.autoScroll(0,100);

		this.explosionSound = this.add.sound('explosions');
		this.shoowSound = this.add.sound('fires');

		this.physics.startSystem(Phaser.ARCADE);

		//Creacion del player
		this.player = this.game.add.sprite(0,0,'player');
		this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);

		this.player.play("fly");
		
		this.player.anchor.setTo(0.5);

		this.player.x = this.game.world.centerX;
		this.player.y = this.game.world.centerY;
		this.player.movement = {
			left:false,
			right:false,
			down:false,
			up:false,
			shoot:false
		};
		this.game.physics.arcade.enable(this.player);
		this.player.body.colliderWorldBounds = true;
		this.keys = this.input.keyboard.createCursorKeys();

		this.bullets = this.game.add.group();		

		this.playerLifes = 4;
		this.powerups = this.game.add.group();
		this.score = 0;

		this.highScore = localStorage.highScore == null ? 0 : parseInt(localStorage.highScore)

		this.lifes = this.game.add.group();
		this.gameOver= false;
		this.enemies = this.game.add.group();
		
		this.poweupInterval = 0;
		this.enemyInterval = 0;
		this.shootInterval = 0;
		
		this.style = {
			fill: "#FFFFFF"
		};

		this.createControls();
		this.hud();
	},
	createControls:function(){
		//Creando el botton de disparo
		this.shootBtn = this.game.add.sprite(900,650,'shoot');
		this.shootBtn.inputEnabled = true;		

		this.shootBtn.events.onInputDown.add(function(){
			this.player.movement.shoot = true;
		},this);

		
		this.shootBtn.events.onInputUp.add(function(){ 
			this.player.movement.shoot = false;
		},this);
		

		//Creando sprites de keys en pantalla (movimiento)
		this.left = this.game.add.sprite(30,650,'arrow');
		this.right = this.game.add.sprite(170,650,'arrow');
		this.up = this.game.add.sprite(100,600,'arrow');
		this.down = this.game.add.sprite(100,700,'arrow');
		this.left.inputEnabled = true;
		this.right.inputEnabled = true;
		this.down.inputEnabled = true;
		this.up.inputEnabled = true;

		this.left.events.onInputDown.add(function(){
			this.player.movement.left = true;
		},this);

		this.right.events.onInputDown.add(function(){
			this.player.movement.right = true;	
		},this);
		this.down.events.onInputDown.add(function(){
			this.player.movement.down = true;	
		},this);

		this.up.events.onInputDown.add(function(){
			this.player.movement.up = true;
		},this); 
		
		this.left.events.onInputUp.add(function(){ 
			this.player.movement.left = false;
		},this);

		this.right.events.onInputUp.add(function(){
			this.player.movement.right = false;	
		},this);
		this.down.events.onInputUp.add(function(){
			this.player.movement.down = false;	
		},this);

		this.up.events.onInputUp.add(function(){
			this.player.movement.up = false;
		},this);
		
	},
	hud:function(){

		this.scoreText = this.game.add.text();
		this.scoreText.x = this.game.world.width - 400;
		this.scoreText.text = "Score: " + this.score;
		this.scoreText.fill = this.style.fill;

		this.highScoreText = this.game.add.text();
		this.highScoreText.x = this.game.world.width - 200;
		this.highScoreText.text = "HighScore: " + this.highScore;
		this.highScoreText.fill = this.style.fill;

		for(let i=0;i<this.playerLifes;i++){
			let life = this.add.image(0,0,'player');
			life.anchor.setTo(0.5);
			life.index = i;
			life.x = life.width  * i;
			this.lifes.add(life);
		}
	},

	update:function(){
		if(this.gameOver){
			this.highScore = this.score > this.highScore ? this.score : this.highScore
			localStorage.highScore = this.highScore;
			return;
		}
		this.poweupInterval +=this.game.time.elapsed;
		this.enemyInterval +=this.game.time.elapsed;
		this.shootInterval += this.game.time.elapsed;
		if(this.poweupInterval>=10000 && this.playerLifes < 4){
			this.poweupInterval = 0;
			this.createPowerUp();
		}

		if((this.game.input.keyboard.isDown(Phaser.Keyboard.Z) 
			|| this.player.movement.shoot)
					&& this.shootInterval >=300){
			this.shootInterval = 0;
			this.shoot();
		}
		if(this.enemyInterval>=1000){
			this.enemyInterval = 0;
			this.createEnemy();
		}

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		if(this.keys.left.isDown || this.player.movement.left){
			this.player.body.velocity.x = -300;
		}

		if(this.keys.right.isDown || this.player.movement.right){
			this.player.body.velocity.x = 300;
		}

		if(this.keys.up.isDown || this.player.movement.up){
			this.player.body.velocity.y = -300;
		}

		if(this.keys.down.isDown || this.player.movement.down){
			this.player.body.velocity.y = 300;
		}

		this.enemies.forEach(function(enemy){
			if(enemy.y>=this.game.heigth){
				enemy.kill();
			}
		},this);

		this.powerups.forEach(function(powerup){
			if(powerup.y>=this.game.heigth){
				powerup.kill();
			}
		},this);

		this.physics.arcade.overlap(this.player,this.enemies,
				this.reduceLife,null,this);

		this.physics.arcade.overlap(this.bullets,this.enemies,
										this.destroyEnemies,null,this);

		this.physics.arcade.overlap(this.player,this.powerups,
										this.gainLife,null,this);
	},

	gainLife:function(player,powerup){
		powerup.kill();
		if(this.playerLifes<4){
			this.playerLifes++;
			let life = this.lifes.getFirstDead();
			life.reset(life.index*life.width,0);
		}
	},

	createPowerUp:function(){
		let powerup = this.game.add.sprite(0,0,'player');
		powerup.scale.setTo(0.5);
		powerup.anchor.setTo(0.5);
		powerup.y = -powerup.height/2;
		powerup.x = this.game.rnd.integerInRange(powerup.width/2,
												this.game.width - (powerup.width / 2));
		this.game.physics.arcade.enable(powerup);
		this.powerups.add(powerup);
		powerup.body.velocity.y = 100;
	},

	reduceLife:function(player,enemy){
		//this.showExplosion(enemy);

		enemy.showExplosion();		

		enemy.kill();
		let life = this.lifes.getFirstAlive();
		life.kill();

		this.playerLifes--;
		if(this.playerLifes==0){
			this.gameOver = true;
			this.showExplosion(this.player);
			this.player.kill();
			this.enemies.killAll();
			this.powerups.killAll();
			this.gameOverText = this.game.add.text(0,0,'Game Over',this.style);

			this.gameOverText.anchor.setTo(0.5);
			this.gameOverText.x = this.game.world.centerX;
			this.gameOverText.y = this.game.world.centerY;

			this.gameOverText.inputEnabled = true;
			this.gameOverText.events.onInputDown.add(function(){
				this.state.start("Game");
			},this);
		}
	},

	destroyEnemies:function(bullet, enemy){
		enemy.destroyEnemy.add(this.updateScore, this);
		enemy.destroy();
		bullet.kill();
		/*
		this.showExplosion(enemy);
		let types = ["greenEnemy","whiteEnemy","boss"];
		if(enemy.key == "greenEnemy"){
			this.score+=10;
		}
		if(enemy.key == "whiteEnemy"){
			this.score+=20;
		}
		if(enemy.key == "boss"){
			this.score+=40;
		}
		this.scoreText.text = "Score : "+this.score;
		bullet.kill();
		enemy.kill();*/
	},

	updateScore:function(score){		
		this.score += score;
		this.scoreText.text = "Score : "+ this.score;

	},

	showExplosion:function(image){
		let explosion = this.game.add.sprite(image.x,image.y,'explosion');
		explosion.anchor.setTo(0.5);
		explosion.width = image.width;
		explosion.height = image.height;
		explosion.animations.add('boom');
		explosion.animations.play('boom',7,false,true);
		this.explosionSound.play();
	},
	
	createEnemy:function(){
		let types = ["greenEnemy","whiteEnemy","boss"];
		let key = this.game.rnd.integerInRange(0,2);
		let enemy = this.enemies.getFirstDead();
		if(enemy){
			enemy.reset(0,-enemy.height/2);
		}else{
			enemy = new Enemy(this.game, types[key], this.explosionSound);
			//enemy = this.game.add.sprite(0,0,types[key]);
			this.enemies.add(enemy);
			//enemy.anchor.setTo(0.5);
			//enemy.y = -enemy.height/2;
			//this.game.physics.arcade.enable(enemy);
			//enemy.body.velocity.y = 200;
			//enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
		}
		enemy.play("fly");
		enemy.x = this.game.rnd.integerInRange(enemy.width/2,
												this.game.width - (enemy.width / 2));
	},

	shoot:function(){
		let bullet = this.bullets.getFirstDead();
		this.shoowSound.play();
		if(bullet){
			bullet.reset(this.player.x,this.player.y);
			bullet.body.velocity.y = -200; 	
		}else{
			bullet = this.game.add.sprite(this.player.x,this.player.y,'bullet');
			this.bullets.add(bullet);
			bullet.scale.setTo(2);
			bullet.anchor.setTo(0.5);
			this.game.physics.arcade.enable(bullet);
			bullet.body.velocity.y = -200; 	
			bullet.body.checkWorldBounds = true;
			bullet.body.outOfBoundsKill  = true;
		}
		
	}

}