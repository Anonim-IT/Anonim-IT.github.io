document.addEventListener("DOMContentLoaded", function () {
    loadNavbar(); // Загружаем навигационную панель
});

// Функция загрузки навигационной панели
function loadNavbar() {
    fetch('minecraft/navbar/navbarminecraft.html')
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
            return response.text();
        })
        .then(html => {
            const navbarElement = document.getElementById("navbar");
            if (navbarElement) {
                navbarElement.innerHTML = html;
            } else {
                console.error("Элемент #navbar не найден!");
            }
        })
        .catch(error => console.error('Ошибка загрузки меню:', error));
}

// Обработчик формы для добавления в вайтлист Minecraft Hack
document.getElementById("hackWhitelistForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Функция для защиты от XSS
    function sanitize(input) {
        return input.replace(/[<>]/g, "");
    }

    // Сбор данных из формы
    const nickname = sanitize(document.getElementById("nickname").value.trim());
    const contact = sanitize(document.getElementById("contact").value.trim());
    const license = sanitize(document.getElementById("license").value);
    const rulesAgreement = document.getElementById("rules").checked;
    const notGrieferAgreement = document.getElementById("notGriefer").checked;

    // Верификация данных
    if (!nickname || !contact || !license || !rulesAgreement || !notGrieferAgreement) {
        document.getElementById("status").innerText = "⚠️ Введены неполные данные! Допуск запрещён.";
        return;
    }

    // Отправка сообщения о статусе обработки
    document.getElementById("status").innerText = "⏳ Обработка заявки...";

    // Формируем сообщение для отправки в Telegram
    const message = `🔴 **Заявка на вступление в Minecraft Hack** 🔴\n\n` +
        `🔹 **Никнейм:** ${nickname}\n` +
        `🔹 **Контакт:** ${contact}\n` +
        `🔹 **Лицензия Minecraft:** ${license === "yes" ? "Есть" : "Нет"}\n` +
        `🔹 **Подтверждение правил:** ${rulesAgreement ? "Да" : "Нет"}\n` +
        `🔹 **Не грифер:** ${notGrieferAgreement ? "Да" : "Нет"}`;

    // Telegram-бот
    const botToken = "7522327980:AAGFjRSjva2toXVOUY7mPNC3X2mGoY8QBis"; // Укажи свой токен
    const chatIds = ["250356592", "5206122340"]; // Список чатов, куда отправляем

    // Отправка данных в Telegram
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
                document.getElementById("status").innerText = "✅ Ваша заявка успешно отправлена!";
            } else {
                document.getElementById("status").innerText = "❌ Ошибка обработки заявки!";
            }
        })
        .catch(() => {
            document.getElementById("status").innerText = "🚫 Ошибка связи с сервером!";
        });
    });
});
