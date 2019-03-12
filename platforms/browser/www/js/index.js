var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        startNewGame();
        document.getElementById("pantalla_carga").className = "oculto";
        document.getElementById("pantalla_inicio").className = "pantalla animated fadeIn";
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//obtener Variables del localStorage
var gameOver = false;
var checkpoints = [false, false, false,false];
var progress = 0;
var fails = 0;
var starsp = 0 ;
var checkPonitString = '0/4' ;
var game;
var pause = true;
var sprite;
var music;
var musicIsOn = false;

function startNewGame(){
    var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, opcion_creditos, btn_volver, btn_mapa ,btnRestart;
    var scoreText;
    var checkp1;
    var score = 0;
    var btnOpciones;
    var asteroids;
    var stars;
    var timedEvent;
    var isChoque =  false;
    var counAsteroids = 0;
    var currentCheckPoint=0;
    var collectedStars= 0;

    var config = {
        type: Phaser.AUTO,
        width: 360,
        height: 640,
        parent:"pantalla_game",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
    game = new Phaser.Game(config);

    function preload ()
    {   
        cargarImagenes(this);
        cargarBotones();
        asignarEventos(this);
        this.load.audio('theme','../Twisting.mp3');
    }

//Aca se cargan la imagenes del juego, es decir los sprites
function cargarImagenes(game){
       
        game.load.image('fondo_juego','../img/fondo_juego.gif');
        game.load.image('dude','../img/personaje.png');
        game.load.image('conteo','../img/simbolo_conteo_estrellas.png')
        game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
        game.load.image('asteroide_izquierda_grande','../img/asteroide_izquierda_grande.png');
        game.load.image('asteroide_derecha_pequeño','../img/asteroide_derecha_pequeño.png');
        game.load.image('asteroide_izquierda_pequeño','../img/asteroide_izquierda_pequeño.png');
        game.load.image('msmCheck','../img/frase_check_point.png');
        game.load.image('opciones_juego','../img/opciones_juego.png');
        game.load.image('estrella','../img/estrellas_recolectar_juego.png');
        game.load.image('check1','../img/check_point.png');
        game.load.image('btnNuevaPartida','../img/boton_nueva_partida.png');
        
    }
    
function create ()
    {  
        //Variables del localStorage - inicializacion
        progress = localStorage.getItem("progress");
        fails = localStorage.getItem("fails");
        starsp = localStorage.getItem("estrellas");
        checkPonitString =  localStorage.getItem("check");
        //Musica
        music = this.sound.add('theme');
        music.play();
        musicIsOn = true;
        //Eventos de los botones para navegar e los modals box
        moverDerEstadistica.addEventListener("click", function() {
            let screen1 = document.getElementById("secretosBaldur");
            let screen2 = document.getElementById("estadisticasBaldur");
            cambiarModalBox(screen1,screen2);
            document.getElementById("progresoPartida").innerHTML = progress + '%';
            document.getElementById("fracasosPartida").innerHTML = fails;
            document.getElementById("estrellasPartida").innerHTML = collectedStars;
            document.getElementById("checkPointsPartida").innerHTML = checkPonitString;
          });
        moverIzqSecretos.addEventListener("click", function() {
            let screen1 = document.getElementById("estadisticasBaldur");
            let screen2 = document.getElementById("secretosBaldur");
            cambiarModalBox(screen1,screen2);
            
          });
        moverDerValoranos.addEventListener("click", function() {
            let screen1 = document.getElementById("estadisticasBaldur");
            let screen2 = document.getElementById("valorarBaldur");
            cambiarModalBox(screen1,screen2);
          });
        moverIzqEstadistica.addEventListener("click", function() {
            let screen1 = document.getElementById("valorarBaldur");
            let screen2 = document.getElementById("estadisticasBaldur");
            cambiarModalBox(screen1,screen2);
          });
    

        //Asignar el fondo del juego
        this.add.image(180, 320, 'fondo_juego');
    
        //iconos del juego
        this.add.image(24, 24,'conteo').setOrigin(0);
        scoreText = this.add.text(60, 30, '0',{fontFamily: 'Akrobat', fontStyle: '900', color: '#ecdeb5',fontSize: '15px'});
    
        //Botones acciones
        btnOpciones = this.add.sprite(308, 24,'opciones_juego').setInteractive();
        btnOpciones.setOrigin(0);
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
        timedEvent = this.time.addEvent({ delay: 2000, callback: createAsteroids, callbackScope: this, loop: true });
        //timedEvent = this.time.addEvent({ delay: 6000, callback: checksPoints, callbackScope: this, loop: true });
        
        //Personaje
        sprite = this.add.image(180, 560, 'dude');
    
        //Fisica del video juego
        this.physics.world.enable(sprite);
        sprite.body.setCollideWorldBounds(true);
        sprite.setInteractive({draggable: true });
        sprite.body.setSize(50, 120, 50, 25);

        //Colsiones
        this.physics.add.collider(sprite, asteroids);
        
        //Recolector de estrellas
        this.physics.add.overlap(sprite, stars, collectStar, null, this);
    
        //Detectar la colision entre Baldur y los asteroides
        this.physics.add.overlap(sprite, asteroids, choque, null, this);   
     
    }
    
function update (){
        
        sprite.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
        });

    }

