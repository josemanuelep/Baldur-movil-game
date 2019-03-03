var gameOver = false;
var checkpoints = [false, false, false];
var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, opcion_creditos, btn_volver, btn_mapa ;

var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent:"pantalla_game",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
    

var game = new Phaser.Game(config);
var sprite;

function preload ()
{   
    cargarImagenes(this);
    cargarBotones();
    asignarEventos();
    cambiarPantalla(pantalla_carga, pantalla_inicio);
}

function cargarImagenes(game){
    game.load.image('fondo_juego','../img/fondo_juego.gif');
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
    game.load.image('dude','../img/personaje.png');
}

function create ()
{
    
    this.add.image(180, 320, 'fondo_juego');
    sprite = this.add.image(180, 560, 'dude');

    this.physics.world.enable(sprite);
    
    sprite.body.setCollideWorldBounds(true);
    sprite.setInteractive({ draggable: true });

    sprite.on('drag', function (pointer, dragX, dragY) {
        this.x = dragX;
    });
}

function update ()
{
}

function asignarEventos(){
    asignarEventosInicio();
    asignarEventosOpciones();
    asignarEventoMapa();
}

function cargarBotones(){
    btnContinuar = document.getElementById("btnContinuar");
    btnOpciones = document.getElementsByClassName("btnOpciones");
    btnMusica = document.getElementById("btnMusica");
    opcion_menu = document.getElementById("opcion_menu");
    opcion_personajes = document.getElementById("opcion_personajes");
    opcion_musica = document.getElementById("opcion_musica");
    opcion_creditos = document.getElementById("opcion_creditos");
    btn_volver = document.getElementById("boton_volver");
    btn_mapa = document.getElementById("boton_mapa");
}

function cambiarPantalla(origen, destino){
    origen.className = "oculto";
    destino.className = "pantalla animated fadeIn slower";
}

function asignarEventosInicio(){
    btnContinuar.addEventListener("click", function(){
        cambiarPantalla(pantalla_inicio, pantalla_mapa);
    });

    Array.from(btnOpciones).forEach(function(element) {
        element.addEventListener('click', function(){
            cambiarPantalla(element.parentElement, pantalla_opciones);
        });
      });
    btnMusica.addEventListener("click", function(){
        console.log("Apagar Musica");
    });
}

function asignarEventosOpciones(){
    opcion_menu.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
    opcion_personajes.addEventListener("click", function(){
        
    });
    opcion_musica.addEventListener("click", function(){
        
    });
    opcion_creditos.addEventListener("click", function(){
        
    });
    btn_volver.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
}

function asignarEventoMapa(){
    btn_mapa.addEventListener("click", function(){
        cambiarPantalla(pantalla_mapa, pantalla_game);
    });
}