var gameOver = false;
var checkpoints = [false, false, false];

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
    mostrarMenu();
    
    
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
    document.getElementById("btnContinuar").addEventListener("click", function(){
        console.log("Abrir Pantalla Mapa");
    });
    document.getElementById("btnOpciones").addEventListener("click", function(){
        console.log("Abrir Pantalla Opciones");
    });
    document.getElementById("btnMusica").addEventListener("click", function(){
        console.log("Apagar Musica");
    });
}

function cargarImagenes(game){
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
}

function mostrarMenu(){
    document.getElementById("pantalla_carga").className = "oculto";
    document.getElementById("pantalla_inicio").className = "pantalla";
}