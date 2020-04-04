window.onload = function(){
    let game = new Phaser.Game(360, 620, Phaser.AUTO);
    game.state.add("preload", preload);
    game.state.start("preload");
}