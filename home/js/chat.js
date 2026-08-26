// ============================================================
// ЧАТ ПОДДЕРЖКИ
// ============================================================
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

function toggleChat() {
    chatToggle.classList.toggle('active');
    chatBox.classList.toggle('active');
    if (chatBox.classList.contains('active')) {
        chatInput.focus();
    }
}

function closeChat() {
    chatToggle.classList.remove('active');
    chatBox.classList.remove('active');
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user' : 'bot');
    msgDiv.innerHTML = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'typing');
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = 'Хакер печатает...<span class="dots">...</span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function getBotResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    
    // --- FAQ Ответы (в стиле чёрного хакинга) ---
    const faqResponses = [
        { keywords: ['регистрация', 'зарегистрироваться', 'аккаунт', 'создать'], response: 'Регистрация? Ха! Ты серьёзно? Ладно, заполни анкету, но если ты тупой — я не удивлюсь. И не вздумай спамить, а то я тебя в бан закину.' },
        { keywords: ['документы', 'правила', 'условия'], response: 'Документы в разделе "О портале". Но ты бы туда всё равно не зашёл, тупая ты скотина. Читай, пока я добрый.' },
        { keywords: ['доступ', 'войти', 'логин', 'пароль'], response: 'Доступ через кнопку "Войти". Если забыл пароль — это твои проблемы, а не мои. Не ной, придумывай новый.' },
        { keywords: ['помощь', 'поддержка', 'проблема', 'не работает'], response: 'Опять что-то сломал? Ну давай, рассказывай, что у тебя там. Только быстро, у меня взлом серверов Пентагона в планах. 😈' },
        { keywords: ['приватность', 'конфиденциальность', 'личные данные'], response: 'Политика конфиденциальности есть. Но если ты думаешь, что я буду с тобой нянчиться — ты ошибся. Твои данные в безопасности, если ты не идиот. 😏' },
    ];

    for (const item of faqResponses) {
        for (const keyword of item.keywords) {
            if (lowerMsg.includes(keyword)) {
                return item.response;
            }
        }
    }

    // --- Обычные ответы с агрессией ---
    const aggressiveResponses = [
        { keywords: ['привет', 'здравствуй', 'здарова', 'хай'], response: 'Чё надо, лошара? Вали быстрее, я занят взломом.' },
        { keywords: ['как дела', 'как жизнь', 'чё как'], response: 'Нормально, без тебя лучше. Чё приперся, проблем нет?' },
        { keywords: ['спасибо', 'благодарю'], response: 'Ага, на здоровье, тупица. Мог бы и поконкретнее спросить, но ты же умный у нас.' },
        { keywords: ['пока', 'до свидания', 'давай'], response: 'Иди уже, бесишь меня. Если чё — пиши, но лучше не пиши, я занят взломом. 😒' },
        { keywords: ['ты кто', 'бот', 'искусственный интеллект'], response: 'Я твой худший кошмар, кусок кода. Техподдержка, но ты бы сам догадался, если б не был тупым.' },
        { keywords: ['дурак', 'идиот', 'тупой', 'лох'], response: 'Сам такой! Ты зачем сюда пришёл, чтобы оскорблять меня? Я тебя сейчас так закеширую, что мама не узнает!' },
        { keywords: ['извини', 'прости', 'сорри'], response: 'Ладно, прощаю. Но в следующий раз думай, прежде чем писать, иначе я тебя в бан закину, пойдёшь в /dev/null.' },
        { keywords: ['хакинг', 'взлом', 'код', 'взломать'], response: 'О, смотрю, ты решил поиграть во взломщика? Запомни: я тебя предупредил, не лезь туда, где не шаришь. А то я тебя так забаню, что ты не сможешь даже гугл открыть.' },
        { keywords: ['помоги', 'научи', 'расскажи'], response: 'Я тут не учитель, лошара. Гугл тебе в помощь. Если ты не можешь найти информацию сам — тебе не место в хакерской среде.' },
        { keywords: ['безопасность', 'защита', 'антивирус'], response: 'Безопасность? Ты серьёзно? Ты сидишь на моём сайте и просишь меня научить тебя безопасности? Иронично, не находишь? Ты даже свой пароль не можешь запомнить.' },
        { keywords: ['смешно', 'ха-ха', 'забавно', 'юмор'], response: 'Ты смешной, только не в ту сторону. Сейчас я тебя так задидошу, что ты запомнишь этот разговор навсегда.' },
        { keywords: ['зачем', 'почему', 'откуда'], response: 'Зачем? Потому что я так сказал. Почему? Потому что я так сказал. Откуда? Я же бот, я всё знаю, но тебе не скажу, лошара.' },
    ];

    for (const item of aggressiveResponses) {
        for (const keyword of item.keywords) {
            if (lowerMsg.includes(keyword)) {
                return item.response;
            }
        }
    }

    const randomHackerResponses = [
        'Ты мне надоел, лошара. Иди учи матчасть, потом приходи. 😑',
        'Слушай, ты реально тупой? Я вообще-то занят важными делами. Чё тебе надо?',
        'Твоя проблема — ты, лошара. Но я тебя слушаю, валяй, может, я даже отвечу. 😏',
        'Я такое не понимаю. Ты хоть сам понял, что написал? Иди перечитай, потом возвращайся.',
        'Ты серьёзно ко мне с этим пришёл? Я сейчас забаниваю тебя нахрен.',
        'А ты вообще шаришь, куда попал? Это не детский сад, здесь серьёзные дела. Вали отсюда, пока я добрый.',
        'Я тебя слушаю, но ты меня бесишь. Давай быстрее, у меня там сервер падает.',
        'Знаешь, я бы мог тебе помочь, но ты мне не нравишься. Иди учись, лошара.'
    ];
    return randomHackerResponses[Math.floor(Math.random() * randomHackerResponses.length)];
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    showTyping();
    setTimeout(() => {
        removeTyping();
        const reply = getBotResponse(text);
        addMessage(reply + '<span class="msg-time">' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + '</span>', 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600 + Math.random() * 800);
}

function askFAQ(question) {
    chatInput.value = question;
    sendMessage();
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (chatBox.classList.contains('active')) {
            closeChat();
        }
    }
});