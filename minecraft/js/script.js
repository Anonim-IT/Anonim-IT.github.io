document.addEventListener("DOMContentLoaded", function () {
    loadSecurityProtocol();
    loadNavbar(); // Загружаем навигационную панель
});

// Функция загрузки навигационной панели
function loadNavbar() {
    fetch('minecraft/navbar/navbarminecraft.html')
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
            return response.text();
        })
        .then(html => {
            const navbarElement = document.getElementById("navbar");
            if (navbarElement) {
                navbarElement.innerHTML = html;
            } else {
                console.error("Элемент #navbar не найден!");
            }
        })
        .catch(error => console.error('Ошибка загрузки меню:', error));
}

// Обработчик формы допуска в закрытый сектор
document.getElementById("whitelistForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Функция для защиты от XSS
    function sanitize(input) {
        return input.replace(/[<>]/g, "");
    }

    // Сбор данных
    const subjectID = sanitize(document.getElementById("nickname").value.trim());
    const clearanceLevel = sanitize(document.getElementById("age").value.trim());
    const contactInfo = sanitize(document.getElementById("contact").value.trim());
    const experience = sanitize(document.getElementById("experience").value.trim());
    const rpLevel = sanitize(document.getElementById("rp").value);
    const missionPlans = sanitize(document.getElementById("plans").value.trim());
    const weeklyTime = sanitize(document.getElementById("time").value.trim());
    const anomalyTolerance = sanitize(document.getElementById("horror").value.trim());
    const psychologicalRisks = sanitize(document.getElementById("fears").value.trim());
    const medicalStatus = sanitize(document.getElementById("health").value.trim());
    const operationalBehavior = sanitize(document.getElementById("playstyle").value);
    const noCheatDeclaration = document.getElementById("cheats").checked;
    const responsibilityAgreement = document.getElementById("responsibility").checked;

    // Верификация данных
    if (!subjectID || !clearanceLevel || !experience || !missionPlans || !weeklyTime || !anomalyTolerance || !psychologicalRisks || !medicalStatus || !responsibilityAgreement) {
        document.getElementById("status").innerText = "⚠️ [SECURITY ALERT] Введены неполные данные! Допуск запрещён.";
        return;
    }

    if (clearanceLevel < 18) {
        document.getElementById("status").innerText = "⛔ [ACCESS DENIED] Недостаточный уровень допуска (Возраст < 18)";
        return;
    }

    if (!noCheatDeclaration) {
        document.getElementById("status").innerText = "⚠️ [SECURITY WARNING] Подозрение на несоблюдение Протокола честности!";
        return;
    }

    document.getElementById("status").innerText = "⏳ [PROCESSING] Запрос на авторизацию отправлен в Командный Центр...";

    // Telegram-бот
    const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo";
    const chatIds = ["250356592", "5206122340"];

    const message = `🔴 **[SCP-ARC CLASSIFIED SECTOR] - ЗАПРОС НА ДОПУСК** 🔴\n\n` +
        `🔹 **Идентификатор субъекта:** ${subjectID}\n` +
        `🔹 **Уровень допуска:** ${clearanceLevel}\n` +
        `🔹 **Контактные данные:** ${contactInfo || "Не указаны"}\n` +
        `🔹 **Опыт работы с аномалиями:** ${experience}\n` +
        `🔹 **RP-стандарт:** ${rpLevel}\n` +
        `🔹 **Планы на сектор:** ${missionPlans}\n` +
        `🔹 **Ожидаемое время активности:** ${weeklyTime}\n` +
        `🔹 **Толерантность к аномалиям:** ${anomalyTolerance}\n` +
        `🔹 **Психологические риски:** ${psychologicalRisks}\n` +
        `🔹 **Медицинский статус:** ${medicalStatus}\n` +
        `🔹 **Оперативное поведение:** ${operationalBehavior}\n` +
        `✅ **Протокол Честности:** Принят\n` +
        `⚠️ **Ответственность за миссию:** Подтверждена`;

    // Отправка данных в Telegram
    chatIds.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                document.getElementById("status").innerText = "✅ [AUTHORIZED] Доступ разрешён. Ждите инструкций.";
            } else {
                document.getElementById("status").innerText = "❌ [ERROR] Ошибка обработки запроса!";
            }
        })
        .catch(() => {
            document.getElementById("status").innerText = "🚫 [CONNECTION ERROR] Ошибка связи с Контрольным Центром!";
        });
    });
});
