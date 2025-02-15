document.addEventListener("DOMContentLoaded", function () {
    loadNavbar();
});

// Обработчик для отправки формы whitelistForm
document.getElementById("whitelistForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const source = document.getElementById("source").value.trim();
    const opinion = document.getElementById("opinion").value.trim();
    const plans = document.getElementById("plans").value.trim();

    if (!nickname || !source || !opinion || !plans) {
        document.getElementById("status").innerText = "Заполните все поля!";
        return;
    }

    document.getElementById("status").innerText = "Отправка запроса...";

    // Токен бота и ID чата храним в безопасном месте!
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Замени на свой токен
    const chatId = "250356592"; // Замени на свой ID

    const message = `🔥 Новая заявка в Whitelist!\n\n👤 Ник: ${nickname}\n🔗 Как нашел: ${source}\n💬 Отношение к серверам: ${opinion}\n🎯 Планы на сервере: ${plans}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            document.getElementById("status").innerText = "Заявка отправлена!";
        } else {
            document.getElementById("status").innerText = "Ошибка отправки!";
        }
    })
    .catch(error => {
        document.getElementById("status").innerText = "Ошибка соединения!";
    });
});

// Обработчик для отправки формы appeal-form
document.getElementById('appeal-form')?.addEventListener('submit', function(event) {
    event.preventDefault();  // Предотвращаем стандартное поведение формы

    // Получаем данные формы
    const formData = new FormData(this);

    // Преобразуем данные формы в формат JSON
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Создаем сообщение для отправки в Telegram
    const message = `
        New Appeal Submission:
        Username: ${formObject.username}
        Telegram Nick: ${formObject['telegram-nick']}
        Reason for Appeal: ${formObject['appeal-reason']}
        Evidence: ${formObject.evidence ? 'Provided' : 'Not provided'}
    `;

    // URL для отправки запроса в Telegram API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Отправляем данные в Telegram
    fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Your appeal has been submitted successfully!');
        } else {
            alert('There was an error submitting your appeal.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting appeal.');
    });
});

// Загрузка навигационной панели
function loadNavbar() {
    fetch('minecraft/navbar/navbarminecraft.html')
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
            return response.text();
        })
        .then(html => {
            const navbarElement = document.getElementById('navbar');
            if (navbarElement) {
                navbarElement.innerHTML = html;
            } else {
                console.error("Элемент #navbar не найден!");
            }
        })
        .catch(error => console.error('Ошибка загрузки меню:', error));
}
