// ============================================================
// ТЕКСТ ГИМНА РОССИЙСКОЙ ФЕДЕРАЦИИ
// Официальный текст с указанием авторов, исторической справкой и примечанием
// ============================================================
const anthemText = `
🇷🇺 Государственный гимн Российской Федерации

─────────────────────────────────────────
Музыка: А.В. Александров
Слова: С.В. Михалков
Утверждён: 30 декабря 2000 года
─────────────────────────────────────────

Россия — священная наша держава,
Россия — любимая наша страна.
Могучая воля, великая слава —
Твоё достоянье на все времена!

Славься, Отечество наше свободное,
Братских народов союз вековой,
Предками данная мудрость народная!
Славься, страна! Мы гордимся тобой!

От южных морей до полярного края
Раскинулись наши леса и поля.
Одна ты на свете! Одна ты такая —
Хранимая Богом родная земля!

Славься, Отечество наше свободное,
Братских народов союз вековой,
Предками данная мудрость народная!
Славься, страна! Мы гордимся тобой!

Широкий простор для мечты и для жизни
Грядущие нам открывают года.
Нам силу даёт наша верность Отчизне.
Так было, так есть и так будет всегда!

Славься, Отечество наше свободное,
Братских народов союз вековой,
Предками данная мудрость народная!
Славься, страна! Мы гордимся тобой!

─────────────────────────────────────────
📜 ИСТОРИЧЕСКАЯ СПРАВКА
─────────────────────────────────────────

Композитор:   Александр Васильевич Александров (1883–1946)
Поэт:         Сергей Владимирович Михалков (1913–2009)
Дата утверждения: 30 декабря 2000 года (Указ Президента РФ № 2125)
Первое исполнение: 1 января 2001 года

История создания:
Гимн Российской Федерации был утверждён в 2000 году.
Мелодия основана на музыке Государственного гимна СССР,
написанной Александровым в 1943 году.
Новый текст был создан Сергеем Михалковым,
который также был автором текста гимна СССР (1943–1991).
С 2001 года гимн исполняется во всех торжественных
мероприятиях государственного значения.

─────────────────────────────────────────
📌 ПРИМЕЧАНИЕ
─────────────────────────────────────────

При исполнении государственного гимна Российской Федерации
принято слушать его стоя.

Гимн является официальным государственным символом
наряду с флагом и гербом Российской Федерации.

Использование гимна регламентируется
Федеральным конституционным законом
"О Государственном гимне Российской Федерации"
от 25 декабря 2000 года № 3-ФКЗ.

Гимн обязательно исполняется:
• при вступлении в должность Президента РФ
• при открытии и закрытии заседаний Федерального Собрания
• во время официальных церемоний и государственных праздников
• при проведении воинских ритуалов
• при подъёме Государственного флага РФ
• на спортивных соревнованиях (при награждении)

При публичном исполнении гимна
допускается как полное, так и сокращённое исполнение
(только первый куплет и припев).

Гимн транслируется государственными телеканалами
в новогоднюю ночь после обращения Президента РФ,
а также в начале и в конце вещания.

🇷🇺
`;

// ============================================================
// ГИМН РФ (ЛОГИКА) — настроено для вмещения всего текста
// ============================================================
function playAnthem() {
    const modal = document.getElementById('licenseModal');
    const modalBody = document.querySelector('#licenseModal .modal-body');
    const originalContent = modalBody.innerHTML;
    
    // Увеличиваем максимальную высоту модального окна
    const modalContainer = modal.querySelector('.modal-content');
    if (modalContainer) {
        modalContainer.style.maxHeight = '85vh';
        modalContainer.style.overflowY = 'auto';
        modalContainer.style.padding = '1.5rem 2rem 2rem';
    }
    
    // Форматируем текст с правильными отступами и стилями
    modalBody.innerHTML = `
        <div style="
            white-space: pre-line; 
            font-family: 'Inter', 'JetBrains Mono', monospace; 
            line-height: 1.7; 
            text-align: left; 
            padding: 0.5rem 0.5rem 1rem 0.5rem;
            font-size: 0.85rem;
            color: #1a1a2e;
            max-height: 70vh;
            overflow-y: auto;
        ">
            ${anthemText}
        </div>
    `;
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    
    const closeHandler = () => {
        // Возвращаем оригинальное содержимое
        modalBody.innerHTML = originalContent;
        // Возвращаем стандартные стили модального окна
        if (modalContainer) {
            modalContainer.style.maxHeight = '';
            modalContainer.style.overflowY = '';
            modalContainer.style.padding = '';
        }
        modal.removeEventListener('click', closeHandler);
        document.querySelector('#licenseModal .close-modal').removeEventListener('click', closeHandler);
    };
    
    // Обработчик закрытия по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeHandler();
    });
    
    // Обработчик закрытия по кнопке ×
    document.querySelector('#licenseModal .close-modal').addEventListener('click', closeHandler);
    
    // Обработчик закрытия по клавише Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeHandler();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ============================================================
