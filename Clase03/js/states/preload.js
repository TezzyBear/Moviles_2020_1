preload = function(game){}

preload.prototype = {
    preload:function(){
        this.load.image("background","assets/images/backyard.png");
		this.load.image("apple","assets/images/apple.png");
		this.load.image("arrow","assets/images/arrow.png");
		this.load.image("bar","assets/images/bar.png");
		this.load.image("candy","assets/images/candy.png");
		this.load.image("logo","assets/images/logo.png");
		this.load.spritesheet("pet","assets/images/pet.png",98,83,5);
		this.load.image("rotate","assets/images/rotate.png");
		this.load.image("rubber_duck","assets/images/rubber_duck.png");
    }, 
    create:function(){
        console.log("Terminamos de cargar.")
    }
}