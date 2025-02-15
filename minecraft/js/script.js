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

    // Токен бота и ID чатов
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Замени на свой токен
    const chatIds = ["250356592", "5206122340"]; // Добавь новый ID чата

    const message = `🔥 Новая заявка в Whitelist!\n\n👤 Ник: ${nickname}\n🔗 Как нашел: ${source}\n💬 Отношение к серверам: ${opinion}\n🎯 Планы на сервере: ${plans}`;

    // Отправка сообщения в оба чата
    chatIds.forEach(chatId => {
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
