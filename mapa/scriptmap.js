let isDragging = false;
let startX, startY, imageX = 0, imageY = 0, scale = 1;
const modal = document.getElementById("mapModal");
const modalImage = document.getElementById("modalImage");

// Función para mostrar el mapa
function showMap(imageSrc) {
    modal.style.display = "flex";
    modalImage.src = imageSrc;
    imageX = 0;
    imageY = 0;
    scale = 1; // Restablecemos el zoom cuando se abre una nueva imagen
    updateTransform();
}

// Función para cerrar el modal
function closeMap() {
    modal.style.display = "none";
}

// Función para actualizar la posición de la imagen en el modal
function updateTransform() {
    modalImage.style.transform = `translate(${imageX}px, ${imageY}px) scale(${scale})`;
}

// Función que se activa cuando se hace clic sobre la imagen y se mantiene presionado
modalImage.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        isDragging = true;
        startX = event.clientX - imageX;
        startY = event.clientY - imageY;
        modalImage.style.cursor = "grabbing";
    }
});

// Evento de movimiento del mouse
window.addEventListener("mousemove", function (event) {
    if (!isDragging) return;
    imageX = event.clientX - startX;
    imageY = event.clientY - startY;
    updateTransform();
});

// Evento cuando se suelta el clic del mouse
window.addEventListener("mouseup", function () {
    isDragging = false;
    modalImage.style.cursor = "grab";
});

// Soporte para dispositivos táctiles
modalImage.addEventListener("touchstart", function (event) {
    if (event.touches.length === 1) {
        isDragging = true;
        startX = event.touches[0].clientX - imageX;
        startY = event.touches[0].clientY - imageY;
    }
});

modalImage.addEventListener("touchmove", function (event) {
    if (event.touches.length === 1 && isDragging) {
        imageX = event.touches[0].clientX - startX;
        imageY = event.touches[0].clientY - startY;
        updateTransform();
    }
});

window.addEventListener("touchend", function () {
    isDragging = false;
});

// Función para hacer zoom con la rueda del mouse
modalImage.addEventListener("wheel", function (event) {
    event.preventDefault(); // Prevenir el desplazamiento de la página

    // Detectamos el cambio en la rueda del mouse (acercar o alejar)
    if (event.deltaY < 0) {
        scale = Math.min(scale + 0.1, 10); // Zoom máximo a 3x
    } else {
        scale = Math.max(scale - 0.1, 1); // Zoom mínimo a 1x
    }

    updateTransform();
});

// Función para descargar la imagen
document.getElementById("downloadBtn").addEventListener("click", function() {
    const imageSrc = modalImage.src;
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'imagen.jpg'; // Nombre por defecto para la descarga
    link.click();
});

// Función para compartir la imagen
document.getElementById("shareBtn").addEventListener("click", function() {
    const imageSrc = modalImage.src;

    if (navigator.share) {
        navigator.share({
            title: 'Mira esta imagen',
            text: 'Echa un vistazo a esta increíble imagen.',
            url: imageSrc,
        })
        .then(() => console.log('Imagen compartida'))
        .catch((error) => console.error('Error al compartir:', error));
    } else {
        alert('Tu navegador no soporta la API de compartir.');
    }
});
