var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent:"game",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
    

var game = new Phaser.Game(config);

function preload ()
{   cargarImagenes(this);
    document.getElementById("pantalla_carga").className = "oculto";

    
}

function create ()
{
    asignarEventos();
    // this.add.image(180, 360, 'cargando');
}

function update ()
{
}

function asignarEventos(){

}

function cargarImagenes(game){
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
}