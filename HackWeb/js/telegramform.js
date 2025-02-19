document.getElementById("tg-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const botToken = "7615760216:AAH5EWMMF-_QMGWNTUfGLCCHwrZsd0AJTM0";
    const chatId = "250356592";

    const name = document.getElementById("name").value;
    const isBetaTest = document.getElementById("beta-test").checked;
    let email = "Не указан";
    let message = "Не указано";
    let topic = "Не выбрана";
    const telegram = document.getElementById("telegram").value || "Не указан";
    const file = document.getElementById("file").files[0];
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

    if (isBetaTest) {
        email = "Бета-тест (не требуется)";
        message = "Бета-тест (не требуется)";
        topic = "Не выбрана (Бета-тест)";
        document.getElementById("email").disabled = true; // Отключаем поле email
        document.getElementById("message").disabled = true; // Отключаем поле сообщения
    } else {
        // Проверка наличия сообщения при обычной отправке
        if (topic === "Тестирование формы" || message.trim() === "") {
            alert("⚠ Пожалуйста, напишите сообщение перед отправкой!");
            return;
        }

        // Проверка, если выбрана тема "Предложка проекта WebHack"
        if (topic === "Предложка проекта WebHack") {
            let improvementTopic = document.getElementById("improvement-topic").value;
            message += `📢 *Категория улучшения:* ${improvementTopic}\n`;
        }

        // Получаем значение e-mail и темы для отправки
        email = document.getElementById("email").value || "Не указан";
        topic = document.getElementById("topic").value || "Не выбрана";
    }

    // Проверка на допустимые расширения файла
    const blockedExtensions = [
        "exe", "bat", "cmd", "sh", "vbs", "js", "ps1", "scr", "apk", "msi", "com", "pif", "jar"
    ];

    if (file) {
        const fileName = file.name.toLowerCase();
        const fileSize = file.size / (1024 * 1024); // Размер в МБ
        const fileExt = fileName.split('.').pop();

        if (blockedExtensions.includes(fileExt)) {
            alert("⛔ Этот тип файла запрещен! Выберите другой файл.");
            return;
        }

        if (fileSize > 10) {
            alert("⚠ Файл слишком большой! Максимальный размер — 10 МБ.");
            return;
        }
    }

    let text = `🖤 *HackWeb Запрос:*\n\n` +
               `💻 *Имя пользователя:* ${name}\n` +
               `📩 *Email адрес:* ${email}\n` +
               `📱 *Telegram:* ${telegram}\n` +
               `📌 *Тема запроса:* ${topic}\n` +
               `🕒 *Часовой пояс:* ${timezone}\n`;

    if (!isBetaTest && message.trim() !== "") {
        text += `\n📝 *Сообщение:* \n${message}\n`;
    }

    text += `\n🔐 *Бета-тест:* ${isBetaTest ? 'Да' : 'Нет'}\n\n` +
            `🌍 *Дата и время отправки:* ${day}.${month}.${year} ${time}`;

    if (isBetaTest) {
        text = `🔬 [Бета-тест] 🔬\n\n` + text;
    }

    // Валидация ссылки на сайт
    const website = document.getElementById("website").value;
    const websiteRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9-]{2,6}\/?$/i;
    if (website && !websiteRegex.test(website)) {
        alert("⚠ Введите корректную ссылку!");
        return;
    }
    if (website) {
        text += `🔗 *Сайт / портфолио:* ${website}\n`;
    }

    // Получаем информацию о браузере и ОС
    const browserInfo = navigator.userAgent;
    const osInfo = navigator.platform;
    
    // Получаем IP и устройство пользователя через ipinfo.io API
    let ipDetails = "";
    let userDevice = "";
    let ip = "Не удалось получить IP";  // Сообщение по умолчанию

    try {
        const { ip: userIP, city, region, country, device } = await getUserDetails();
        ip = userIP;
        ipDetails = `Город: ${city}, Регион: ${region}, Страна: ${country}`;
        userDevice = device;
    } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
    }

    text += `\n🌍 *IP-адрес:* ${ip}\n${ipDetails}\n${userDevice}\n`;
    text += `\n🌐 *Браузер:* ${browserInfo}\n`;
    text += `\n💻 *ОС:* ${osInfo}\n`;

    // Отправка сообщения в Telegram
    await sendMessageToTelegram(text, botToken, chatId);

    // Отправка файла, если он есть
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

async function sendMessageToTelegram(text, botToken, chatId) {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
        })
    });
    
    const result = await response.json();
    if (!result.ok) {
        alert("⚠ Произошла ошибка при отправке сообщения в Telegram.");
    }
}
//async function getUserDetails() {
    // Получаем данные о пользователе с помощью API ipinfo.io
    //const response = await fetch('https://ipinfo.io/json?token=b60600bccc6d6d');
    //const data = await response.json();
    
    //const userDevice = navigator.platform;  // Пример получения устройства

   // return {
        //ip: data.ip,
      //  city: data.city,
    //    region: data.region,
  //      country: data.country,
//        device: userDevice
   // };
//}