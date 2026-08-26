// ============================================================
// БАЗА ДАННЫХ САЙТОВ (полностью редактируемая)
// ============================================================
const sitesData = [
    // --- РАЗРАБОТКА ---
    { id: 1, name: "GitHub", url: "https://github.com", description: "Репозитории, open-source, совместный код.", category: "Разработка", icon: "fab fa-github" },
    { id: 2, name: "Stack Overflow", url: "https://stackoverflow.com", description: "Решение проблем кода.", category: "Разработка", icon: "fab fa-stack-overflow" },
    { id: 3, name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Документация веб-технологий.", category: "Разработка", icon: "fab fa-firefox" },
    
    // --- ДИЗАЙН ---
    { id: 4, name: "Figma", url: "https://figma.com", description: "Дизайн интерфейсов и прототипирование.", category: "Дизайн", icon: "fab fa-figma" },
    { id: 5, name: "Dribbble", url: "https://dribbble.com", description: "Вдохновение и UI/UX.", category: "Дизайн", icon: "fab fa-dribbble" },
    { id: 6, name: "Canva", url: "https://canva.com", description: "Графический редактор.", category: "Дизайн", icon: "fas fa-palette" },
    
    // --- ПРОДУКТИВНОСТЬ ---
    { id: 7, name: "Notion", url: "https://notion.so", description: "База знаний, документация, планирование.", category: "Продуктивность", icon: "fas fa-brain" },
    { id: 8, name: "Trello", url: "https://trello.com", description: "Канбан-доски и задачи.", category: "Продуктивность", icon: "fab fa-trello" },
    { id: 9, name: "Gmail", url: "https://mail.google.com", description: "Почта и календарь.", category: "Продуктивность", icon: "fas fa-envelope" },
    { id: 10, name: "Linear", url: "https://linear.app", description: "Трекинг задач.", category: "Продуктивность", icon: "fas fa-chart-line" },
    { id: 11, name: "Google Sheets (HW)", url: "https://docs.google.com/spreadsheets/d/1_9d6mV9sQcAZmm6YisB22h12hYO7qOU0aY3t0J79bUY/edit", description: "Таблица проектов.", category: "Продуктивность", icon: "fas fa-table" },
    
    // --- МЕДИА ---
    { id: 12, name: "YouTube", url: "https://youtube.com", description: "Видео-контент, уроки, развлечения.", category: "Медиа", icon: "fab fa-youtube" },
    { id: 13, name: "Spotify", url: "https://spotify.com", description: "Музыка, подкасты, фон.", category: "Медиа", icon: "fab fa-spotify" },
    { id: 14, name: "Netflix", url: "https://netflix.com", description: "Кино и сериалы.", category: "Медиа", icon: "fab fa-netflix" },
    { id: 15, name: "Twitch HW_RS", url: "https://www.twitch.tv/hw_rs", description: "Стримы.", category: "Медиа", icon: "fab fa-twitch" },
    { id: 16, name: "Rutube", url: "https://rutube.ru/", description: "Видеоплатформа.", category: "Медиа", icon: "fas fa-video" },
    
    // --- ИНСТРУМЕНТЫ ---
    { id: 17, name: "ChatGPT", url: "https://chat.openai.com", description: "AI-помощник.", category: "Инструменты", icon: "fas fa-robot" },
    { id: 18, name: "DeepSeek Chat", url: "https://chat.deepseek.com/", description: "AI ассистент.", category: "Инструменты", icon: "fas fa-comments" },
    { id: 19, name: "Google Translate", url: "https://translate.google.ru/", description: "Переводчик.", category: "Инструменты", icon: "fas fa-language" },
    { id: 20, name: "HWHellBlock", url: "https://anonim-it.github.io/HWHellBlock.html", description: "Страница проекта HWHellBlock.", category: "Инструменты", icon: "fas fa-shield-haltered" },
    { id: 21, name: "HWPro OS", url: "https://anonim-it.github.io/HWPro_OS.html", description: "HWPro OS страница.", category: "Инструменты", icon: "fas fa-microchip" },
    
    // --- СООБЩЕСТВА ---
    { id: 22, name: "HW Protection VK", url: "https://vk.com/hw_protection", description: "Сообщество VK, посвящённое HW Protection.", category: "Сообщества", icon: "fab fa-vk" },
    { id: 23, name: "Reddit HW Hell Block", url: "https://www.reddit.com/r/HW_Hell_Block/", description: "Сабреддит.", category: "Сообщества", icon: "fab fa-reddit-alien" },
    { id: 24, name: "Dzen | Anonim Community", url: "https://dzen.ru/anonimcommunity?clid=1400", description: "Канал проекта на Dzen.", category: "Сообщества", icon: "fab fa-yandex" },
    
    // --- ХОСТИНГ ---
    { id: 25, name: "Timeweb Cloud", url: "https://timeweb.cloud/my/projects/2255557", description: "Панель хостинга.", category: "Хостинг", icon: "fas fa-cloud-upload-alt" },
    
    // --- ПОКУПКИ ---
    { id: 26, name: "Ozon", url: "https://www.ozon.ru/", description: "Маркетплейс.", category: "Покупки", icon: "fas fa-shopping-bag" },
    
    // --- ПОИСК ---
    { id: 27, name: "Яндекс", url: "https://yandex.ru", description: "Портал Яндекса.", category: "Поиск", icon: "fab fa-yandex" },
    
    // --- МЕССЕНДЖЕРЫ ---
    { id: 28, name: "MAX Мессенджер", url: "https://web.max.ru/", description: "Защищённый мессенджер.", category: "Мессенджеры", icon: "fas fa-comment-dots" },
    { id: 29, name: "Lolka | Вход", url: "https://lolka.app/login", description: "Страница входа в сервис Lolka.", category: "Сервисы", icon: "fas fa-sign-in-alt" },
    
    // --- КАРТЫ ---
    { id: 30, name: "Карта Мира | portal-gorod", url: "https://map.cmirit.ru/portal-gorod/", description: "Интерактивная карта с порталами городов.", category: "Карты", icon: "fas fa-map-marked-alt" },

];

// Проверка загрузки данных
console.log('✅ База данных сайтов загружена. Количество сайтов:', sitesData.length);