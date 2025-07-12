document.addEventListener("DOMContentLoaded", async function () {
    await loadNavbar();
    await loadCategories();
    await loadNews();
    setupFormHandlers();
    setupBetaTestToggle();
});

/**
 * Загружает категории из JSON и создает навигацию по ним
 */
async function loadCategories() {
    try {
        const response = await fetch("webnews/data/news.json");
        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const { news } = await response.json();
        const categories = [...new Set(news.map(item => item.category))]; // Уникальные категории

        const categoryContainer = document.createElement("div");
        categoryContainer.className = "category-container";

        // Кнопка "Все новости"
        const allButton = createCategoryButton("Все новости", "all", true);
        categoryContainer.appendChild(allButton);

        // Создаем кнопки для каждой категории
        categories.forEach(category => {
            const button = createCategoryButton(category, category);
            categoryContainer.appendChild(button);
        });

        // Вставляем категории перед новостями
        const mainContainer = document.getElementById("news-container");
        mainContainer.before(categoryContainer);

        // Добавляем обработчики событий
        document.querySelectorAll(".category-btn").forEach(button => {
            button.addEventListener("click", function () {
                document.querySelectorAll(".category-btn").forEach(btn => 
                    btn.classList.remove("active")
                );
                this.classList.add("active");
                filterNews(this.dataset.category);
            });
        });

    } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
        showError("Не удалось загрузить категории новостей");
    }
}

/**
 * Создает кнопку категории
 */
function createCategoryButton(text, category, isActive = false) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = `category-btn ${isActive ? 'active' : ''}`;
    button.dataset.category = category;
    return button;
}

/**
 * Загружает и рендерит новости на страницу
 */
async function loadNews() {
    try {
        const response = await fetch("webnews/data/news.json");
        if (!response.ok) throw new Error("Ошибка загрузки новостей");

        const { news } = await response.json();
        const newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = "";

        if (news.length === 0) {
            newsContainer.innerHTML = `
                <div class="empty-state">
                    <img src="webnews/assets/no-news.svg" alt="Нет новостей">
                    <h3>Новостей пока нет</h3>
                    <p>Следите за обновлениями, скоро здесь появятся свежие материалы</p>
                </div>
            `;
            return;
        }

        news.forEach(item => {
            const newsItem = document.createElement("article");
            newsItem.className = "news-card";
            newsItem.dataset.category = item.category;

            newsItem.innerHTML = `
                <div class="news-card__header">
                    <img src="${item.image}" alt="${item.title}" class="news-card__image">
                    <div class="news-card__badge">${item.category}</div>
                </div>
                <div class="news-card__body">
                    <div class="news-card__meta">
                        <time datetime="${item.date}">${formatDate(item.date)}</time>
                        <span>•</span>
                        <span class="news-card__author">${item.author}</span>
                    </div>
                    <h2 class="news-card__title">${item.title}</h2>
                    <p class="news-card__excerpt">${item.summary}</p>
                    <div class="news-card__content hidden">${item.content}</div>
                    <button class="news-card__toggle">Читать дальше</button>
                </div>
            `;

            // Добавляем обработчик для кнопки "Читать дальше"
            const toggleBtn = newsItem.querySelector(".news-card__toggle");
            const content = newsItem.querySelector(".news-card__content");
            
            toggleBtn.addEventListener("click", () => {
                content.classList.toggle("hidden");
                toggleBtn.textContent = content.classList.contains("hidden") 
                    ? "Читать дальше" 
                    : "Свернуть";
            });

            newsContainer.appendChild(newsItem);
        });

    } catch (error) {
        console.error("Ошибка загрузки новостей:", error);
        showError("Не удалось загрузить новости. Попробуйте обновить страницу.");
    }
}

/**
 * Фильтрует новости по категориям
 */
function filterNews(category) {
    const newsItems = document.querySelectorAll(".news-card");
    let visibleCount = 0;

    newsItems.forEach(item => {
        const shouldShow = category === "all" || item.dataset.category === category;
        item.style.display = shouldShow ? "block" : "none";
        if (shouldShow) visibleCount++;
    });

    // Показываем сообщение, если нет новостей в категории
    const newsContainer = document.getElementById("news-container");
    const emptyState = newsContainer.querySelector(".empty-state");
    
    if (visibleCount === 0) {
        if (!emptyState) {
            newsContainer.innerHTML = `
                <div class="empty-state">
                    <img src="webnews/assets/no-news.svg" alt="Нет новостей">
                    <h3>Новостей в этой категории нет</h3>
                    <p>Попробуйте выбрать другую категорию или зайдите позже</p>
                </div>
            `;
        }
    } else if (emptyState) {
        emptyState.remove();
    }
}

/**
 * Форматирует дату в читаемый вид
 */
function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
}

/**
 * Показывает сообщение об ошибке
 */
function showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
        </svg>
        <span>${message}</span>
    `;
    
    const container = document.getElementById("news-container") || document.body;
    container.prepend(errorElement);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        errorElement.classList.add("fade-out");
        setTimeout(() => errorElement.remove(), 300);
    }, 5000);
}

/**
 * Загружает навигационное меню
 */
async function loadNavbar() {
    try {
        const response = await fetch("webnews/nav/navbar.html");
        if (!response.ok) throw new Error("Ошибка загрузки навигации");

        const navbarContainer = document.getElementById("navbar-container");
        navbarContainer.innerHTML = await response.text();
        
        // Активируем текущую страницу в навигации
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
        
    } catch (error) {
        console.error("Ошибка при загрузке навигации:", error);
    }
}

/**
 * Настраивает обработчики формы
 */
function setupFormHandlers() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';

        try {
            await sendFormData(new FormData(form));
            showFormStatus("Сообщение успешно отправлено!", "success");
            form.reset();
        } catch (error) {
            showFormStatus(error.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

/**
 * Отправляет данные формы
 */
async function sendFormData(formData) {
    // Здесь должна быть ваша логика отправки данных
    // Например, через Telegram Bot API или на сервер
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // В реальном коде замените на реальный запрос:
    /*
    const response = await fetch('your-endpoint', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Ошибка отправки формы');
    }
    */
    
    return true;
}

/**
 * Показывает статус отправки формы
 */
function showFormStatus(message, type) {
    const statusElement = document.getElementById("form-status") || createStatusElement();
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
    
    setTimeout(() => {
        statusElement.classList.add("fade-out");
        setTimeout(() => statusElement.remove(), 300);
    }, 5000);
}

function createStatusElement() {
    const element = document.createElement("div");
    element.id = "form-status";
    document.getElementById("contact-form")?.appendChild(element);
    return element;
}

/**
 * Настраивает переключатель бета-теста
 */
function setupBetaTestToggle() {
    const betaTestCheckbox = document.getElementById("beta-test");
    const emailField = document.getElementById("email");
    
    if (!betaTestCheckbox || !emailField) return;

    betaTestCheckbox.addEventListener("change", function() {
        emailField.disabled = this.checked;
        emailField.required = !this.checked;
        
        if (this.checked) {
            showBetaTestInfo();
        }
    });
}

function showBetaTestInfo() {
    const infoBox = document.createElement("div");
    infoBox.className = "beta-info";
    infoBox.innerHTML = `
        <h4>Участие в бета-тестировании</h4>
        <p>Вы получите ранний доступ к новым функциям, но можете столкнуться с нестабильной работой системы.</p>
    `;
    
    const container = document.getElementById("beta-container") || 
                      document.getElementById("contact-form");
    container?.appendChild(infoBox);
}