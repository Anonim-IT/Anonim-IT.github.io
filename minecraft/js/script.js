document.addEventListener("DOMContentLoaded", function () {
    loadNavbar();
});

// Обработчик отправки формы
document.getElementById("whitelistForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Функция для очистки ввода от XSS
    function sanitize(input) {
        return input.replace(/[<>]/g, "");
    }

    // Получаем данные из формы
    const nickname = sanitize(document.getElementById("nickname").value.trim());
    const age = sanitize(document.getElementById("age").value.trim());
    const contact = sanitize(document.getElementById("contact").value.trim());
    const source = sanitize(document.getElementById("source").value.trim());
    const experience = sanitize(document.getElementById("experience").value.trim());
    const rp = sanitize(document.getElementById("rp").value);
    const plans = sanitize(document.getElementById("plans").value.trim());
    const time = sanitize(document.getElementById("time").value.trim());
    const horror = sanitize(document.getElementById("horror").value.trim());
    const fears = sanitize(document.getElementById("fears").value.trim());
    const health = sanitize(document.getElementById("health").value.trim());
    const playstyle = sanitize(document.getElementById("playstyle").value);
    const cheatsChecked = document.getElementById("cheats").checked;
    const responsibilityChecked = document.getElementById("responsibility").checked;

    // Проверка заполненности всех полей
    if (!nickname || !age || !source || !experience || !plans || !time || !horror || !fears || !health || !responsibilityChecked) {
        document.getElementById("status").innerText = "⚠️ Заполните все обязательные поля!";
        return;
    }

    // Проверка возраста
    if (age < 18) {
        document.getElementById("status").innerText = "⛔ Вам должно быть 18 лет или больше!";
        return;
    }

    // Проверка честности игрока
    if (!cheatsChecked) {
        document.getElementById("status").innerText = "⚠️ Вы должны подтвердить, что не будете использовать читы!";
        return;
    }

    document.getElementById("status").innerText = "⏳ Отправка заявки...";

    // Telegram-бот
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Твой токен
    const chatIds = ["250356592", "5206122340"]; // ID чатов

    const message = `🔥 *Новая заявка на Whitelist!*\n\n` +
        `👤 *Ник:* ${nickname}\n` +
        `🎂 *Возраст:* ${age}\n` +
        `📞 *Контакты:* ${contact || "Не указано"}\n` +
        `🔗 *Как нашёл сервер:* ${source}\n` +
        `🎮 *Опыт в хоррор/хардкор-играх:* ${experience}\n` +
        `🎭 *RP:* ${rp}\n` +
        `🎯 *Планы на сервере:* ${plans}\n` +
        `🕒 *Время в неделю:* ${time}\n` +
        `👻 *Отношение к хоррору:* ${horror}\n` +
        `⚠️ *Страхи:* ${fears}\n` +
        `🏥 *Здоровье:* ${health}\n` +
        `🎮 *Стиль игры:* ${playstyle}\n` +
        `✅ *Честная игра:* Подтверждено\n` +
        `⚠️ *Ответственность:* Принята`;

    // Отправка в Telegram
    chatIds.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                document.getElementById("status").innerText = "✅ Заявка успешно отправлена!";
            } else {
                document.getElementById("status").innerText = "❌ Ошибка отправки!";
            }
        })
        .catch(() => {
            document.getElementById("status").innerText = "🚫 Ошибка соединения с Telegram!";
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
