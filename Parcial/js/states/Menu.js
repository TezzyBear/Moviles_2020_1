Menu = function(game){}

Menu.prototype = {
	create:function(){ 
		this.background = this.game.add.sprite(0,0,'titlepage');
		this.background.inputEnabled = true;
		this.background.events.onInputDown.add(this.goGame, this);
	},
	goGame:function(){		
		this.state.start("Game");
	}
}