const video = document.getElementById('miVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const barraProgreso = document.getElementById('barraProgreso');
const barraContenedor = document.getElementById('barraContenedor');
const tiempoTexto = document.getElementById('tiempoTexto'); // Nuevo elemento

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