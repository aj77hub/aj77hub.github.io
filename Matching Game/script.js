const soundMapping = {
    "Alef": "sounds/alef.mp3",
    "Bet": "sounds/bet.mp3",
    "Gimel": "sounds/gimel.mp3",
    "Dalet": "sounds/dalet.mp3",
};

let remainingNames = Object.keys(soundMapping);
let correctCount = 0;
let incorrectCount = 0;
let timer = 0;
let interval;
let volume = 1; // Default volume
let isMusicMuted = false; // Background music mute state
let isVolumeMuted = false; // Volume mute state

const playButton = document.getElementById('playButton');
const resetButton = document.getElementById('resetButton');
const gameDiv = document.getElementById('game');
const nameDisplay = document.getElementById('nameDisplay');
const images = document.querySelectorAll('.playerImage');
const correctCountDisplay = document.getElementById('correctCount');
const incorrectCountDisplay = document.getElementById('incorrectCount');
const timerDisplay = document.getElementById('timer');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const gameOverDiv = document.getElementById('gameOver');
const volumeControl = document.getElementById('volumeControl');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggleButton = document.getElementById('musicToggleButton');
const volumeToggleButton = document.getElementById('volumeToggleButton');
const musicIcon = document.getElementById('musicIcon');
const volumeIcon = document.getElementById('volumeIcon');

playButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
images.forEach(img => img.addEventListener('click', checkAnswer));
volumeControl.addEventListener('input', updateVolume);
musicToggleButton.addEventListener('click', toggleMusic);
volumeToggleButton.addEventListener('click', toggleVolume);

function startGame() {
    playButton.classList.add('hidden');
    gameDiv.classList.remove('hidden');
    resetButton.classList.remove('hidden');
    correctCount = 0;
    incorrectCount = 0;
    timer = 0;
    remainingNames = Object.keys(soundMapping);
    correctCountDisplay.textContent = correctCount;
    incorrectCountDisplay.textContent = incorrectCount;

    updateTimerDisplay();
    displayNextName();
    interval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);

    // Start background music
    backgroundMusic.volume = volume;
    backgroundMusic.play();
}

function resetGame() {
    clearInterval(interval);
    playButton.classList.remove('hidden');
    gameDiv.classList.add('hidden');
    resetButton.classList.add('hidden');
    correctCountDisplay.textContent = '0';
    incorrectCountDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';

    // Pause background music
    backgroundMusic.pause();
}

function displayNextName() {
    if (remainingNames.length === 0) {
        clearInterval(interval);
        gameOverDiv.style.display = 'block';
        return;
    }
    const randomIndex = Math.floor(Math.random() * remainingNames.length);
    const currentName = remainingNames[randomIndex];

    nameDisplay.textContent = currentName;

    // Play the sound for the current name
    const soundFile = soundMapping[currentName];
    if (soundFile) {
        const audio = new Audio(soundFile);
        audio.volume = isVolumeMuted ? 0 : volume;
        audio.play();
    }
}

function checkAnswer(event) {
    const selectedName = event.target.dataset.name;
    const currentName = nameDisplay.textContent;

    if (selectedName === currentName) {
        correctCount++;
        correctCountDisplay.textContent = correctCount;
        remainingNames = remainingNames.filter(name => name !== currentName);
        displayNextName();
        correctSound.volume = isVolumeMuted ? 0 : volume;
        correctSound.play();

        // Show the firework GIF
        const fireworkContainer = document.getElementById('fireworkContainer');
        fireworkContainer.classList.remove('hidden2');

        // Hide the firework GIF after 2 seconds
        setTimeout(() => {
            fireworkContainer.classList.add('hidden2');
        }, 2000);
    } else {
        incorrectCount++;
        incorrectCountDisplay.textContent = incorrectCount;
        incorrectSound.volume = isVolumeMuted ? 0 : volume;
        incorrectSound.play();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

function updateVolume(event) {
    volume = parseFloat(event.target.value); // Update volume based on slider value
    if (!isVolumeMuted) {
        backgroundMusic.volume = volume;
    }
    // Update volume for sounds
    correctSound.volume = volume;
    incorrectSound.volume = volume;
}

function toggleMusic() {
    isMusicMuted = !isMusicMuted;
    if (isMusicMuted) {
        backgroundMusic.pause();
        musicIcon.src = 'icons/music-off.png'; // Change to mute icon
    } else {
        backgroundMusic.play();
        musicIcon.src = 'icons/music-on.png'; // Change to unmute icon
    }
}

function toggleVolume() {
    isVolumeMuted = !isVolumeMuted;
    volumeIcon.src = isVolumeMuted ? 'icons/volume-off.png' : 'icons/volume-on.png';
    if (isVolumeMuted) {
        backgroundMusic.volume = 0;
    } else {
        backgroundMusic.volume = volume;
    }
    // Update volume for sounds
    correctSound.volume = isVolumeMuted ? 0 : volume;
    incorrectSound.volume = isVolumeMuted ? 0 : volume;
}