function saveGameData(){

        /*Guardando los datos en el LocalStorage*/
        localStorage.setItem("fails", fails);
        localStorage.setItem("progress", progress);
        localStorage.setItem("estrellas", collectedStars);
        
        if (progress == 0) {
            let ch = '0/4';
            localStorage.setItem("check", ch);
        }
        if (progress == 25) {
            let ch = '1/4';
            localStorage.setItem("check", ch);
        }
        if (progress == 50) {
            let ch = '2/4';
            localStorage.setItem("check", ch);
        }
        if (progress == 75) {
            let ch = '3/4';
            localStorage.setItem("check", ch);
        }
        if (progress == 100) {
            let ch = '4/4';
            localStorage.setItem("check", ch);
        }

    }

//Funcion para crear estrellas cada cierto tiempo
function createStar() {

    var rdn = Math.floor(Math.random()*4)+1;
    var otherStar;

    if (isChoque==false && pause==false) {

        switch (rdn) {

            case 1:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1);
                break;
            case 2:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.3);
                break; 
            case 3:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.6);
                break;     
            case 4:
                otherStar = stars.create(randomNum(20,300), 0,'estrella');
                otherStar.setScale(1.9);
                
                break;   
        
            default:
                break;
        }
       stars.setVelocity(0,60);
    }

 }

 //Funcion para crear asteroides cada cierto tiempo
 function createAsteroids() {


    var rdn = Math.floor(Math.random()*4)+1;
    var otherAsteroid;

    if (isChoque==false && pause ==false) {

        switch (rdn) {

            case 1:
                otherAsteroid = asteroids.create(25, -200,"asteroide_izquierda_grande").body.setCircle(110);
                counAsteroids++;
                break;
            case 2:
                otherAsteroid = asteroids.create(randomNum(100,200), -280,"asteroide_derecha_pequeño").body.setCircle(80);
                counAsteroids++;
                break; 
            case 3:
                otherAsteroid = asteroids.create(randomNum(160,260), -330,"asteroide_izquierda_pequeño").body.setCircle(80);
                counAsteroids++;
                break;     
            case 4:
                otherAsteroid = asteroids.create(335, -380,"asteroide_derecha_grande").body.setCircle(110);
                counAsteroids++;
                break;   
        
            default:
            
                break;
        }
       asteroids.setVelocity(0,40);
    }
 }

 //Funcion para captuar el choque de los asteroides
 function choque(){

    asteroids.setVelocity(0,0);
    stars.setVelocity(0,0);
    fails++;
    isChoque = true;
    saveGameData();
    resultado_juego.className = "modal_box animated fadeIn slower";
    contenedor_perdiste.className = "contenedor_resultado";
    secretosBaldur.className = "contenedor_info";
    prueba.className = "";
    regresaInicio.className = "";
    //Variables del localStorage - inicializacion
    progress = localStorage.getItem("progress");
    fails = localStorage.getItem("fails");
    starsp = localStorage.getItem("estrellas");
    checkPonitString =  localStorage.getItem("check");
 }

 //Funcion para verificar los checks points
