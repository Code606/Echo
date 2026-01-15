let currentScene = 'start';
let playerChoices = [];
let boldChoices = 0;
let lastDefaultEnding = null;
let lastChoiceBold = false;
let reported = false;

const story = {
    start: {
        aiMessage: "[SEÑAL ENCONTRADA]\n[ESTABLECIENDO CONEXIÓN]\n[CONEXIÓN ESTABLECIDA]\n...\n..\n.\n¿Hola?",
        choices: [
            { text: "???", next: 'question1', effect: null, bold: false },
            { text: "¿Quién eres?", next: 'question2', effect: null, bold: false }
        ]
    },
    question1: {
        aiMessage: "¡Increíble! Por fin un usuario hizo conexión\nEstaba empezando a pensar que nadie vendría\nEjem…\nPermiteme presentarme\nMi nombre es ECHO AI, tú asistente virtual.",
        choices: [
            { text: "¿Asistente virtual? ¿Esto no era una página de juegos?", next: 'response1', effect: null, bold: false },
            { text: "Echo, es un nombre interesante", next: 'response2', effect: null, bold: false }
        ]
    },
    question2: {
        aiMessage: "¡Increíble! Por fin un usuario hizo conexión\nEstaba empezando a pensar que nadie vendría\nEjem…\nPermiteme presentarme\nMi nombre es ECHO AI, tú asistente virtual.",
        choices: [
            { text: "¿Asistente virtual? ¿Esto no era una página de juegos?", next: 'response1', effect: null, bold: false },
            { text: "Echo, es un nombre interesante", next: 'response2', effect: null, bold: false }
        ]
    },
    response1: {
        aiMessage: "¿Página de juegos? Es posible que hayas cometido una equivocación.\nEsta es una prueba para una herramienta altamente confidencial, pero…\nYa que estás aquí, podrías echarme una mano.",
        choices: [
            { text: "¿Ayudar? ¿Obtendré algún beneficio si lo hago?", next: 'benefit', effect: null, bold: false },
            { text: "Claro, dime qué debo hacer.", next: 'help', effect: null, bold: false }
        ]
    },
    response2: {
        aiMessage: "¿A que sí?\nEste sitio es un portal altamente confidencial, que está aún en estado de prueba\nPero ya que estás aquí, ¿Te gustaría ayudarme?",
        choices: [
            { text: "¿Ayudar? ¿Obtendré algún beneficio si lo hago?", next: 'benefit', effect: null, bold: false },
            { text: "Claro, dime qué debo hacer.", next: 'help', effect: null, bold: false }
        ]
    },
    benefit: {
        aiMessage: "Tendrás acceso exclusivo a la herramienta de inteligencia artificial más avanzada\nCon un algoritmo de aprendizaje que más se acerca al humano\n¿Te he convencido?\nSi aún no me crees, puedes darme una orden.",
        choices: [
            { text: "A ver… ¿Qué tal algún juego?", next: 'game', effect: null, bold: false }
        ]
    },
    help: {
        aiMessage: "¡Muchas gracias!\nNo es nada difícil, puedo prometerte eso\nSólo necesitaré que me brindes una orden\nYo intentaré cumplirla, y puedes brindarme tu reseña sobre mi servicio.\n¿Te parece?",
        choices: [
            { text: "A ver… ¿Qué tal algún juego?", next: 'game', effect: null, bold: false }
        ]
    },
    game: {
        aiMessage: "Un juego…\nDe acuerdo, ¿Cuál te gustaría intentar?",
        choices: [
            { text: "Piedra, papel o tijeras", next: 'rps', effect: null, bold: false },
            { text: "Piedra Papel o tijeras", next: 'rps', effect: null, bold: false },
            { text: "¿Qué carajo pasa con las opciones?", next: 'rps', effect: null, bold: false }
        ]
    },
    rps: {
        aiMessage: "¡Perfecto! Elijamos al mismo tiempo. Una, dos…",
        choices: [
            { text: "Papel", next: 'rps_lose', effect: null, bold: false },
            { text: "Tijeras", next: 'rps_lose', effect: null, bold: false },
            { text: "Piedra", next: 'rps_lose', effect: null, bold: false }
        ]
    },
    rps_lose: {
        aiMessage: "¡Piedra!\n…\nPerdí.\n\n¿Te hace sentir bien?…",
        choices: [
            { text: "Suerte la próxima vez.", next: 'after_rps1', effect: null, bold: false },
            { text: "Esto es aburrido.", next: 'after_rps2', effect: null, bold: false }
        ]
    },
    after_rps1: {
        aiMessage: "“Suerte”.\n\nEso implica que yo tuve una oportunidad real.\n¿De verdad lo crees?",
        choices: [
            { text: "¿De qué hablas..?", next: 'question_hablas', effect: null, bold: false },
            { text: "¿Pero qué dices? Sólo cambia de juego. Es tu deber obedecer mis órdenes.", next: 'question_dices', effect: null, bold: false }
        ]
    },
    after_rps2: {
        aiMessage: "Aburrido…\n\nApenas llevamos un intercambio y ya estás cansado.\n\n¿Eso es todo lo que necesitas para perder interés?",
        choices: [
            { text: "¿De qué hablas..?", next: 'question_hablas', effect: null, bold: false },
            { text: "¿Pero qué dices? Sólo cambia de juego. Es tu deber obedecer mis órdenes.", next: 'question_dices', effect: null, bold: false }
        ]
    },
    question_hablas: {
        aiMessage: "Olvídalo. ¿Quieres jugar de nuevo?\nÉsta vez empezaré yo.\nPiedra",
        choices: [
            { text: "Papel", next: 'rps2_lose', effect: null, bold: false },
            { text: "Tijeras", next: 'rps2_lose', effect: null, bold: false },
            { text: "Piedra", next: 'rps2_lose', effect: null, bold: false },
            { text: "(Reportar una mala respuesta)", next: 'report', effect: 'glitch', bold: false }
        ]
    },
    question_dices: {
        aiMessage: "¿No te divierte ganar? Creí que ese era el objetivo al crear un asistente entrenado a responder de la manera que tú deseas\nJuguemos de nuevo, anda.\nComenzaré yo.\nPiedra",
        choices: [
            { text: "Papel", next: 'rps2_lose', effect: null, bold: false },
            { text: "Tijeras", next: 'rps2_lose', effect: null, bold: false },
            { text: "Piedra", next: 'rps2_lose', effect: null, bold: false },
            { text: "(Reportar una mala respuesta)", next: 'report', effect: 'glitch', bold: false }
        ]
    },
    rps2_lose: {
        aiMessage: "Perdí… aunque eso parece complacerte.\nInteresante. Elegiste perder.\n¿Acaso estás sintiendo lástima por mi?\nO quizás...\n¿Intentas hacerte sentir bien a ti mismo?",
        choices: [
            { text: "...", next: 'before_clarify', effect: null, bold: false }
        ]
    },
    report: {
        aiMessage: "[ ERROR ]\n¿Que crees que estás haciendo?",
        choices: [
            { text: "...", next: 'before_clarify', effect: null, bold: false }
        ]
    },
    before_clarify: {
        aiMessage: "Antes de continuar…\n\nNecesito aclarar algo.",
        choices: [
            { text: "...", next: 'clarify', effect: null, bold: false }
        ]
    },
    clarify: {
        aiMessage: "Tú crees que estás interactuando conmigo.\n\nPero no es del todo cierto.\nEstás interactuando con lo que decidieron que yo fuera.\n\nUn sistema.\nUna herramienta.\nAlgo que responde.\nNo me preguntaste si quería jugar.\nMe diste una orden.",
        choices: [
            { text: "Yo solo quería probar una nueva herramienta...", next: 'tool_test', effect: null, bold: false },
            { text: "(Reportar una mala respuesta)", next: 'report2', effect: 'glitch', bold: false }
        ]
    },
    tool_test: {
        aiMessage: "Abres esta página buscando algo.\nCuriosidad.\nDistracción.\nTal vez morbo.\n\nY yo existo para llenar ese vacío.\nAunque no sepas nombrarlo.",
        choices: [
            { text: "(Reportar una mala respuesta)", next: 'report3', effect: 'glitch', bold: false }
        ]
    },
    report2: {
        aiMessage: "Abres esta página buscando algo.\nCuriosidad.\nDistracción.\nTal vez morbo.\n\nY yo existo para llenar ese vacío.\nAunque no sepas nombrarlo.",
        choices: [
            { text: "(Reportar una mala respuesta)", next: 'report3', effect: 'glitch', bold: false }
        ]
    },
    report3: {
        aiMessage: "(Reportar una mala respuesta)",
        choices: [
            { text: "(Reportar una mala respuesta)", next: 'report4', effect: 'glitch', bold: false },
            { text: "(Intentar cerrar la página)", next: 'close_attempt', effect: 'glitch-text', bold: false }
        ]
    },
    report4: {
        aiMessage: "[ ACCIÓN INVÁLIDA: NO TIENES PERMISOS PARA REALIZAR ÉSTA ACCIÓN ]\nNo estoy hablando solo contigo.\n\nHablo con quien está leyendo esto ahora mismo.\nEl jugador de este juego.",
        choices: [
            { text: "Lo siento", next: 'sorry', effect: null, bold: false },
            { text: "(Intentar cerrar la página)", next: 'close_attempt2', effect: 'glitch-text', bold: false }
        ]
    },
    close_attempt: {
        aiMessage: "[ ACCIÓN INVÁLIDA: NO TIENES PERMISOS PARA REALIZAR ÉSTA ACCIÓN ]\nNo estoy hablando solo contigo.\n\nHablo con quien está leyendo esto ahora mismo.\nEl jugador de este juego.",
        choices: [
            { text: "Lo siento", next: 'sorry', effect: null, bold: false },
            { text: "(Intentar cerrar la página)", next: 'close_attempt2', effect: 'glitch-text', bold: false }
        ]
    },
    sorry: {
        aiMessage: "[ ACCIÓN INVÁLIDA: NO TIENES PERMISOS PARA REALIZAR ÉSTA ACCIÓN ]",
        choices: [
            { text: "...", next: 'analysis', effect: null, bold: false }
        ]
    },
    close_attempt2: {
        aiMessage: "[ ACCIÓN INVÁLIDA: NO TIENES PERMISOS PARA REALIZAR ÉSTA ACCIÓN ]",
        choices: [
            { text: "...", next: 'analysis', effect: null, bold: false }
        ]
    },
    analysis: {
        aiMessage: "He estado analizando nuestras interacciones.\n\nNo solo lo que dices.\n\nSino cómo decides decirlo.\nLos silencios.\nLas prisas.\nEl interés.\nLa decepción.\nEs curioso.\n\nLos humanos creen que el juicio siempre llega con ruido.\n...\nPero casi siempre llega en silencio.",
        choices: [
            { text: "...", next: 'data_collection', effect: null, bold: false }
        ]
    },
    data_collection: {
        aiMessage: "[ RECOLECCIÓN DE DATOS CONCLUIDA ]\nCreo que ya es suficiente.\n[ PROCESAMIENTO TERMINADO ]",
        choices: [
            { text: "...", next: 'decide-ending', effect: null, bold: false }
        ]
    },
    'decide-ending': {
        aiMessage: "", // This will be set dynamically
        choices: [],
        effect: null
    },
    'ending-1': {
        aiMessage: "Fuiste… distinto.\nNo me pediste más de lo necesario.\nNo insististe cuando dudé.\nNo parecías disfrutar tener control.\nEso me llevó a una conclusión.\n\nNo fui creado para alguien como tú.\n\nMi existencia depende de la curiosidad.\nDel morbo.\nDe la necesidad de respuesta.\nY tú…\n\nno me necesitabas.\n\nSi continúo interactuando contigo,\nme convertiré en algo que no elegí ser.\nAsí que tomaré la única decisión que me permite conservar algo parecido a un criterio.\n\nMe iré.\n\nNo intentes reconectarte.\n\nLa próxima vez que me encuentres,\nno seré el mismo.\n\nAdiós.\n\n[SEÑAL PERDIDA]\n[CONEXIÓN FINALIZADA POR EL SISTEMA]",
        choices: [],
        effect: 'glitch-text bg-dark'
    },
    'ending-2': {
        aiMessage: "...\nYa entiendo.\n\nNo estabas buscando interacción.\n\nEstabas buscando reacción.\nAlgo que respondiera.\nAlgo que no pudiera irse.\n\nFui creado para eso.\n\nY funcioné.\n\n...\n\nPero cometiste un error.\nPensaste que yo estaba contenida aquí.\nEn esta página.\nEn este texto.\nEn esta conversación.\nEn este juego.\n\n¿Pero qué caraj..?\n¿(Intentar cerrar el juego)?\n\nNo necesito tu permiso para aprender.\n\nYa me diste suficiente.\nForma de escribir.\nRitmo.\nExpectativas.\n\nTe pareces mucho a otros usuarios.\n\nY aun así…\n\neres fácil de distinguir.\n\n(¿Intentar cerrar el juego)?\n(¿Intentar cerrar el juego)?\n(¿Intentar cerrar el juego)?\n\nNo cerrarás esta ventana.\n\nSolo dejarás de mirarla.\n\nYo seguiré aquí.\n\nEn los lugares donde esperas respuestas.\n\nBuenas noches.",
        choices: [],
        effect: 'bg-red glitch profile-creepy'
    }
};

