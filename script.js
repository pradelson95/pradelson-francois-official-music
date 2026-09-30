const audioPlayer = document.getElementById('audioPlayer');
const playerBar = document.getElementById('playerBar');
const playerTitle = document.getElementById('playerTitle');
const mainPlayPauseSvg = document.getElementById('mainPlayPauseSvg');
const progressBarBg = document.getElementById('progressBarBg');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');

// Configuración de las pistas musicales
const tracks = [
    {
        title: "Todavía soy yo",
        file: "Todavía_soy_yo.mp3",
        duration: "2:59"
    },
    {
        title: "Ainda Sou Eu",
        file: "Ainda_sou_eu.mp3",
        duration: "3:01"
    },
    {
        title: "Los que nunca se van",
        file: "Los_que_nunca_se_van.mp3",  // <-- NUEVA
        duration: "2:49"
    },
    {
        title: "Eras tú",
        file: "Eras_tuu.mp3",                 // <-- NUEVA
        duration: "3:00"
    },
    {
        title: "Semilla sobre la piedra",
        file: "Semilla_sobre_la_piedra.mp3",  // <-- NUEVA
        duration: "2:46"
    }
];

let currentTrackIndex = 0;

// Iconos vectoriales
const playPath = "M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z";
const pausePath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";

function selectTrack(index) {
    if (currentTrackIndex === index && !audioPlayer.paused) {
        togglePlay();
        return;
    }

    currentTrackIndex = index;
    audioPlayer.src = tracks[index].file;
    playerTitle.textContent = tracks[index].title;
    
    // Actualizar estados visuales de las tarjetas contenedoras
    document.querySelectorAll('.track-item').forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });

    audioPlayer.play().then(() => {
        playerBar.classList.add('visible');
        setIcons(pausePath);
    }).catch(error => {
        console.log("Erro ao reproduzir:", error);
        alert(`Não foi possível reproduzir '${tracks[index].file}'. Verifique se o arquivo está na pasta.`);
    });
}

function togglePlay() {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
        selectTrack(0);
        return;
    }

    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById(`trackItem${currentTrackIndex}`).classList.add('playing');
        playerBar.classList.add('visible');
        setIcons(pausePath);
    } else {
        audioPlayer.pause();
        document.getElementById(`trackItem${currentTrackIndex}`).classList.remove('playing');
        setIcons(playPath);
    }
}

function setIcons(pathValue) {
    mainPlayPauseSvg.querySelector('path').setAttribute('d', pathValue);
    // Actualizar iconos dentro de las tarjetas
    document.querySelectorAll('.overlayPlayIcon path').forEach(path => {
        path.setAttribute('d', pathValue);
    });
}

// Control de apertura de letras por índice de forma independiente
function toggleLyrics(index) {
    const targetPanel = document.getElementById(`lyricsPanel${index}`);
    targetPanel.classList.toggle('open');
}

// Actualizar barra de progreso
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBarBg.value = progressPercent;
        progressBarBg.style.setProperty('--progress', `${progressPercent}%`);
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audioPlayer.duration);
});

progressBarBg.addEventListener('input', () => {
    if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        audioPlayer.currentTime = (Number(progressBarBg.value) / 100) * audioPlayer.duration;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

audioPlayer.addEventListener('ended', () => {
    document.getElementById(`trackItem${currentTrackIndex}`).classList.remove('playing');
    setIcons(playPath);
    progressBarBg.value = 0;
    progressBarBg.style.setProperty('--progress', '0%');
    audioPlayer.currentTime = 0;
});