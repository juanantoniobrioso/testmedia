const video = document.getElementById('miVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const barraProgreso = document.getElementById('barraProgreso');
const barraContenedor = document.getElementById('barraContenedor');
const tiempoTexto = document.getElementById('tiempoTexto'); // Nuevo elemento
const volumenSlider = document.getElementById('volumenSlider');
const btnMute = document.getElementById('btnMute');
const videoPlayer = document.getElementById('videoPlayer');
const btnFullScreen = document.getElementById('btnFullScreen');

// --- FUNCIÓN HELPER: Convierte segundos a formato MM:SS ---
function formatearTiempo(segundos) {
    if (!segundos || isNaN(segundos)) return "00:00";
    
    // Calculamos minutos y segundos
    const minutos = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    
    // Agregamos un '0' delante si es menor a 10 (ej: 9 -> 09)
    const m = minutos < 10 ? '0' + minutos : minutos;
    const s = segs < 10 ? '0' + segs : segs;
    
    return `${m}:${s}`;
}

// --- LOGICA DE PLAY / PAUSE ---
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = '⏸';
    } else {
        video.pause();
        playPauseBtn.textContent = '▶';
    }
});

video.addEventListener('pause', () => playPauseBtn.textContent = '▶');
video.addEventListener('play', () => playPauseBtn.textContent = '⏸');

// --- BARRA DE PROGRESO Y TIEMPO (Core) ---
video.addEventListener('timeupdate', () => {
    // 1. Actualizar la barra visual
    const porcentaje = (video.currentTime / video.duration) * 100 || 0;
    barraProgreso.style.width = porcentaje + '%';

    // 2. Actualizar el texto del tiempo (Nuevo)
    const tiempoActual = formatearTiempo(video.currentTime);
    const duracionTotal = formatearTiempo(video.duration);
    
    tiempoTexto.textContent = `${tiempoActual} / ${duracionTotal}`;
});

// --- INTERACTIVIDAD DE LA BARRA (Clic) ---
barraContenedor.addEventListener('click', (e) => {
    const anchoTotal = barraContenedor.offsetWidth;
    const posicionClick = e.offsetX;
    const nuevoTiempo = (posicionClick / anchoTotal) * video.duration;
    
    video.currentTime = nuevoTiempo;
});

// --- EXTRA: Cargar la duración total antes de dar Play ---
// A veces la duración sale NaN al principio hasta que carga los metadatos
video.addEventListener('loadedmetadata', () => {
    tiempoTexto.textContent = `00:00 / ${formatearTiempo(video.duration)}`;
});

volumenSlider.addEventListener('input', (e) => {
    // e.target.value es el valor del input (entre 0 y 1)
    video.volume = e.target.value;
    if (valor == 0) {
        btnMute.textContent = '🔇';
    } else {
        btnMute.textContent = '🔊';
        // Si el usuario mueve la barra, actualizamos la "memoria"
        ultimoVolumen = valor; 
    }
});

let ultimoVolumen = 0.5;

btnMute.addEventListener('click', () => {
    if(video.volume > 0){
        ultimoVolumen = video.volume;
        video.volume = 0;
        volumenSlider.value = 0;
        btnMute.textContent = '🔇';
    }else{
        video.volume = ultimoVolumen || 1;
        volumenSlider.value = video.volume;
        btnMute.textContent = '🔊';
    }
})


//Pantalla completa
/*
btnFullScreen.addEventListener('click', () => {
    if(!document.fullscreenElement){
        if(video.requestFullscreen){
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { // Firefox
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { // Chrome, Safari, Opera
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE/Edge
            video.msRequestFullscreen();
        }
    } else {
        if(document.exitFullscreen){
            document.exitFullscreen();
        } else if(document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        }
    }
    
})
    */
btnFullscreen.addEventListener('click', async () => {
    // 1. Verificamos si el elemento existe
    if (!videoPlayer) {
        alert("ERROR: No encuentro el elemento con id 'videoPlayer' en el HTML");
        return;
    }

    try {
        // Detectamos si ya estamos en pantalla completa (soporte para varios navegadores)
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

        if (!isFullscreen) {
            // --- INTENTAR ENTRAR ---
            if (videoPlayer.requestFullscreen) {
                await videoPlayer.requestFullscreen();
            } else if (videoPlayer.webkitRequestFullscreen) { /* Safari / Chrome antiguos */
                await videoPlayer.webkitRequestFullscreen();
            } else if (videoPlayer.msRequestFullscreen) { /* IE / Edge antiguos */
                await videoPlayer.msRequestFullscreen();
            } else {
                alert("Tu navegador no soporta la API de Fullscreen estándar.");
            }
        } else {
            // --- INTENTAR SALIR ---
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        }
    } catch (error) {
        // Esto nos dirá si el navegador bloqueó la acción
        console.error(error);
        alert("ERROR TÉCNICO: " + error.message);
    }
});