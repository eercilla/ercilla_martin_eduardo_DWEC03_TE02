'use-stric'
/* Cargamos el fichero con los usuarios */
let ruta = 'data/usuarios.json';

$(document).ready(function(){

    
    /* Comportamiento del botón "Entrar" */
    var boton1 = $("#bot1");

    boton1.mouseenter(function(){
        boton1.css("transform", "scale(1.5)");
        boton1.css("transition", "1s");
    })

    boton1.mouseout(function(){
        boton1.css("transform", "scale(1)");
        boton1.css("transition", "1s");
        
    })

    /* Comportamiento caja de texto */

    var inp1 = $("input");

    inp1.focus(function(){
        $(this).css("border", "0.3rem dashed grey");
        $(this).css("background", "white");
        if($(this).val()==="Contraseña" || $(this).val()==="Nombre de usuario"){ //Solo para borrar valores por defecto
            $(this).val("");
        } 
        $(".regex").remove();
        
    })

    inp1.blur(function(){
        $(this).css("border", "");
        $(this).css("background", "rgb(241, 241, 241)");

    })

    /* Comportamiento botón "Empezar" */
    var boton2 = $("#bot2");

    boton2.mouseenter(function(){
        boton2.css("transform", "scale(1.2)");
        boton2.css("transition", "1s");
    })

    boton2.mouseout(function(){
        boton2.css("transform", "scale(1)");
        boton2.css("transition", "1s");
        
    })

    boton2.click(function(){
  
        location.href="gameplay.html";
        var nivel = $("[name='dificultad']:checked").val();

        localStorage.setItem("modo", nivel);
           
    })

    /* Crear tablero en gameplay.html (la única con tempo) */

    if ($(".tempo").length) {
        crearTablero();
    };

    

    var modo = $(".opcion");



    modo.click(function(){
        
        $(".opcion").removeClass("seleccionado");
        
        $(this).addClass("seleccionado");
    })

    var boton3 = $("#bot6");

    boton3.mouseenter(function(){
        boton3.css("transform", "scale(1.2)");
        boton3.css("transition", "1s");
    })

    boton3.mouseout(function(){
        boton3.css("transform", "scale(1)");
        boton3.css("transition", "1s");
        
    })

    boton3.click(function(){

        // Carga la página de login
        location.href="presentacion.html"
        
    })

    var boton4 = $("#bot7");

    boton4.mouseenter(function(){
        boton4.css("transform", "scale(1.2)");
        boton4.css("transition", "1s");
    })

    boton4.mouseout(function(){
        boton4.css("transform", "scale(1)");
        boton4.css("transition", "1s");
        
    })

    // Se desloguea y vuelve al inicio
    boton4.click(function(){

        localStorage.removeItem("jugador");
        localStorage.removeItem("tiempo");
        // Carga la página tal y como estaba en la primera partida
        location.href="index.html";
        
    })

    var tiempo = 0;

    // Si tiempo de sesión ya ha sido creado, (es decir, estamos en una sesión) actualiza
    // nuestra variable tiempo con el valor en localStorage, y sino, lo reinicia (100 segundos)
    if(localStorage.getItem("tiempo")){
        tiempo = localStorage.getItem("tiempo");
    } else{
        tiempo = 100;
    }

    // Se reinicia el tiempo si por cualquier motivo se cierra la partida y hay que volver a abrir index.html
    if($(".login").length){
        tiempo = 100;
        localStorage.removeItem("jugador");
        localStorage.removeItem("tiempo");
    }
    

    

    // Funcion para manejar el tiempo de sesión y el tiempo de partida
    function crearCont(tiempo){
        
        //El tiempo de cada partida se inicia a 0
        var tiempoPart = 0;

        function actualizarCont() {
            if (tiempo > 0) {

                // Tiempo de sesión desciende cada segundo
                tiempo--;

                // Tiempo de sesión aumenta cada segundo
                tiempoPart++;

                // Añadimos el tiempo de sesión a la pantalla de juego y guardamos su valor
                // y el del tiempo de partida a localStorage
                var cont = $("#contador")
                cont.text(tiempo);
                localStorage.setItem("tiempo",tiempo);
                localStorage.setItem("tiempoPartida",tiempoPart);
            } else { // Se acabó el tiempo de sesión

                localStorage.setItem("ganado", "no");
                
                clearInterval(intervalo);
                alert("¡Tiempo de sesión terminado! Regresarás a la página de inicio.");

                // Se reinicia el tiempo (borra el tiempo de la sesión anterior)
                localStorage.removeItem("tiempo");
                location.href="index.html";
            }
        }
        let intervalo = setInterval(actualizarCont, 1000); // 
    }
    

    // Array de colores en función del modo de juego elegido
    var colors;

    switch (localStorage.getItem("modo")) {
        case 'facil':
        colors = ["red", "blue", "red", "blue"];
        break;
        case 'normal':
        colors = ["red", "blue", "green", "yellow", "red", "blue", "green", "yellow"];
        break;
        case 'dificil':
        colors = ["red", "blue", "green", "yellow", "white", "black", "red", "blue", "green", "yellow", "white", "black"];
        break;
    }

    // Si estamos en la pantalla de gameplay barajamos y creamos el cronómetro
    if ($(".juego").length){


        barajar(colors);
        crearCont(tiempo);
    }

    // Generamos el array de elementos que serán nuestaras cartas
    var cartas = $(".carta");


    // Se le añade el color del array de colores, ya barajado al array de cartas
    try {

        for (var i = 0; i < colors.length; i++){

            cartas[i].dataset.color = colors[i]
            cartas[i].dataset.volteada = false; // No dada la vuelta por defecto (color gris)


        }
    }catch{}



    // Barajar las cartas
    function barajar(array) {

        console.log("cosa rara");
        for (let i = array.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * (i + 1));

                // Intercambia los valores de la posición i por la de la posición aleatoria j
                [array[i], array[j]] = [array[j], array[i]];
            }
        return array;
    }

    //Funcionamiento del juego al hacer click en una carta

    var cartaAux = $(".carta");

    var primeraCarta;
    var segundaCarta;
    var cont = 1;
    var bloqueo = false;
    var aciertos = 0;
    var erroresMax = 1;
    var errores = 0;

    //Configuramos el número de errores y aciertos por nivel de dificultad
    if ($(".juego").length){


        var aciertoMax = $("#aciertoMax")
        var cantidad = colors.length/2;
        aciertoMax.text(cantidad);


        console.log(localStorage.getItem("modo"));
        console.log(erroresMax);
        if(localStorage.getItem("modo")==="facil"){

            erroresMax=2;
console.log(erroresMax);
        }else if(localStorage.getItem("modo")==="normal"){
            erroresMax=5; 
            console.log(erroresMax);
        }else if(localStorage.getItem("modo")==="dificil"){
            
            erroresMax=8; 

        }

        console.log("HOLA") + erroresMax;

        // Mostramos en la web el número de errores máximo en función del modo
        var eMax = $("#errorMax");
        eMax.text(erroresMax);
    }


    // Comportamiento de las cartas al hacer click
    cartaAux.click(function(){
        
        // El tablero se bloquea al elegir la segunda carta hasta para que no se pueda elegir
        // una tercera hasta que no haya completado el proceso de comparación de las dos cartas
        if (bloqueo) return;

        // Partida ganada, por defecto: no
        localStorage.setItem("ganado", "no");


        // Si carta volteada (gris) al hacer click: cambia de color por su valor en el dataSet
        if($(this).data("volteada")===false){
            $(this).css("background", $(this).data("color"));
            $(this).data("volteada",true); // Cambia el valor volteada
            
            // Si primera carta
            if(cont===1){
                primeraCarta = $(this); // Memorizamos la primera carta
                cont++;
            }else if(cont===2){ //Si segunda carta
                segundaCarta = $(this); // Memorizamos la segunda carta

                // Bloqueamos el tablero
                bloqueo = true;
                cont++;
            }

            // Cuando 2 cartas ya han sido volteadas
            if (cont>2){

                // Si mismo color
                if(primeraCarta.css("background") === segundaCarta.css("background")){

                    // setTimeout se usa para que se puedan ver las vartas antes de desaparecer
                    setTimeout(function() {

                        // Incrementa el número de aciertos y se almacena el nuevo dato
                        aciertos++;
                        localStorage.setItem("parejas",aciertos);

                        // Si aciertos es igual al máximo posible
                        if(aciertos === colors.length/2){

                            // Partida ganada: sí y nos envía a la página de resultados
                            localStorage.setItem("ganado", "si");
                            location.href="resultados.html";
                        }

                        // Modificamos el número de aciertos de la web
                        var aci = $("#acierto")
                        aci.text(aciertos);

                        // Contador se vuelve a poner a 1
                        cont = 1;

                        // Desbloqueamos el tablero
                        bloqueo = false;

                        // Desaparecen las cartas que ya han sido emparejadas
                        primeraCarta.css("visibility", "hidden");
                        segundaCarta.css("visibility", "hidden");
                    }, 500); // Tiempo que se ven
                
                } else{ //Si cartas de diferente color
                
                
                setTimeout(function() {

                    // Aumenta el número de errores, los almacena y los muestra en la web
                    errores++;
                    localStorage.setItem("errores",errores);
                    var error = $("#error")
                    error.text(errores);

                    // Las cartas vuelven a su estado inicial
                    primeraCarta.css("background", "");
                    primeraCarta.data("volteada", false);
                    segundaCarta.css("background", "");
                    segundaCarta.data("volteada", false);

                    // Se reinicial el contador y se desbloquea el tablero
                    cont = 1;
                    bloqueo = false;

                    // Cambia de color cuando solo le queda un error a modo de alerta para el jugado
                    if (errores === erroresMax - 1){
                        $("#contError").addClass("peligro");
                    }

                    // Si se han cometido el número de errores máximos permitidos
                    if (errores === erroresMax){
                        alert("Demasiados errores");
                        location.href="resultados.html";
                    }
                    
                }, 500);}
            }

        }


    })


    // Comportamiento de las cartas al pasar el ratón y retirarlo sobre ellas
    cartaAux.mouseenter(function(){
        $(this).css("transform", "scale(1.3)");
    })

    cartaAux.mouseout(function(){
        $(this).css("transform", "scale(1)");   
    })



    // Función para cargar un JSON desde una ruta específica
    async function cargarJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${url}`);
        }

        const json = await response.json();

        // Carga el json en localStorage
        localStorage.setItem("usuarios", JSON.stringify(json));

    }

    // Hacemos que solo cargue el json una sola vez, en la pantalla de index
    if($(".login").length){
        cargarJSON(ruta);
    }
    
    // Lo que sucederá en login al puslar "Entrar"
    boton1.click(function(){

        //Impide el comportamiento por defecto de la página
        //Impide que se refresque al apretar el botón
        event.preventDefault();

        // Obtiene los datos el json almacenado en localStorage
        var baseDatos = JSON.parse(localStorage.getItem("usuarios")); 

        // Obtenemos los valores introducidos en los campos usuario y contraseña
        const usuariohtml = $("#usuario").val();
        const contrasena = $("#passw").val();
        
        // Valores alfanuméricos para comparar la contraseña
        var contRegex = /^[a-zA-Z0-9]+$/


        // Comprobamos que ningún cuadro de texto esté vacío o con los valores por defecto
        if(usuariohtml.trim() === '' || usuariohtml.trim() === 'Nombre de usuario' || contrasena.trim() === '' || contrasena.trim() === 'Contraseña'){
            
            // Se muestra mensaje en la web
            texto = $("<p class='regex'>Algún campo está vacío</p>");
            $("#contenedor").append(texto);
            return;
        }

        // Comprobamos si son solo caracteres alfanuméricos (no acepta la Ñ)
        if (!contRegex.test(contrasena)){
            
            // Se muestra mensaje en la web
            texto = $("<p class='regex'>Introduce solo caracteres alfanuméricos.</p>");
            $("#contenedor").append(texto);
            return;
        } 

        // Se realiza la búsqueda de los valores introducidos en el json/base de datos 
        var logueado = baseDatos.find(user => user.usuario === usuariohtml && user.contraseña === contrasena);

        // Si usuario y contraseña coinciden       
        if (logueado) {
            alert("Logueado con éxito. Estás siendo redirigido al inicio de la partida.");

            // Almacenamos el nombre del jugador y redirigimos a la pantalla de presentación
            localStorage.setItem("jugador", usuariohtml)
            location.href="presentacion.html";

        } else { // Si no coinciden
                alert("Usuario o contraseña incorrectos");
        }
    })

    // var dif = $("[name='dificultad']");

    // Funcion para crear el tablero
    function crearTablero() {

        var tablero = $("#pantRes");
    
        let numCartas=0;

        // En función del modo almacenado en localStorage tendrá diferente número
        // de cartas y diferentes configuraciones de visualización
        switch (localStorage.getItem("modo")) {
            case 'facil':
                numCartas = 4;
                var section = $("<section class='gameFacil'> </section>");

                rellenar();
                tablero.append(section);

                break;
            case 'normal':
                numCartas = 8;
                var section = $("<section class='gameNormal'> </section>");
                rellenar();
                tablero.append(section);
                
                break;
            case 'dificil':
                numCartas = 12;
                var section = $("<section class='gameDificil'> </section>");

                rellenar();
                tablero.append(section);
                
                break;
        }
        
        // Generamos las cartas que veremos y les añadimos un estilo
        function rellenar(){
            for (let i = 0; i < numCartas; i++) {
                var carta = $("<div class='carta'></div>");
                section.append(carta); 
            }
        }
    }

    // Sucederá en páginas con clase = .resulIzq (es decir la página resultados.html)
    if ($(".resultIzq").length) {

        // Obtenemos la posición donde se van a añadir los resultados
        var pare = $("#parejas");
        var ecome = $("#ecometidos");
        var time = $("#tiempo");

        // Añadimos la información de los resultados almacenada en localStorage
        pare.text(localStorage.getItem("parejas"));
        ecome.text(localStorage.getItem("errores"));
        time.text(localStorage.getItem("tiempoPartida"));

        // Reseteamos las parejas y los errores
        localStorage.setItem("parejas",0);
        localStorage.setItem("errores",0);


        // Uno u otro resultado
        resultados();
    };
    
    var texto;

    function resultados(){

        // Si partida ganada
        if(localStorage.getItem("ganado")== "si"){
            texto = $("<p class='resulText1'>Enhorabuena, " + localStorage.getItem("jugador") + "</p><p class='resulText1'>HAS GANADO!!</p>");
            
            // Añadimos el texto (ganado) en la parte izquierda de resultados.html
            $(".resultIzq").append(texto);

        }else if (localStorage.getItem("ganado")=="no"){ // Si partida perdida
            texto = $("<p class='resulText2'>Fallaste.</p>");
        
            // Añadimos el texto (perdido) en la parte izquierda de resultados.html
            $(".resultIzq").append(texto);
        }
    }
    

})