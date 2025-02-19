document.getElementById("contact-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const botToken = "7854601870:AAE3aTX2tUl4L_6rmSlI1QeWLwkqhIdVJts"; // Ваш токен бота
    const chatId = "250356592"; // Ваш ID чата

    // Формирование текста для отправки в Telegram с использованием Markdown
    let text = `*🖤 Новое сообщение с сайта:*\n\n` +
               `💻 *Имя пользователя:* ${name}\n` +
               `📩 *Email:* ${email}\n` +
               `📝 *Сообщение:* \n${message}\n`;

    // Отправка сообщения в Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown' // Использование Markdown для форматирования
        })
    });

    const result = await response.json();
    if (result.ok) {
        alert("✅ Ваше сообщение успешно отправлено!");
        document.getElementById("contact-form").reset(); // Очистка формы
    } else {
        alert("⚠ Произошла ошибка при отправке сообщения.");
    }
});