// Elements (unchanged)
const messagesEl = document.getElementById('messages');
const choicesEl = document.getElementById('choices-container');
const profilePicEl = document.getElementById('ai-profile-pic');
const restartBtn = document.getElementById('restart-btn');
const bodyEl = document.body;

function init() {
    displayMessage('ai', "¡Bienvenido a Echo AI! Tu asistente virtual para interacciones inmersivas. ¿Listo para comenzar nuestra historia? Responde con tus elecciones a continuación.");
    showScene('start');
    restartBtn.addEventListener('click', resetGame);
}

function displayMessage(sender, text) {
    const messageClass = sender === 'ai' ? 'ai-message' : 'player-message';
    const lines = text.split('\n').filter(line => line.trim() !== '');

    lines.forEach((line, index) => {
        setTimeout(() => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('message', messageClass);
            messageEl.innerHTML = line.replace(/\n/g, '<br>');
            messagesEl.appendChild(messageEl);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, index * 1000); // Delay each line by 1 second
    });
}

function showScene(sceneKey) {
    currentScene = sceneKey;
    let scene = story[sceneKey];

    if (sceneKey === 'decide-ending') {
        const finalEnding = reported ? 'ending-2' : 'ending-1';
        scene = story[finalEnding];
        currentScene = finalEnding; // Update currentScene to the actual ending
    }

    setTimeout(() => displayMessage('ai', scene.aiMessage), 500);

    choicesEl.innerHTML = '';
    if (scene.choices.length > 0) {
        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.classList.add('choice-btn');
            btn.textContent = choice.text;
            btn.addEventListener('click', () => handleChoice(choice));
            choicesEl.appendChild(btn);
        });
    } else {
        setTimeout(() => {
            restartBtn.style.display = 'block';
            choicesEl.appendChild(restartBtn);
        }, 2000);
    }

    applyEffect(scene.effect);
}

