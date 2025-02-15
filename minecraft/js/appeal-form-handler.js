// appeal-form-handler.js

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

    // Создаем сообщение для отправки в Telegram с использованием Markdown
    const message = `
*New Appeal Submission:*
  
👤 *Username:* ${formObject.username}
  
💬 *Telegram Nick:* ${formObject['telegram-nick']}
  
❓ *Reason for Appeal:* ${formObject['appeal-reason']}
  
📸 *Evidence:* ${formObject.evidence ? 'Provided' : 'Not provided'}
    `;

    // Токен бота и ID чата храним в безопасном месте!
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Замени на свой токен
    const chatId = "250356592"; // Замени на свой ID

    // Если файл был загружен, отправляем его в Telegram
    const fileInput = formData.get('evidence');
    if (fileInput && fileInput.size > 0) {
        // Создаем URL для отправки файла
        const fileUrl = URL.createObjectURL(fileInput);

        // URL для отправки запроса в Telegram API для медиа
        const telegramFileUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

        // Отправляем текстовое сообщение
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'  // Указываем, что текст будет отформатирован в Markdown
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // Если текстовое сообщение отправлено, отправляем фотографию
                const formDataForFile = new FormData();
                formDataForFile.append('chat_id', chatId);
                formDataForFile.append('photo', fileInput);

                fetch(telegramFileUrl, {
                    method: 'POST',
                    body: formDataForFile
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        alert('Your appeal has been submitted successfully!');
                    } else {
                        alert('There was an error submitting your appeal file.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error submitting appeal file.');
                });
            } else {
                alert('There was an error submitting your appeal.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting appeal.');
        });
    } else {
        // Если файла нет, отправляем только текстовое сообщение
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'  // Указываем, что текст будет отформатирован в Markdown
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
    }
});