// ОСНОВНАЯ ЛОГИКА ПОРТАЛА
// ============================================================
let activeCategory = "Все";
let searchQuery = "";

function getUniqueCategories() {
    const catsSet = new Set(sitesData.map(s => s.category));
    return Array.from(catsSet).sort((a,b) => a.localeCompare(b));
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, m => (m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;')));
}

// ---- КАТЕГОРИИ ----
function renderCategories() {
    const cats = getUniqueCategories();
    const container = document.getElementById("categoryFilters");
    if (!container) return;
    
    let html = `<button class="cat-btn active" data-category="Все"><i class="fas fa-globe"></i> Все</button>`;
    cats.forEach(c => {
        html += `<button class="cat-btn" data-category="${escapeHtml(c)}"><i class="fas fa-tag"></i> ${escapeHtml(c)}</button>`;
    });
    container.innerHTML = html;
    
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.getAttribute("data-category");
            if (!cat) return;
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = cat;
            renderSites();
        });
    });
}

// ---- ФИЛЬТРАЦИЯ САЙТОВ ----
function getFilteredSites() {
    let res = [...sitesData];
    if (activeCategory !== "Все") res = res.filter(s => s.category === activeCategory);
    if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        res = res.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return res;
}

// ---- ОТРИСОВКА САЙТОВ ----
function renderSites() {
    const container = document.getElementById("sitesContainer");
    if (!container) {
        console.error('❌ Контейнер sitesContainer не найден!');
        return;
    }
    
    const filtered = getFilteredSites();
    console.log('🔍 Отфильтровано сайтов:', filtered.length);
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fas fa-map-pin"></i> <p>ресурсы не найдены // проверьте запрос</p></div>`;
        return;
    }
    
    let cards = "";
    filtered.forEach(site => {
        const safeName = escapeHtml(site.name);
        const safeDesc = escapeHtml(site.description);
        const safeUrl = escapeHtml(site.url);
        const safeCat = escapeHtml(site.category);
        const iconClass = site.icon || "fas fa-link";
        
        cards += `
            <div class="site-card" data-url="${safeUrl}">
                <div class="flag-mini">
                    <span class="mini-white"></span>
                    <span class="mini-blue"></span>
                    <span class="mini-red"></span>
                </div>
                <div class="card-header">
                    <div class="icon-bg"><i class="${iconClass}"></i></div>
                    <div class="card-title">
                        <h3>${safeName}</h3>
                        <span class="category-tag"><i class="fas fa-folder-open"></i> ${safeCat}</span>
                    </div>
                </div>
                <div class="site-description">${safeDesc}</div>
                <div class="site-url"><i class="fas fa-link"></i> ${safeUrl}</div>
                <div class="card-footer"><button class="visit-btn" data-url="${safeUrl}">ПЕРЕЙТИ <i class="fas fa-arrow-right"></i></button></div>
            </div>
        `;
    });
    container.innerHTML = cards;
    
    document.querySelectorAll(".visit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const url = btn.getAttribute("data-url");
            if (url) window.open(url, "_blank", "noopener,noreferrer");
        });
    });
    
    document.querySelectorAll(".site-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest('.visit-btn')) return;
            const url = card.getAttribute("data-url");
            if (url) window.open(url, "_blank", "noopener,noreferrer");
        });
    });
}

// ---- ПОИСК ----
function bindSearch() {
    const inp = document.getElementById("searchInput");
    if (inp) {
        inp.addEventListener("input", (e) => { 
            searchQuery = e.target.value; 
            renderSites(); 
        });
        console.log('✅ Поиск привязан');
    } else {
        console.error('❌ Поле searchInput не найдено!');
    }
}

// ---- МОДАЛЬНОЕ ОКНО ----
function initModal() {
    const modal = document.getElementById('licenseModal');
    const btn = document.getElementById('legalModalBtn');
    const closeSpan = document.querySelector('.close-modal');
    
    if (btn) {
        btn.onclick = () => modal.style.display = 'flex';
    } else {
        console.error('❌ Кнопка legalModalBtn не найдена!');
    }
    
    if (closeSpan) {
        closeSpan.onclick = () => modal.style.display = 'none';
    } else {
        console.error('❌ Кнопка close-modal не найдена!');
    }
    
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };
}

// ============================================================
// ЗАПУСК
// ============================================================
function start() {
    console.log('🚀 Запуск портала...');
    console.log('📦 Загружено сайтов:', sitesData ? sitesData.length : '❌ НЕТ ДАННЫХ');
    
    // ВСЕ ФУНКЦИИ УЖЕ ОПРЕДЕЛЕНЫ!
    renderCategories();
    renderSites();
    bindSearch();
    initModal();
    
    const anthemBtn = document.getElementById('anthemBtn');
    if (anthemBtn) {
        anthemBtn.addEventListener('click', playAnthem);
        console.log('✅ Кнопка гимна привязана');
    } else {
        console.error('❌ Кнопка anthemBtn не найдена!');
    }
}

// АВТОЗАПУСК
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}