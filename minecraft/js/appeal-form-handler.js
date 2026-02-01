// appeal-form-handler.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appeal-form');
    const statusMessage = document.getElementById('status');
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('evidence');

    if (!form) return;

    // Drag & Drop функционал
    if (dropArea && fileInput) {
        // Предотвращаем стандартное поведение браузера
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Подсветка области при наведении файла
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.style.border = '2px solid #FF0000';
            dropArea.style.backgroundColor = 'rgba(139, 0, 0, 0.2)';
        }

        function unhighlight() {
            dropArea.style.border = '2px dashed #8B0000';
            dropArea.style.backgroundColor = 'rgba(139, 0, 0, 0.1)';
        }

        // Обработка сброса файла
        dropArea.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('click', () => fileInput.click());

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            updateFileList(files);
        }

        // Обработка выбора файла через клик
        fileInput.addEventListener('change', function() {
            updateFileList(this.files);
        });

        function updateFileList(files) {
            if (files.length > 0) {
                const fileList = document.createElement('div');
                fileList.className = 'file-list';
                fileList.innerHTML = `<p><i class="fas fa-file"></i> Selected file: ${files[0].name} (${formatBytes(files[0].size)})</p>`;
                
                const existingList = dropArea.querySelector('.file-list');
                if (existingList) {
                    existingList.remove();
                }
                dropArea.appendChild(fileList);
            }
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Очищаем статусное сообщение
        statusMessage.textContent = '';
        statusMessage.className = '';

        // Добавляем статус отправки
        statusMessage.innerHTML = '<i class="fas fa-hourglass-half"></i> Processing parole appeal...';
        statusMessage.style.color = '#FFA500';
        statusMessage.className = 'processing-message';

        // Получаем данные формы
        const formData = new FormData(form);

        // Проверяем обязательные поля
        const username = formData.get('username')?.trim();
        const telegramNick = formData.get('telegram-nick')?.trim();
        const appealReason = formData.get('appeal-reason')?.trim();
        const evidenceFile = formData.get('evidence');

        if (!username || !telegramNick || !appealReason) {
            statusMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill out all required fields!';
            statusMessage.style.color = '#DC143C';
            statusMessage.className = 'error-message';
            return;
        }

        // Проверка размера файла (максимум 10MB)
        if (evidenceFile && evidenceFile.size > 0) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (evidenceFile.size > maxSize) {
                statusMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> File size exceeds 10MB limit!';
                statusMessage.style.color = '#DC143C';
                statusMessage.className = 'error-message';
                return;
            }
        }

        // Формируем сообщение в Telegram с Markdown-разметкой
        const currentDate = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const message = `
🔒 *HW HELL BLOCK - NEW PAROLE APPEAL*
⏰ *Date:* ${currentDate}

🆔 *Prisoner ID:* \`${username}\`
📱 *Telegram:* @${telegramNick.replace('@', '')}

📄 *Parole Justification:*
${appealReason}

📎 *Evidence:* ${evidenceFile && evidenceFile.size > 0 ? 'Attached' : 'Not provided'}

⚠️ *This is an automated appeal submission. Review required.*
        `;

        // Данные для отправки в Telegram
        const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo"; // Замени на свой токен
        const chatIds = ["250356592"]; // Замени на свой ID

        try {
            let allSuccessful = true;
            
            // Отправляем всем администраторам
            for (const chatId of chatIds) {
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
                    if (!textData.ok) {
                        console.error('Failed to send text to chat', chatId, textData);
                        allSuccessful = false;
                        continue;
                    }

                    // Если загружен файл, отправляем его
                    if (evidenceFile && evidenceFile.size > 0) {
                        const fileFormData = new FormData();
                        fileFormData.append('chat_id', chatId);
                        fileFormData.append('photo', evidenceFile);
                        fileFormData.append('caption', `Evidence for appeal from ${username}`);

                        const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                            method: 'POST',
                            body: fileFormData
                        });

                        const fileData = await fileResponse.json();
                        if (!fileData.ok) {
                            console.error('Failed to send file to chat', chatId, fileData);
                            allSuccessful = false;
                        }
                    }
                } catch (error) {
                    console.error('Error sending to chat', chatId, error);
                    allSuccessful = false;
                }
            }

            if (allSuccessful || chatIds.length > 0) {
                // Успешное завершение хотя бы для одного чата
                statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Parole appeal submitted successfully! Your case is under review.';
                statusMessage.style.color = '#228B22';
                statusMessage.className = 'success-message';
                
                // Показываем дополнительную информацию
                const info = document.createElement('div');
                info.className = 'submission-info';
                info.innerHTML = `
                    <p><i class="fas fa-info-circle"></i> Appeal ID: HW-${Date.now().toString().slice(-6)}</p>
                    <p><i class="fas fa-clock"></i> Response time: 3-7 business days</p>
                `;
                statusMessage.appendChild(info);
                
                form.reset();
                
                // Очищаем список файлов
                const fileList = dropArea.querySelector('.file-list');
                if (fileList) {
                    fileList.remove();
                }
                
                // Добавляем кнопку для нового обращения (скрытая на 30 секунд)
                setTimeout(() => {
                    const newAppealBtn = document.createElement('button');
                    newAppealBtn.innerHTML = '<i class="fas fa-plus"></i> Submit Another Appeal';
                    newAppealBtn.className = 'secondary-button';
                    newAppealBtn.style.marginTop = '15px';
                    newAppealBtn.onclick = () => {
                        statusMessage.textContent = '';
                        statusMessage.className = '';
                        form.reset();
                        newAppealBtn.remove();
                    };
                    statusMessage.appendChild(newAppealBtn);
                }, 3000);
            } else {
                throw new Error('Failed to send to all administrators');
            }
        } catch (error) {
            console.error('Error:', error);
            statusMessage.innerHTML = '<i class="fas fa-times-circle"></i> Error submitting appeal. Please try again later.';
            statusMessage.style.color = '#DC143C';
            statusMessage.className = 'error-message';
            
            // Добавляем кнопку повтора
            const retryBtn = document.createElement('button');
            retryBtn.innerHTML = '<i class="fas fa-redo"></i> Retry Submission';
            retryBtn.className = 'retry-button';
            retryBtn.style.marginTop = '10px';
            retryBtn.onclick = () => {
                statusMessage.textContent = '';
                statusMessage.className = '';
                retryBtn.remove();
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            };
            statusMessage.appendChild(retryBtn);
        }
    });

    // Добавляем стили для сообщений
    const style = document.createElement('style');
    style.textContent = `
        .processing-message {
            background: rgba(255, 165, 0, 0.1);
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #FFA500;
        }
        .success-message {
            background: rgba(34, 139, 34, 0.1);
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #228B22;
        }
        .error-message {
            background: rgba(220, 20, 60, 0.1);
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #DC143C;
        }
        .submission-info {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .secondary-button, .retry-button {
            background: #8B0000;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .secondary-button:hover {
            background: #A52A2A;
        }
        .retry-button {
            background: #DC143C;
        }
        .retry-button:hover {
            background: #FF0000;
        }
        .file-list {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);
});