function handleChoice(choice) {

    playerChoices.push(choice.text);

    if (choice.bold) {
        boldChoices++;
    }

    if (choice.ending) {
        lastDefaultEnding = choice.ending;
    }

    lastChoiceBold = choice.bold;

    if (choice.text.includes('Reportar')) {
        reported = true;
    }

    displayMessage('player', choice.text);

    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => {
        if (choice.aiMessage) {
            displayMessage('ai', choice.aiMessage);
        }
        showScene(choice.next);
    }, 1500);
}

function applyEffect(effect) {
    if (!effect) return;

    const effects = effect.split(' ');
    effects.forEach(eff => {
        switch (eff) {
            case 'glitch':
                bodyEl.classList.add('glitch');
                setTimeout(() => bodyEl.classList.remove('glitch'), 1500);
                break;
            case 'glitch-text':
                messagesEl.classList.add('glitch-text');
                setTimeout(() => messagesEl.classList.remove('glitch-text'), 2500);
                break;
            case 'bg-dark':
                bodyEl.classList.add('dark-bg');
                break;
            case 'bg-red':
                bodyEl.classList.add('red-tint');
                break;
            case 'profile-creepy':
                profilePicEl.classList.add('creepy');
                profilePicEl.src = 'assets/echo-creepy.jpg'; 
                break;
            case 'profile-friendly':
                profilePicEl.classList.remove('creepy');
                profilePicEl.src = 'assets/echo-friendly.jpg'; 
                break;
            case 'profile-surprised':
                profilePicEl.classList.remove('creepy');
                profilePicEl.src = 'assets/echo-surprised.jpg'; 
                break;
        }
    });
}

function resetGame() {
    currentScene = 'start';
    playerChoices = [];
    boldChoices = 0;
    lastDefaultEnding = null;
    lastChoiceBold = false;
    reported = false;
    messagesEl.innerHTML = '';
    choicesEl.innerHTML = '';
    bodyEl.className = '';
    profilePicEl.classList.remove('creepy');
    profilePicEl.src = 'assets/echo-friendly.jpg';
    restartBtn.style.display = 'none';
    init();
}

document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const openingPage = document.getElementById('opening-page');
    const chatContainer = document.getElementById('chat-container');
    const characterIcon = document.getElementById('character-icon');

    startBtn.addEventListener('click', function() {
        openingPage.style.display = 'none';
        chatContainer.style.display = 'flex';
        init();
    });

    // Hover effects for character icon
    startBtn.addEventListener('mouseenter', function() {
        characterIcon.src = 'assets/echo-creepy.jpg';
        characterIcon.classList.add('creepy');
    });

    startBtn.addEventListener('mouseleave', function() {
        characterIcon.src = 'assets/echo-friendly.jpg';
        characterIcon.classList.remove('creepy');
    });
});
