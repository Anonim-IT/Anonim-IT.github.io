document.getElementById("tg-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const botToken = "7615760216:AAH5EWMMF-_QMGWNTUfGLCCHwrZsd0AJTM0";
    const chatId = "250356592";

    const name = document.getElementById("name").value;
    const isBetaTest = document.getElementById("beta-test").checked;
    const email = isBetaTest ? "Бета-тест (не требуется)" : document.getElementById("email").value;
    const telegram = document.getElementById("telegram").value || "Не указан";
    const topic = document.getElementById("topic").value;
    const message = isBetaTest ? "Бета-тест (не требуется)" : document.getElementById("message").value;
    const file = document.getElementById("file").files[0];

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // Проверка: если тема не "Тестирование формы", то сообщение должно быть заполнено (кроме бета-теста)
    if (!isBetaTest && topic !== "Тестирование формы" && message.trim() === "") {
        alert("⚠ Пожалуйста, напишите сообщение перед отправкой!");
        return;
    }

    // Список запрещенных расширений
    const blockedExtensions = [
        "exe", "bat", "cmd", "sh", "vbs", "js", "ps1", "scr", "apk", "msi", "com", "pif", "jar"
    ];

    if (file) {
        const fileName = file.name.toLowerCase();
        const fileSize = file.size / (1024 * 1024); // Размер в МБ
        const fileExt = fileName.split('.').pop();

        // Проверяем запрещенные расширения
        if (blockedExtensions.includes(fileExt)) {
            alert("⛔ Этот тип файла запрещен! Выберите другой файл.");
            return;
        }

        // Ограничение по размеру (не больше 10 МБ)
        if (fileSize > 10) {
            alert("⚠ Файл слишком большой! Максимальный размер — 10 МБ.");
            return;
        }
    }

    // Формируем итоговый текст
    let text = `🖤 *HackWeb Запрос:*\n\n` +
               `💻 *Имя пользователя:* ${name}\n` +
               `📩 *Email адрес:* ${email}\n` +
               `📱 *Telegram:* ${telegram}\n` +
               `📌 *Тема запроса:* ${topic}\n`;

    // Если выбрана "Предложка проекта WebHack", добавляем категорию улучшения
    if (topic === "Предложка проекта WebHack") {
        let improvementTopic = document.getElementById("improvement-topic").value;
        text += `📢 *Категория улучшения:* ${improvementTopic}\n`;
    }

    // Добавляем сообщение, если оно не отключено для бета-теста
    if (!isBetaTest && message.trim() !== "") {
        text += `\n📝 *Сообщение:* \n${message}\n`;
    }

    text += `\n🔐 *Бета-тест:* ${isBetaTest ? 'Да' : 'Нет'}\n\n` +
            `🌍 *Дата и время отправки:* ${day}.${month}.${year} ${time}`;

    // Если это бета-тест, добавляем пометку в начало сообщения
    if (isBetaTest) {
        text = `🔬 [Бета-тест] 🔬\n\n` + text;
    }

    // Отправка сообщения в Telegram
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "Markdown"
        })
    });

    // Если прикреплен файл, отправляем его
    if (file) {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("document", file);

        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
            method: "POST",
            body: formData
        });
    }

    alert("✅ Сообщение отправлено в Telegram!");
    document.getElementById("tg-form").reset();
});

// Показываем или скрываем дополнительные поля в зависимости от выбора пользователя
document.getElementById('topic').addEventListener('change', function() {
    var topic = this.value;
    var improvementDetails = document.getElementById('improvement-details');
    var messageField = document.getElementById('message');

    // Показать или скрыть дополнительные опции в зависимости от выбранной темы
    improvementDetails.style.display = (topic === 'Предложка проекта WebHack') ? 'block' : 'none';

    // Если выбрана тема "Тестирование формы", делаем сообщение необязательным
    messageField.placeholder = (topic === "Тестирование формы") ? "Сообщение (необязательно)" : "Введите ваше сообщение";
});

document.getElementById('beta-test').addEventListener('change', function() {
    var emailField = document.getElementById('email');
    var messageField = document.getElementById('message');

    emailField.disabled = this.checked;
    emailField.placeholder = this.checked ? "Бета-тест (не требуется)" : "Введите ваш Email";

    messageField.disabled = this.checked;
    messageField.placeholder = this.checked ? "Бета-тест (сообщение не требуется)" : "Введите ваше сообщение";
});
