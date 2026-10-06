// Crear el mapa desde el inicio (vista mundial mientras se obtiene la ubicación)
const map = L.map('map').setView([20, 0], 2);

// Mapa base de OpenStreetMap (gratuito, sin API key)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Marcador personalizado
const pinIcon = L.divIcon({
    className: '',
    html: '<div class="pin"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14]
});

// Aviso en pantalla (reemplaza al alert)
const aviso = document.createElement('div');
aviso.className = 'aviso';
aviso.setAttribute('role', 'status');
aviso.textContent = 'Buscando tu ubicación…';
document.getElementById('map').before(aviso);

navigator.geolocation.getCurrentPosition(
    function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const precision = position.coords.accuracy;

        // Círculo con la precisión aproximada
        L.circle([lat, lon], {
            radius: precision,
            color: '#0b4d47',
            weight: 1,
            fillColor: '#0b4d47',
            fillOpacity: 0.12
        }).addTo(map);

        // Marcador con popup
        L.marker([lat, lon], { icon: pinIcon })
            .addTo(map)
            .bindPopup(
                `<strong>Tu ubicación aproximada</strong><br>
                Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`
            )
            .openPopup();

        map.setView([lat, lon], 17);

        aviso.textContent = `Ubicación encontrada (precisión de ~${Math.round(precision)} m)`;
    },

    function (error) {
        aviso.classList.add('error');
        aviso.textContent = 'No se pudo obtener tu ubicación: ' + error.message;
    },

    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
);