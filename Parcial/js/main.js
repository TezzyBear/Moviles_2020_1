window.onload = function(){ //Faltaba el evento onload
    //Errors de typeo en state y los argumentos de la funcion add
    var game = new Phaser.Game(1024,768,Phaser.AUTO);
    game.state.add('Preload', Preload);
    game.state.add('Menu', Menu);
    game.state.add('Game', Game);
    game.state.start('Preload');
}
