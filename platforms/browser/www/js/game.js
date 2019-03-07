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
    

var game = new Phaser.Game(config);
var sprite;
var scoreText;
var checkp1;
var score = 0;
var btnOpciones;
var asteroids;
var stars;
var timedEvent;
var isChoque =  false;
var counAsteroids = 0;


function preload ()
{   
    cargarImagenes(this);
    cargarBotones();
    asignarEventos();
    //cambiarPantalla(pantalla_carga, pantalla_inicio);
}

function cargarImagenes(game){
    //Aca se cargan la imagenes del juego, es decir los sprites
    game.load.image('fondo_juego','../img/fondo_juego.gif');
    game.load.image('dude','../img/personaje.png');
    game.load.image('conteo','../img/simbolo_conteo_estrellas.png')
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
    game.load.image('asteroide_izquierda_grande','../img/asteroide_izquierda_grande.png');
    game.load.image('asteroide_derecha_pequeño','../img/asteroide_derecha_pequeño.png');
    game.load.image('asteroide_izquierda_pequeño','../img/asteroide_izquierda_pequeño.png');
    game.load.image('opciones_juego','../img/opciones_juego.png');
    game.load.image('estrella','../img/estrellas_recolectar_juego.png');
    game.load.image('check1','../img/check_point.png');
    
}

function create ()
{   
    //Asignar el fondo del juego
    this.add.image(180, 320, 'fondo_juego');

    //iconos del juego
    this.add.image(24, 24,'conteo').setOrigin(0);
    scoreText = this.add.text(60, 30, '0',{fontFamily: 'Akrobat', fontStyle: '900', color: '#ecdeb5',fontSize: '15px'});
    btnOpciones = this.add.sprite(308, 24,'opciones_juego').setInteractive();
    btnOpciones.setOrigin(0);

    //Botones
    btnOpciones.on('pointerdown',function () {
        asteroids.setVelocity(0,0);
        cambiarPantalla(pantalla_game, pantalla_opciones);
    });
    
    //Grupo de asteroides, es decir los obstaculos
    asteroids = this.physics.add.group();
    //Grupo de estrellas
    stars = this.physics.add.group();
    //Eventos para crear las estrellas y los planetas
    timedEvent = this.time.addEvent({ delay: 5000, callback: createStar, callbackScope: this, loop: true });
    timedEvent = this.time.addEvent({ delay: 4000, callback: createAsteroids, callbackScope: this, loop: true });
    
    //Personaje
    sprite = this.add.image(180, 560, 'dude');

    //Fisica del video juego
    this.physics.world.enable(sprite);
    sprite.body.setCollideWorldBounds(true);
    sprite.setInteractive({ draggable: true });
    this.physics.add.collider(sprite, asteroids);
    this.physics.add.collider(asteroids,asteroids);
    
    //Recolector de estrellas
    this.physics.add.overlap(sprite, stars, collectStar, null, this);
    this.physics.add.overlap(sprite, checkp1, check, null, this);

    //Detectar la colision entre Baldur y los asteroides
    this.physics.add.overlap(sprite, asteroids, choque, null, this);
   
 
}

function update ()
{

    sprite.on('drag', function (pointer, dragX, dragY) {
        this.x = dragX;
    });
}

//Funcion para crear estrellas cada cierto tiempo
function createStar() {

    var rdn = Math.floor(Math.random()*4)+1;
    var otherStar;

    if (isChoque==false) {

        switch (rdn) {

            case 1:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1);
                otherStar.setVelocity(0,50);
                break;
            case 2:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.3);
                otherStar.setVelocity(0,50);
                break; 
            case 3:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.6);
                otherStar.setVelocity(0,50);
                break;     
            case 4:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.9);
                otherStar.setVelocity(0,50);
                break;   
        
            default:
                break;
        }
       
    }

}

//Funcion para crear asteroides cada cierto tiempo
function createAsteroids() {

    var rdn = Math.floor(Math.random()*4)+1;
    var otherAsteroid;

    if (isChoque==false) {

        switch (rdn) {

            case 1:
                otherAsteroid = asteroids.create(25, -100,"asteroide_izquierda_grande").body.setCircle(100);
                otherAsteroid.setVelocity(0,80);
                counAsteroids++;
                break;
            case 2:
                otherAsteroid = asteroids.create(randomNum(100,200), -140,"asteroide_derecha_pequeño").body.setCircle(80);
                otherAsteroid.setVelocity(0,90);
                counAsteroids++;
                break; 
            case 3:
                otherAsteroid = asteroids.create(randomNum(160,260), -200,"asteroide_izquierda_pequeño").body.setCircle(80);
                otherAsteroid.setVelocity(0,100);
                counAsteroids++;
                break;     
            case 4:
                otherAsteroid = asteroids.create(335, -220,"asteroide_derecha_grande").body.setCircle(100);
                otherAsteroid.setVelocity(0,110);
                counAsteroids++;
                break;   
        
            default:
                break;
        }
       
    }

}

//Funcion para captuar el choque de los asteroides
function choque(){

    isChoque = true;
    asteroids.setVelocity(0,0);
    stars.setVelocity(0,0);


}

function check(player, checkp1)
{
    checkp1.disableBody(true, true);
    
    
}
function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 20;
    scoreText.setText('Score: ' + score);

    //llegada al checkpoint
    if (score==40||counAsteroids>2) {

        //Checks points
        checkp1 = this.physics.add.group();
        isChoque = true;
        var ch = checkp1.create(160,350,"check1");
        ch.body.setCollideWorldBounds(true);
        ch.setVelocity(0,120);

        //Detener las estrellas
        asteroids.setVelocity(0,0);
        stars.setVelocity(0,0);
        
    }
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

function randomNum(max,min){
    return Math.floor(Math.random() * ((max+1) - min) + min);
}