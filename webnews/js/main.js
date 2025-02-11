document.addEventListener("DOMContentLoaded", async function () {
    await loadNews();
    await loadNavbar();
    setupFormHandlers();
    setupBetaTestToggle();
    await loadCategories(); // Загружаем категории
    await loadNews(); // Загружаем новости
});

/**
 * Загружает категории из JSON и создает навигацию по ним.
 */
async function loadCategories() {
    try {
        const response = await fetch("webnews/data/news.json");
        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const { news } = await response.json();
        const categories = new Set(news.map(item => item.category)); // Уникальные категории

        const categoryContainer = document.createElement("div");
        categoryContainer.id = "category-container";

        // Кнопка "Все новости"
        const allButton = document.createElement("button");
        allButton.textContent = "Все новости";
        allButton.classList.add("category-btn", "active");
        allButton.dataset.category = "all";
        categoryContainer.appendChild(allButton);

        // Создаем кнопки для каждой категории
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category;
            button.classList.add("category-btn");
            button.dataset.category = category;
            categoryContainer.appendChild(button);
        });

        // Вставляем категории перед новостями
        const mainContainer = document.getElementById("news-container");
        mainContainer.before(categoryContainer);

        // Добавляем обработчики событий
        document.querySelectorAll(".category-btn").forEach(button => {
            button.addEventListener("click", function () {
                document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                filterNews(this.dataset.category);
            });
        });
    } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
    }
}

/**
 * Загружает и рендерит новости на страницу.
 */
async function loadNews() {
    try {
        const response = await fetch("webnews/data/news.json");
        if (!response.ok) throw new Error("Ошибка загрузки новостей");

        const { news } = await response.json();
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";

        news.forEach(item => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");
            newsItem.dataset.category = item.category; // Для фильтрации

            // Создаем элементы новости
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.title;

            const title = document.createElement("h2");
            title.textContent = item.title;

            const summary = document.createElement("p");
            summary.textContent = item.summary;

            const content = document.createElement("p");
            content.textContent = item.content;
            content.classList.add("hidden"); // Скрытый текст новости

            const metaInfo = document.createElement("div");
            metaInfo.classList.add("news-meta");
            metaInfo.innerHTML = `
                <span>${formatDate(item.date)}</span>
                <span> | ${item.author}</span>
                <span> | ${item.category}</span>
            `;

            // Кнопка "Читать дальше"
            const readMoreBtn = document.createElement("button");
            readMoreBtn.textContent = "Читать дальше";
            readMoreBtn.classList.add("read-more-btn");
            readMoreBtn.addEventListener("click", () => {
                content.classList.toggle("hidden");
                readMoreBtn.textContent = content.classList.contains("hidden") ? "Читать дальше" : "Скрыть";
            });

            // Добавляем в контейнер
            newsItem.append(img, title, summary, metaInfo, readMoreBtn, content);
            newsContainer.appendChild(newsItem);
        });
    } catch (error) {
        console.error("Ошибка загрузки новостей:", error);
    }
}

/**
 * Фильтрует новости по категориям.
 */
function filterNews(category) {
    const newsItems = document.querySelectorAll(".news-item");

    newsItems.forEach(item => {
        item.style.display = category === "all" || item.dataset.category === category ? "block" : "none";
    });
}

/**
 * Преобразует дату в читаемый формат.
 */
function formatDate(isoString) {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(isoString).toLocaleDateString("ru-RU", options);
}

/**
 * Загружает навигационное меню из внешнего файла.
 */
async function loadNavbar() {
    try {
        const response = await fetch("webnews/nav/navbar.html");
        if (!response.ok) throw new Error("Ошибка загрузки навигационной панели");

        const navbarContainer = document.getElementById("navbar-container");
        navbarContainer.innerHTML = await response.text();
    } catch (error) {
        console.error("Ошибка при загрузке навигационной панели:", error);
    }
}

/**
 * Настраивает обработчики для формы отправки сообщений.
 */
function setupFormHandlers() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const botToken = "7745335635:AAGbPdzXplwqbMky-xgJ9KOhsWln5z6toYo";  // Токен бота (замените на безопасный метод хранения)
        const chatId = "250356592";  // Твой chat_id

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const betaTest = document.getElementById("beta-test").checked ? "✅ Участвует в бета-тесте" : "❌ Не участвует в бета-тесте";

        if (!name || !message) {
            showStatus("❌ Заполните все обязательные поля!", "red");
            return;
        }

        const text = `🆕 *WebNews Запрос:*\n\n` +
                     `📝 *Имя:* ${name}\n` +
                     `📧 *Email:* ${email || "Не указан"}\n` +
                     `💬 *Сообщение:* ${message}\n` +
                     `🚀 *Бета-тестирование:* ${betaTest}`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: "Markdown"
                })
            });

            const result = await response.json();
            if (result.ok) {
                showStatus("✅ Сообщение отправлено!", "green");
                form.reset();
            } else {
                showStatus("❌ Ошибка отправки: " + result.description, "red");
            }
        } catch (error) {
            showStatus("❌ Ошибка соединения: " + error.message, "red");
        }
    });
}

/**
 * Показывает статус отправки сообщения.
 * @param {string} message Текст сообщения
 * @param {string} color Цвет текста
 */
function showStatus(message, color) {
    const statusMessage = document.getElementById("status");
    statusMessage.textContent = message;
    statusMessage.style.color = color;
}

/**
 * Настраивает поведение чекбокса "Участвовать в бета-тесте".
 */
function setupBetaTestToggle() {
    const betaTestCheckbox = document.getElementById("beta-test");
    const emailField = document.getElementById("email");
    const emailContainer = document.getElementById("email-container");
    const emailLabel = document.getElementById("email-label");

    if (!betaTestCheckbox || !emailField || !emailContainer || !emailLabel) return;

    function toggleEmailField() {
        if (betaTestCheckbox.checked) {
            emailContainer.style.display = "none";
            emailField.disabled = true;
            emailField.required = false;
            emailLabel.style.opacity = "0.5";
        } else {
            emailContainer.style.display = "block";
            emailField.disabled = false;
            emailField.required = true;
            emailLabel.style.opacity = "1";
        }
    }

    betaTestCheckbox.addEventListener("change", function () {
        toggleEmailField();
        if (this.checked) {
            alert("⚠️ Внимание! Если вы участвуете в бета-тесте, вводить email не нужно.");
        }
    });

    document.getElementById("contact-form").addEventListener("submit", function (event) {
        if (betaTestCheckbox.checked) {
            const confirmBeta = confirm("Вы уверены, что хотите участвовать в бета-тесте?");
            if (!confirmBeta) {
                betaTestCheckbox.checked = false;
                event.preventDefault();
            }
        }
    });

    toggleEmailField();
}