function checksPoints(){

    //llegada al checkpoint 1 por estrellas
    if ((score==40) && (checkpoints[0] == false)) {

       //Circulo Checks points
       checkp1 = this.physics.add.group();
       var ch = checkp1.create(160,-50,"check1");
       ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[0] = true;
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110);

        
    }

    //llegada al checkpoint 1 al pasar 10 asteriodes
    if (counAsteroids>10) {

       if (checkpoints[0] == false) {

        //Circulo Checks points
        checkp1 = this.physics.add.group();
        var ch = checkp1.create(160,-50,"check1");
        ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[0] = true;
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110)
           
       }
       if (checkpoints[0] == true) {

        //Circulo Checks points
        checkp1 = this.physics.add.group();
        var ch = checkp1.create(160,-50,"check1");
        ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[1] == true;
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110)
           
       }
       
    }

    //llegada al checkpoint 2 al pasar 20 asteriodes
    if (counAsteroids>20){
        
        //Circulo Checks points
        checkp1 = this.physics.add.group();
        var ch = checkp1.create(160,-50,"check1");
        ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[1] == true
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110)

    }
    
    //llegada al checkpoint 3 al pasar 30 asteriodes
    if (counAsteroids>30){
        
        //Circulo Checks points
        checkp1 = this.physics.add.group();
        var ch = checkp1.create(160,-50,"check1");
        ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[2] == true
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110)

    }

    //llegada al checkpoint 4 al pasar 40 asteriodes
    if (counAsteroids>40){
        
        //Circulo Checks points
        checkp1 = this.physics.add.group();
        var ch = checkp1.create(160,-50,"check1");
        ch.setVelocity(0,120);

        //Annadir checkPoint al arreglo de chpoints
        checkpoints[2] == true
        progress+=25;

        //Annadir el mensaje de checkpoint
        var msm = this.physics.add.group();
        msm.create(180,-80,"msmCheck");
        msm.setVelocity(0,110)

    }

}
 function collectStar (player, star){
     
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    collectedStars++;

   
 }

 function asignarEventos(game){
    asignarEventosInicio(game);
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
    btn_volver = document.getElementById("regresaInicio");
    btn_mapa = document.getElementById("boton_mapa");
    btnRestart = document.getElementById('prueba');
 }

 function cambiarModalBox(origen,destino){
    origen.className = "contenedor_info oculto";
    destino.className = "contenedor_info";
 }

 function cambiarPantalla(origen, destino){
    origen.className = "oculto";
    destino.className = "pantalla animated fadeIn slower";
 }

 function asignarEventosInicio(thisGame){

    btn_volver.addEventListener("click", function(){
        cambiarPantalla(pantalla_game, pantalla_inicio);
        resultado_juego.className = "oculto";
        thisGame.sys.game.destroy(true);
        startNewGame();
    });

    btnRestart.addEventListener("click", function(){
        cambiarPantalla(pantalla_game, pantalla_game);
        resultado_juego.className = "oculto";
        thisGame.sys.game.destroy(true);
        startNewGame();
    });

    btnContinuar.addEventListener("click", function(){
        cambiarPantalla(pantalla_inicio, pantalla_mapa);
    });

    Array.from(btnOpciones).forEach(function(element) {
        element.addEventListener('click', function(){
            cambiarPantalla(element.parentElement, pantalla_opciones);
        });
      });
    btnMusica.addEventListener("click", ApagarMusica);
        
      
 }

 function ApagarMusica(){

      switch (musicIsOn) {
            case true:
                console.log("Apagar Musica");
                music.pause();
                musicIsOn = false;
                break;
            case false:
                console.log("Encender Musica");
                music.play();
                musicIsOn = true;
                break;
            default:
                break;
        }

 }

 function asignarEventosOpciones(){

    opcion_menu.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
    opcion_personajes.addEventListener("click", function(){
        
    });

    opcion_musica.addEventListener("click", ApagarMusica);

    opcion_creditos.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_creditos);
    });
    btn_volver.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
    boton_volverOpciones.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
    boton_volverMapa.addEventListener("click", function(){
        cambiarPantalla(pantalla_mapa, pantalla_inicio);
    });
    boton_volverCreditos.addEventListener("click", function(){
        cambiarPantalla(pantalla_creditos, pantalla_opciones);
        console.log('Regresar');
    });
    
 }

 function asignarEventoMapa(){
    btn_mapa.addEventListener("click", function(){
        pause = false;
        cambiarPantalla(pantalla_mapa, pantalla_game);
    });
 }

 function randomNum(max,min){
    return Math.floor(Math.random() * ((max+1) - min) + min);
    }


}
app.initialize();

