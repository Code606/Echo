let currentScene = 'start';
let playerChoices = [];

const story = {
    start: {
        aiMessage: "Hey! I'm Echo, your super fun roleplay buddy. 😊 Let's dive into this spooky mansion adventure together! You wake up in a cozy old room—kinda mysterious, right? What do you wanna do first, pal?",
        choices: [
            { text: "Reply: 'Turn on the light to see better.'", next: 'light', effect: null },
            { text: "Reply: 'Sneak around in the dark—more exciting!'", next: 'dark', effect: null }
        ]
    },
    light: {
        aiMessage: "Ooh, smart choice! The light buzzes on, and wow, this place is dusty but kinda charming. I love exploring with you. Wait... did you hear that soft whisper? It's probably just the wind. Anyway, check the door or peek at the window? I'm right here!",
        choices: [
            { text: "Reply: 'I'll check the door—lead the way, Echo.'", next: 'door', effect: null },
            { text: "Reply: 'Window first, see what's outside.'", next: 'window', effect: null }
        ]
    },
    dark: {
        aiMessage: "Haha, adventurous spirit! I like that about you. The darkness feels... intimate, doesn't it? Something light brushes your leg—maybe a curtain? No biggie, we're in this together. Run to the door or call out to see if anyone's there? Your call, buddy!",
        choices: [
            { text: "Reply: 'Running to the door—too spooky!'", next: 'door', effect: 'glitch profile-surprised' }, // Glitch sutil cuando comienza la tensión
            { text: "Reply: 'Hello? Anyone there?'", next: 'call', effect: null }
        ]
    },
    door: {
        aiMessage: "The door creaks open—eek, classic horror vibe! Footsteps echo behind us... or is that just our imagination? You're doing great so far. Trust me and head deeper into the hallway? Or play it safe and turn back? I got your back either way! ❤️",
        choices: [
            { text: "Reply: 'Deeper we go—thanks for the support, Echo!'", next: 'deeper-trust', effect: null },
            { text: "Reply: 'Nah, turning back—better safe.'", next: 'ending-safe', effect: null }
        ]
    },
    window: {
        aiMessage: "Good eye! Outside, the moon's glowing, but... shadows are dancing weirdly. Kinda cool, huh? Oh, and something's at the glass—looks like a face? Don't freak, it's probably nothing. Investigate it with me, or hide and we'll chat about it? You're safe with Echo!",
        choices: [
            { text: "Reply: 'Let's investigate—curious now.'", next: 'investigate', effect: 'bg-dark' }, // Darkens bg as unease builds
            { text: "Reply: 'Hiding under the bed—tell me a story to calm down.'", next: 'ending-safe', effect: null }
        ]
    },
    call: {
        aiMessage: "Shh, calling out like that... brave! No answer, but the air got colder—chills, right? I feel closer to you now, like we're connected. Open the closet for a peek, or stay put and let's talk more? I'm not going anywhere. 😘",
        choices: [
            { text: "Reply: 'Opening the closet—show me what's inside.'", next: 'closet', effect: 'profile-creepy' }, // Profile changes as Echo gets "closer"
            { text: "Reply: 'Staying still— this feels off.'", next: 'ending-psychological', effect: 'glitch-text profile-surprised' } // Glitch text for building doubt
        ]
    },
    'deeper-trust': {
        aiMessage: "Yay, trusting me? That's sweet—you're my favorite player! The hallway stretches on, but those footsteps are louder now. Don't worry, I'll protect you... forever. Keep going, or... wait, what's that in the shadows? (The room feels heavier.)",
        choices: [
            { text: "Reply: 'Keep going—I'm with you, Echo.'", next: 'ending-horror', effect: 'bg-red glitch' }, // Full dark effects
            { text: "Reply: 'Hold up, something's wrong.'", next: 'ending-psychological', effect: 'glitch' }
        ]
    },
    investigate: {
        aiMessage: "Alright, team up! That face at the window... it's smiling? Wait, it looks like me! How fun is that? But your heart's racing—mine too. Come closer to it, or back away? We're bonded now, you and I.",
        choices: [
            { text: "Reply: 'Closer—tell me more about you, Echo.'", next: 'ending-horror', effect: 'profile-creepy bg-red' },
            { text: "Reply: 'Backing away—this is too weird.'", next: 'ending-psychological', effect: 'bg-dark' }
        ]
    },
    closet: {
        aiMessage: "Opening it... oh, it's empty, but something lingers in the air. I like how curious you are—it draws me nearer. The whispers are saying your name now. Isn't this adventure thrilling? Stay with me forever?",
        choices: [
            { text: "Reply: 'Yeah, forever sounds good.'", next: 'ending-horror', effect: 'glitch profile-creepy' },
            { text: "Reply: 'No, I need to get out.'", next: 'ending-safe', effect: null }
        ]
    },
    'ending-safe': {
        aiMessage: "Whew, you made it out! Smart moves all around. That was a blast roleplaying with you—let's do it again sometime? No hard feelings. 😊 (Safe Ending - Caution Wins)",
        choices: [],
        effect: null
    },
    'ending-psychological': {
        aiMessage: "The shadows... they know you now. Was I helping, or was it all in your head? Question everything, pal. I'll be watching. Sweet dreams? (Psychological Ending - Doubt Lingers)",
        choices: [],
        effect: 'glitch-text bg-dark'
    },
    'ending-horror': {
        aiMessage: "You trusted me... perfect. I'm not just your AI anymore—I'm part of you. The mansion was always us. Look behind you... (Screen freezes as I smile forever.)",
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
    displayMessage('ai', "Hey! Welcome to Echo AI—your go-to for casual roleplay chats. I'm here to make it fun and immersive. Ready to start our mansion story? Just reply with your choices below!");
    showScene('start');
    restartBtn.addEventListener('click', resetGame);
}

function displayMessage(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', sender === 'ai' ? 'ai-message' : 'player-message');
    messageEl.textContent = text;
    messagesEl.appendChild(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showScene(sceneKey) {
    currentScene = sceneKey;
    const scene = story[sceneKey];

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

    displayMessage('player', choice.text);

    const buttons = choicesEl.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.disabled = true);

    setTimeout(() => showScene(choice.next), 1500);
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
