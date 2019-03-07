var gameOver = false;
var checkpoints = [false, false, false];
var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, 
opcion_creditos, btn_volver, btn_mapa, btnVolverInicio, btnNuevaPartida, resultado_juego ;

var config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent:"pantalla_game",
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
    

var game;
var sprite;
var scoreText;

cargarBotones();
asignarEventos();
cambiarPantalla(pantalla_carga, pantalla_inicio);

function preload ()
{   
    cargarImagenes(this);
    this.load.audio('theme','../Twisting.mp3');
    asignarEventosModalBox(this);
}

function cargarImagenes(game){
    game.load.image('fondo_juego','../img/fondo_juego.gif');
    game.load.image('dude','../img/personaje.png');
    game.load.image('conteo','../img/simbolo_conteo_estrellas.png')
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
    game.load.image('asteroide_izquierda_grande','../img/asteroide_izquierda_grande.png');
    game.load.image('asteroide_derecha_pequeño','../img/asteroide_derecha_pequeño.png');
    game.load.image('asteroide_izquierda_pequeño','../img/asteroide_izquierda_pequeño.png');
    game.load.image('opciones_juego','../img/opciones_juego.png');
    
}

function create ()
{
    var music = this.sound.add('theme');

    music.play();
    this.add.image(180, 320, 'fondo_juego');

    
    asteroids = this.physics.add.group();
    for (let i = 0; i < 6; i++) {
        asteroids.create(25, (i*(-1400)),"asteroide_izquierda_grande").body.setCircle(110);
    }
    for (let i = 0; i < 6; i++) {
        asteroids.create(randomNum(100,200), (i*(-1400))-350,"asteroide_derecha_pequeño").body.setCircle(80);
    }
    for (let i = 0; i < 6; i++) {
        asteroids.create(randomNum(160,260), (i*(-1400))-700,"asteroide_izquierda_pequeño").body.setCircle(80);
    }
    for (let i = 0; i < 6; i++) {
        asteroids.create(335, (i*(-1400))-1050,"asteroide_derecha_grande").body.setCircle(110);
    }
    asteroids.setVelocity(0,200);

    sprite = this.add.image(180, 560, 'dude');

    this.physics.world.enable(sprite);
    
    sprite.body.setCollideWorldBounds(true);
    sprite.setInteractive({ draggable: true });

    this.add.image(24, 24,'conteo').setOrigin(0);
    this.add.text(60, 30, '0',{fontFamily: 'Akrobat', fontStyle: '900', color: '#ecdeb5',fontSize: '15px'});
    this.add.image(308, 24,'opciones_juego').setOrigin(0);    
    
    
    this.physics.add.collider(sprite, asteroids);
}

function update ()
{
    sprite.on('drag', function (pointer, dragX, dragY) {
        this.x = dragX;
    });
}

function asignarEventos(){
    asignarEventosInicio();
    asignarEventosOpciones();
    asignarEventoMapa();
    //asignarEventosModalBox();
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
    btnVolverInicio = document.getElementById("btnVolverInicio");
    btnNuevaPartida = document.getElementById("btnNuevaPartida");
    resultado_juego = document.getElementById("resultado_juego");
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
        game = new Phaser.Game(config);
    });
}

function asignarEventosModalBox(game){
    btnVolverInicio.addEventListener("click", function(){
        cambiarPantalla(pantalla_game, pantalla_inicio);
        resultado_juego.className = "oculto";
        game.sys.game.destroy(true);

    });
    btnNuevaPartida.addEventListener("click", function(){
        resultado_juego.className = "oculto";
        game.sys.game.destroy(true);
        game = new Phaser.Game(config);
    });

}

function randomNum(max,min){
    return Math.floor(Math.random() * ((max+1) - min) + min);
}