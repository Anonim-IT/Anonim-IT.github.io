// bot.js — запуск: node bot.js
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// ===== НАСТРОЙКИ =====
const BOT_TOKEN = '1234567890:ABCdefGHIJKLMNOPQRSTUVWXYZ'; // ТОТ ЖЕ ТОКЕН
const ADMIN_CHAT_ID = '123456789'; // куда слать копии
const WEBHOOK_URL = 'https://ваш-сервер.ru/webhook'; // для приёма ответов с сайта

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const app = express();
app.use(bodyParser.json());

// 1. Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
        `🎫 *Система тикетов HW Pro*\n\n` +
        `Вы можете отправить обращение прямо сюда — и оно попадёт в ту же систему, что и с сайта.\n\n` +
        `Просто напишите сообщение — и создастся тикет.`,
        { parse_mode: 'Markdown' }
    );
});

// 2. Приём сообщений в боте — создание тикета
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const username = msg.from.username || msg.from.first_name;

    if (text === '/start') return;

    // Отправляем подтверждение
    bot.sendMessage(chatId, `✅ Ваше обращение принято! Номер: #${msg.message_id}\nОтвет придёт сюда в течение 24 часов.`);

    // Формируем данные тикета
    const ticketFromBot = {
        source: 'telegram_bot',
        user_id: chatId,
        username: username,
        message: text,
        timestamp: new Date().toISOString()
    };

    // Отправляем админу
    const adminMsg = `📩 *Тикет из бота*\nОт: @${username} (ID: ${chatId})\nСообщение:\n${text}`;
    await bot.sendMessage(ADMIN_CHAT_ID, adminMsg, { parse_mode: 'Markdown' });

    // Здесь можно отправить данные на ваш веб-сайт (API)
    try {
        await fetch('https://ваш-сервер.ru/api/ticket-from-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketFromBot)
        });
    } catch(e) { console.error('Ошибка отправки на сайт:', e); }
});

// 3. Вебхук для получения ответов с сайта (чтобы бот писал пользователю)
app.post('/webhook', async (req, res) => {
    const { userId, answer } = req.body;
    if (userId && answer) {
        await bot.sendMessage(userId, `📢 *Ответ по вашему тикету:*\n\n${answer}`, { parse_mode: 'Markdown' });
        res.status(200).send('OK');
    } else {
        res.status(400).send('Bad request');
    }
});

app.listen(3000, () => console.log('Сервер вебхука запущен на порту 3000'));