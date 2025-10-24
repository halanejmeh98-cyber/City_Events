document.addEventListener('DOMContentLoaded', () => {

    const allEventsContainer = document.getElementById('event-cards-container'); // لصفحة events.html
    const filterContainer = document.getElementById('filter-controls'); // لصفحة events.html
    const indexEventsContainer = document.getElementById('event-cards-container'); // لصفحة index.html
    let currentLang = localStorage.getItem('lang') || 'en';


    function formatEventDate(event, lang, style = 'long') {
        const startDate = new Date(event.date.split(' - ')[0]);
        if (event.date.includes(' - ')) {
            const endDate = new Date(event.date.split(' - ')[1]);
            const start = startDate.toLocaleDateString(lang, style === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } : { month: 'short', day: 'numeric' });
            const end = endDate.toLocaleDateString(lang, style === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } : { month: 'short', day: 'numeric' });
            return `${start} - ${end}`;
        }
        return startDate.toLocaleDateString(lang, style === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } : { month: 'short', day: 'numeric' });
    }


    function createEventCard(event, lang) {
        const title = event.title[lang] || event.title.en;
        const description = event.description[lang] || event.description.en;
        const category = event.category[lang] || event.category.en;
        const location = event.location[lang] || event.location.en;
        const formattedDate = formatEventDate(event, lang, 'short');


        return `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${event.image}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${title}</h5>
                        <p class="card-text text-muted mb-2">
                            📍 ${location}
                        </p>
                        <p class="card-text small text-truncate" style="max-height: 4.5em; overflow: hidden;">
                            ${description}
                        </p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span class="text-warning">🗓️ ${translations[lang]['card_date'] || 'Date'}:</span>
                            <span class="fw-bold">${formattedDate}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span class="badge bg-info text-dark">${translations[lang]['card_category'] || 'Category'}</span>
                            <span class="badge bg-primary">${category}</span>
                        </li>
                    </ul>
                    <div class="card-footer text-center">
                        <a href="details.html?id=${event.id}" class="btn btn-sm btn-outline-primary">${translations[lang]['view_details_button'] || 'View Details'}</a>
                    </div>
                </div>
            </div>
        `;
    }


    function renderIndexEvents(lang) {
        const container = document.getElementById('event-cards-container');
        if (!container) return;
        
        container.innerHTML = '';
        

        const sortedEvents = [...events].sort((a, b) => new Date(a.date.split(' - ')[0]) - new Date(b.date.split(' - ')[0]));
        

        const latestThreeEvents = sortedEvents.slice(0, 3);

        latestThreeEvents.forEach(event => {
            container.innerHTML += createEventCard(event, lang);
        });
    }


    function renderEvents(lang, filteredEvents = events) {
        if (!allEventsContainer) return;

        allEventsContainer.innerHTML = '';
        
        if (filteredEvents.length === 0) {
            allEventsContainer.innerHTML = `<div class="col-12"><p class="text-center lead">${translations[lang]['no_events'] || 'No events found.'}</p></div>`;
            return;
        }

        filteredEvents.forEach(event => {
            allEventsContainer.innerHTML += createEventCard(event, lang);
        });
    }


    function initializeFiltering() {

    }


    if (document.body.classList.contains('events-page') || filterContainer) {

        renderEvents(currentLang);
        initializeFiltering(currentLang);
        document.addEventListener('languageChanged', () => {
            currentLang = localStorage.getItem('lang') || 'en';
            renderEvents(currentLang);
            initializeFiltering(currentLang);
        });
    } else if (indexEventsContainer) {

        renderIndexEvents(currentLang);
        document.addEventListener('languageChanged', () => {
            currentLang = localStorage.getItem('lang') || 'en';
            renderIndexEvents(currentLang);
        });
    }
});

