document.getElementById("job-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Останавливаем стандартную отправку формы

    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Укажи токен своего бота
    const chatId = "250356592"; // Укажи свой Telegram ID или ID группы

    // Получаем данные из формы
    const formData = {
        fullname: document.getElementById("fullname").value,
        birthdate: document.getElementById("birthdate").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        education: document.getElementById("education").value,
        experience: document.getElementById("experience").value,
        position: document.getElementById("position").value,
        message: document.getElementById("message").value
    };

    // Формируем текст для Telegram
    const message = `📩 *Новая заявка на работу!*\n\n` +
                    `👤 *ФИО:* ${formData.fullname}\n` +
                    `📅 *Дата рождения:* ${formData.birthdate}\n` +
                    `📧 *Email:* ${formData.email}\n` +
                    `📞 *Телефон:* ${formData.phone}\n` +
                    `🎓 *Образование:* ${formData.education}\n` +
                    `💼 *Опыт работы:* ${formData.experience}\n` +
                    `👔 *Желаемая должность:* ${formData.position}\n` +
                    `💬 *Доп. информация:* ${formData.message}`;

    // Отправляем сообщение в Telegram
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    });

    // Выводим статус отправки
    const statusMessage = document.getElementById("status-message");
    if (response.ok) {
        statusMessage.textContent = "✅ Заявка успешно отправлена!";
        statusMessage.style.color = "green";
    } else {
        statusMessage.textContent = "❌ Ошибка при отправке заявки!";
        statusMessage.style.color = "red";
    }
});
