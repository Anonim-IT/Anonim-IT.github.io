document.addEventListener("DOMContentLoaded", function () {
    const eventTitle = document.getElementById("event-title");
    const eventDate = document.getElementById("event-date");
    const eventDescription = document.getElementById("event-description");
    const addEventBtn = document.getElementById("add-event-btn");
    const eventsContainer = document.getElementById("events-container");

    // Функция загрузки мероприятий из localStorage
    function loadEvents() {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        eventsContainer.innerHTML = ""; // Очищаем контейнер перед загрузкой

        events.forEach((event, index) => {
            const eventElement = document.createElement("div");
            eventElement.classList.add("event-item");

            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Дата:</strong> ${event.date}</p>
                <p>${event.description}</p>
                <button class="delete-event" data-index="${index}">🗑 Удалить</button>
            `;

            // Обработчик удаления мероприятия
            eventElement.querySelector(".delete-event").addEventListener("click", function () {
                deleteEvent(index);
            });

            eventsContainer.appendChild(eventElement);
        });
    }

    // Функция добавления мероприятия
    function addEvent() {
        const title = eventTitle.value.trim();
        const date = eventDate.value;
        const description = eventDescription.value.trim();

        if (title === "" || date === "" || description === "") {
            alert("Заполните все поля!");
            return;
        }

        const events = JSON.parse(localStorage.getItem("events")) || [];
        events.push({ title, date, description });
        localStorage.setItem("events", JSON.stringify(events));

        // Очистка полей
        eventTitle.value = "";
        eventDate.value = "";
        eventDescription.value = "";

        loadEvents(); // Обновляем список мероприятий
    }

    // Функция удаления мероприятия
    function deleteEvent(index) {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        events.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(events));
        loadEvents();
    }

    // Обработчик кнопки добавления
    addEventBtn.addEventListener("click", addEvent);

    // Загружаем мероприятия при загрузке страницы
    loadEvents();
});
