// appeal-form-handler.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appeal-form');
    const statusMessage = document.getElementById('status');

    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Очищаем статусное сообщение
        statusMessage.textContent = '';
        statusMessage.style.color = '';

        // Добавляем анимацию загрузки
        statusMessage.textContent = 'Submitting your appeal...';
        statusMessage.style.color = 'blue';

        // Получаем данные формы
        const formData = new FormData(form);

        // Проверяем обязательные поля
        const username = formData.get('username')?.trim();
        const telegramNick = formData.get('telegram-nick')?.trim();
        const appealReason = formData.get('appeal-reason')?.trim();
        const evidenceFile = formData.get('evidence');

        if (!username || !telegramNick || !appealReason) {
            statusMessage.textContent = 'Please fill out all required fields!';
            statusMessage.style.color = 'red';
            return;
        }

        // Формируем сообщение в Telegram с Markdown-разметкой
        const message = `
*New Appeal Submission:*
👤 *Username:* ${username}
💬 *Telegram Nick:* ${telegramNick}
❓ *Reason for Appeal:* ${appealReason}
📸 *Evidence:* ${evidenceFile && evidenceFile.size > 0 ? 'Provided' : 'Not provided'}
        `;

        // Данные для отправки в Telegram
    // Токен бота и ID чата храним в безопасном месте!
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Замени на свой токен
    const chatId = "250356592"; // Замени на свой ID

        try {
            // Отправляем текстовое сообщение
            const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            const textData = await textResponse.json();
            if (!textData.ok) throw new Error('Failed to send text message.');

            // Если загружен файл, отправляем его
            if (evidenceFile && evidenceFile.size > 0) {
                const fileFormData = new FormData();
                fileFormData.append('chat_id', chatId);
                fileFormData.append('photo', evidenceFile);

                const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                    method: 'POST',
                    body: fileFormData
                });

                const fileData = await fileResponse.json();
                if (!fileData.ok) throw new Error('Failed to send evidence file.');
            }

            // Успешное завершение
            statusMessage.textContent = 'Your appeal has been submitted successfully!';
            statusMessage.style.color = 'green';
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = 'Error submitting appeal. Please try again later.';
            statusMessage.style.color = 'red';
        }
    });
});
