document.addEventListener('DOMContentLoaded', () => {
    if (typeof events === 'undefined' || typeof translations === 'undefined') {
        const content = document.getElementById('event-details-content');
        if (content) {
            content.innerHTML = `<div class="alert alert-danger">Error: Required data is missing.</div>`;
        }
        console.error("Critical JS files are not loaded.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    const event = events.find(e => e.id === eventId);

    const detailsContent = document.getElementById('event-details-content');
    const notFoundMessage = document.getElementById('event-not-found');

    if (!event) {
        if (detailsContent) detailsContent.style.display = 'none';
        if (notFoundMessage) notFoundMessage.style.display = 'block';
        return;
    }

    function renderEventDetails(lang) {
        const language = lang || 'en';
        document.getElementById('event-title').textContent = event.title[language] || event.title.en;
        document.getElementById('event-description').textContent = event.description[language] || event.description.en;
        document.getElementById('event-category-display').textContent = event.category[language] || event.category.en;
        document.getElementById('event-location-display').textContent = event.location[language] || event.location.en;
        document.getElementById('event-price-display').textContent = event.price[language] || event.price.en;
        if(event.ticketsLink) document.getElementById('book-tickets-btn').href = event.ticketsLink;
        if(event.promoLink) document.getElementById('watch-promo-btn').href = event.promoLink;
        document.getElementById('event-about-text1').textContent = event.aboutText1[language] || event.aboutText1.en;
        document.getElementById('event-about-text2').textContent = event.aboutText2[language] || event.aboutText2.en;
        document.getElementById('event-date-display').textContent = new Date(event.date).toLocaleDateString();
    }

    renderEventDetails(localStorage.getItem('lang') || 'en');

    document.addEventListener('languageChanged', () => {
        renderEventDetails(localStorage.getItem('lang') || 'en');
    });

    initializeMapPlaceholder(event);

    function initializeMapPlaceholder(event) {
        if (!event.latitude || !event.longitude) return;


        const map = L.map('map').setView([event.latitude, event.longitude], 13);


        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

       
        L.marker([event.latitude, event.longitude])
            .addTo(map)
            .bindPopup(event.title[localStorage.getItem('lang')] || event.title.en)
            .openPopup();
    }
});

