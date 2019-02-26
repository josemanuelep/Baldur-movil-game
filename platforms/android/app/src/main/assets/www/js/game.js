var gameOver = false;
var checkpoints = [false, false, false];
var btnContinuar, btnOpciones, opcion_menu, opcion_personajes, opcion_musica, opcion_creditos, boton_volver;

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
    cargarBotones();btnContinuar
    cambiarPantalla(pantalla_carga, pantalla_inicio);
    asignarEventos();
}

function create ()
{
    
    // this.add.image(180, 360, 'cargando');
}

function update ()
{
}

function asignarEventos(){
    asignarEventosInicio();
    asignarEventosOpciones(); 
}

function cargarImagenes(game){
    game.load.image('asteroide_derecha_grande','../img/asteroide_derecha_grande.png');
}

function cargarBotones(){
    btnContinuar = document.getElementById("btnContinuar");
    btnOpciones = document.getElementById("btnOpciones")
    btnMusica = document.getElementById("btnMusica");
    opcion_menu = document.getElementById("opcion_menu");
    opcion_personajes = document.getElementById("opcion_personajes");
    opcion_musica = document.getElementById("opcion_musica");
    opcion_creditos = document.getElementById("opcion_creditos");
    boton_volver = document.getElementById("boton_volver");
}

function cambiarPantalla(origen, destino){
    origen.className = "oculto";
    destino.className = "pantalla animated fadeIn slower";
}

function asignarEventosInicio(){
    btnContinuar.addEventListener("click", function(){
        console.log("Abrir Pantalla Mapa");
    });
    btnOpciones.addEventListener("click", function(){
        cambiarPantalla(pantalla_inicio, pantalla_opciones);
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
    boton_volver.addEventListener("click", function(){
        cambiarPantalla(pantalla_opciones, pantalla_inicio);
    });
}