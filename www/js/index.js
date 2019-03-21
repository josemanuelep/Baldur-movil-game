/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        var musicIsOn = false;
        var musicIsCreated = false;
        var gameOver = false;
        var pause = true;
        var score = 0;
        var scoreText;
        var collectedStars = 0;
        var stars;
        var fails = 0;
        var progress;
        var numStars;
        var checkPointString;

        var btnVolverOpcionesCache;
        var config = {
            type: Phaser.AUTO,
            width: 360,
            height: 640,
            parent: "pantalla_game",
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
        function preload() {
            cargarImagenes(this);
            cargarBotones();
            asignarEventos(this);
            this.load.audio('theme', 'Twisting.mp3');
        }

        function cargarImagenes(game) {
            game.load.image('fondo_juego', 'img/fondo_juego.gif');
            game.load.image('dude', 'img/personaje.png');
            game.load.image('icono_estrellas', 'img/simbolo_conteo_estrellas.png');
            game.load.image('opciones_juego', 'img/opciones_juego.png');
            game.load.image('star', 'img/estrellas_recolectar_juego.png');
            game.load.spritesheet('asteroids', 'img/asteroids.png', { frameWidth: 223, frameHeight: 226 });

        }

        function cargarBotones() {
            //Pantalla Inicio
            btnContinuar = document.getElementById("btnContinuar");
            btnOpcionesInicio = document.getElementById("btnOpcionesInicio");
            btnMusica = document.getElementById("btnMusica");

            //Pantalla Mapa
            btnMapa = document.getElementById("boton_mapa");
            btnVolverMapa = document.getElementById("boton_volverMapa");
            btnOpcionesMapa = document.getElementById("btnOpcionesMapa");

            //Pantalla Opciones
            btnOpcionMenu = document.getElementById("opcion_menu");
            btnOpcionPersonajes = document.getElementById("opcion_personajes");
            btnOpcionMusica = document.getElementById("opcion_musica");
            btnOpcionCreditos = document.getElementById("opcion_creditos");
            btnVolverOpciones = document.getElementById("boton_volverOpciones");

            //Pantalla Creditos
            btnVolverCreditos = document.getElementById("boton_volverCreditos");

            //Pantalla Resultado
            btn_volver = document.getElementById("regresaInicio");
            btn_restart = document.getElementById('nueva_partida');
            btn_der_estadisticas = document.getElementById('moverDerEstadistica');
            btn_izq_estadisticas = document.getElementById('moverIzqEstadistica');
            btn_izq_secretos = document.getElementById('moverIzqSecretos');
            btn_der_valorar = document.getElementById('moverDerValoranos');

        }

        function asignarEventos(game) {
            //Pantalla Inicio
            btnContinuar.addEventListener("click", function () {
                cambiarPantalla(pantalla_inicio, pantalla_mapa);
            });
            btnMusica.addEventListener("click", switchMusic);
            btnOpcionesInicio.addEventListener('click', function () {
                btnVolverOpcionesCache = pantalla_inicio;
                cambiarPantalla(pantalla_inicio, pantalla_opciones);
            });

            //Pantalla Mapa
            btnVolverMapa.addEventListener("click", function () {
                btnVolverOpcionesCache = pantalla_mapa;
                cambiarPantalla(pantalla_mapa, pantalla_inicio);
            });
            btnOpcionesMapa.addEventListener("click", function () {

                cambiarPantalla(pantalla_mapa, pantalla_opciones);
            });
            btnMapa.addEventListener("click", function () {
                if (gameOver) {
                    gameOver = false;
                    this.scene.restart();
                }
                else{
                    this.scene.resume();
                }
                pause = false;
                cambiarPantalla(pantalla_mapa, pantalla_game);
            }.bind(game));

            //Pantalla Opciones
            btnOpcionMenu.addEventListener("click", function () {
                cambiarPantalla(pantalla_opciones, pantalla_inicio);
            });
            btnOpcionPersonajes.addEventListener("click", function () {
            });
            btnOpcionMusica.addEventListener("click", switchMusic);
            btnOpcionCreditos.addEventListener("click", function () {
                cambiarPantalla(pantalla_opciones, pantalla_creditos);
            });
            btnVolverOpciones.addEventListener("click", function () {
                if (btnVolverOpcionesCache == pantalla_game) {
                    this.scene.resume();
                }
                cambiarPantalla(pantalla_opciones, btnVolverOpcionesCache);
            }.bind(game));

            //Pantalla Creditos
            btnVolverCreditos.addEventListener("click", function () {
                cambiarPantalla(pantalla_creditos, pantalla_opciones);
            });

            //Eventos de los botones para navegar en los modals box
            btn_der_estadisticas.addEventListener("click", function () {
                let screen1 = document.getElementById("secretosBaldur");
                let screen2 = document.getElementById("estadisticasBaldur");
                changeCard(screen1, screen2);
            });
            btn_izq_secretos.addEventListener("click", function () {
                let screen1 = document.getElementById("estadisticasBaldur");
                let screen2 = document.getElementById("secretosBaldur");
                changeCard(screen1, screen2);
            });
            btn_der_valorar.addEventListener("click", function () {
                let screen1 = document.getElementById("estadisticasBaldur");
                let screen2 = document.getElementById("valorarBaldur");
                changeCard(screen1, screen2);
            });
            btn_izq_estadisticas.addEventListener("click", function () {
                let screen1 = document.getElementById("valorarBaldur");
                let screen2 = document.getElementById("estadisticasBaldur");
                changeCard(screen1, screen2);
            });

            //Eventos de las opciones de pantalla de resultado
            btn_restart.addEventListener("click", function () {
                resultado_juego.className = "oculto";
                pause = false;
                gameOver = false;
                this.scene.restart();
            }.bind(game));
            btn_volver.addEventListener("click", function () {
                resultado_juego.className = "oculto";
                cambiarPantalla(pantalla_game,pantalla_mapa);
                this.scene.pause();
            }.bind(game));
        }

        function switchMusic() {
            switch (musicIsOn) {
                case true:
                    music.pause();
                    musicIsOn = false;
                    break;
                case false:
                    if(musicIsCreated){
                        music.resume();
                    }
                    else{
                        music.play();
                        musicIsCreated = true;
                    }
                    musicIsOn = true;
                    break;
                default:
                    break;
            }
        }

        function create() {
            //Musica
            music = this.sound.add('theme');
            switchMusic();

            //Asignar el fondo del juego
            this.add.image(180, 320, 'fondo_juego');

            //Grupo de estrellas
            var Star = new Phaser.Class({

                Extends: Phaser.Physics.Arcade.Image,

                initialize:

                    function Star(scene) {
                        Phaser.Physics.Arcade.Image.call(this, scene, 0, 0, 'star');
                    },

                fire: function () {
                    this.body.checkCollision.none = false;
                    this.setPosition(Phaser.Math.FloatBetween(20, 300), -10);
                    this.setActive(true);
                    this.setVisible(true);
                },

                update: function (time, delta) {
                    if (this.y > 645) {
                        this.setActive(false);
                        this.setVisible(false);
                    }


                }

            });
            stars = this.physics.add.group({
                classType: Star,
                maxSize: 6,
                runChildUpdate: true
            });

            //Grupo de asteroides
            asteroids = this.physics.add.group({
                key: 'asteroids',
                frame: Phaser.Utils.Array.NumberArray(0, 3),
                maxSize: 4,
                active: false,
                visible: false
            });

            //Personaje
            sprite = this.add.image(180, 560, 'dude');
            this.physics.world.enable(sprite);
            sprite.body.setCollideWorldBounds(true);
            sprite.setInteractive({ draggable: true });
            sprite.body.setSize(30, 110);

            var event = this.time.addEvent({ paused: true, startAt: 2000, delay: 2500, callback: createStars, callbackScope: this, loop: true });
            var timedEvent = this.time.addEvent({ paused: true, startAt: 2000, delay: 6000, callback: createAsteroids, callbackScope: this, loop: true });

            //Al tocar el sprite se crean y se mueven estrellas
            sprite.on('pointerdown', function (pointer) {
                event.paused = false;
                timedEvent.paused = false;
            }.bind(this));

            //Recolector de estrellas
            this.physics.add.overlap(sprite, stars, collectStar, null, this);

            //Colsiones
            this.physics.add.collider(sprite, asteroids);

            //Detectar la colision entre Baldur y los asteroides
            this.physics.add.overlap(sprite, asteroids, collision, null, this);

            //iconos del juego
            this.add.image(24, 24, 'icono_estrellas').setOrigin(0);
            scoreText = this.add.text(60, 30, '0', { fontFamily: 'Akrobat', fontStyle: '900', color: '#ecdeb5', fontSize: '15px' });

            //Botones acciones
            btnOpciones = this.add.sprite(308, 24, 'opciones_juego').setInteractive();
            btnOpciones.setOrigin(0);
            btnOpciones.on('pointerdown', function () {
                btnVolverOpcionesCache = pantalla_game;
                this.scene.pause();
                cambiarPantalla(pantalla_game, pantalla_opciones);
            }.bind(this));

        }

        function createStars() {
            if (gameOver == false && pause == false) {
                star = stars.get();
                if (star) {
                    var rdn = Phaser.Math.Between(1, 4);
                    switch (rdn) {
                        case 1:
                            star.setScale(1);
                            star.setCircle(15);
                            break;
                        case 2:
                            star.setScale(1.3);
                            star.setCircle(15);
                            break;
                        case 3:
                            star.setScale(1.6);
                            star.setCircle(15);
                            break;
                        case 4:
                            star.setScale(2);
                            star.setCircle(15);
                            break;
                        default:
                            break;
                    }
                    star.fire();
                    stars.setVelocity(0, 60);
                }

            }

        }

        function createAsteroids() {
            if (gameOver == false && pause == false) {
                asteroid = asteroids.getLast();
                if (asteroid) {
                    console.log(asteroid.frame.name);
                    asteroid.setPosition(Phaser.Math.FloatBetween(20, 300), 5)
                        .setActive(true)
                        .setVisible(true)
                        .setVelocity(0, 60);
                    if (asteroid.frame.name == 0 || asteroid.frame.name == 2) {
                        asteroid.body.setCircle(100);
                    }
                    else {
                        asteroid.body.setCircle(75);
                    }
                }
            }
        }

        function collectStar(player, star) {
            star.body.checkCollision.none = true;
            star.setActive(false);
            star.setVisible(false);
            score += 10;
            scoreText.setText('Score: ' + score);
            collectedStars++;
        }

        function collision() {

            gameOver = true;
            fails++;

            saveGameData();

            asteroids.setVelocity(0, 0);
            stars.setVelocity(0, 0);

            showModalBox();
        }

        function showModalBox() {
            //Mostrar modal box
            resultado_juego.className = "modal_box animated fadeIn slower";
            contenedor_perdiste.className = "contenedor_resultado modal_box animated fadeIn slower";
            secretosBaldur.className = "contenedor_info animated fadeIn";
            btn_restart.className = "animated fadeIn";
            btn_volver.className = "animated fadeIn";

            //Variables del localStorage - inicializacion
            progress = localStorage.getItem("progress");
            fails = localStorage.getItem("fails");
            numStars = localStorage.getItem("estrellas");
            checkPointString = localStorage.getItem("check");

            //Imprimir Estadísticas
            document.getElementById("progresoPartida").innerHTML = progress + '%';
            document.getElementById("fracasosPartida").innerHTML = fails;
            document.getElementById("estrellasPartida").innerHTML = collectedStars;
            document.getElementById("checkPointsPartida").innerHTML = checkPointString;
        }

        function changeCard(origen, destino) {
            origen.className = "oculto";
            destino.className = "contenedor_info";
        }

        function saveGameData() {

            /*Guardando los datos en el LocalStorage*/
            localStorage.setItem("fails", fails);
            localStorage.setItem("progress", progress);
            localStorage.setItem("estrellas", collectedStars);

            var ch;
            switch (progress) {
                case 0:
                    ch = '0/4';
                    break;
                case 25:
                    ch = '1/4';
                    break;
                case 50:
                    ch = '2/4';
                    break;
                case 75:
                    ch = '3/4';
                    break;
                case 100:
                    ch = '4/4';
                    break;
                default:
                    ch = '0/4';
                    break;
            }
            localStorage.setItem("check", ch);
        }

        function update() {
            sprite.on('drag', function (pointer, dragX, dragY) {
                this.x = dragX;
            });

            asteroids.children.iterate(function (asteroid) {
                if (asteroid.y > 800) {
                    asteroids.killAndHide(asteroid);
                }
            });
        }

        var game = new Phaser.Game(config);
        cambiarPantalla(pantalla_carga, pantalla_inicio);
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

function cambiarPantalla(origen, destino) {
    origen.className = "oculto";
    destino.className = "pantalla animated fadeIn slower";
}

app.initialize();