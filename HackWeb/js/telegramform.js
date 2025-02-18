// Отправка данных формы в Telegram
document.getElementById("tg-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const botToken = "7615760216:AAH5EWMMF-_QMGWNTUfGLCCHwrZsd0AJTM0";
    const chatId = "250356592";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const telegram = document.getElementById("telegram").value || "Не указан";
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("message").value;
    const file = document.getElementById("file").files[0];
    const isBetaTest = document.getElementById("beta-test").checked; // Проверяем, включен ли чекбокс

    // Формируем текст сообщения
    let text = `🔰 *HackWeb Запрос:*\n\n` +
               `🕵️ *Имя:* ${name}\n` +
               `📧 *Email:* ${email}\n` +
               `📲 *Telegram:* ${telegram}\n` +
               `📌 *Тема:* ${topic}\n` +
               `💬 *Сообщение:* ${message}`;

    // Если это бета-тест, добавляем пометку
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
