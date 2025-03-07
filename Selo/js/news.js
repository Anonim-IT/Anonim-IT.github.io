document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const addNewsBtn = document.getElementById("add-news-btn");
    const newsTitleInput = document.getElementById("news-title");
    const newsContentInput = document.getElementById("news-content");

    // Функция загрузки новостей из localStorage
    function loadNews() {
        const newsList = JSON.parse(localStorage.getItem("news")) || [];
        newsContainer.innerHTML = ""; // Очищаем контейнер перед загрузкой

        newsList.forEach((news, index) => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");

            newsItem.innerHTML = `
                <h2 contenteditable="true">${news.title}</h2>
                <p contenteditable="true">${news.content}</p>
                <button class="delete-news" data-index="${index}">🗑 Удалить</button>
            `;

            // Обработчик удаления новости
            newsItem.querySelector(".delete-news").addEventListener("click", function () {
                deleteNews(index);
            });

            // Сохранение изменений при редактировании
            newsItem.querySelector("h2").addEventListener("input", function () {
                updateNews(index, "title", this.innerText);
            });

            newsItem.querySelector("p").addEventListener("input", function () {
                updateNews(index, "content", this.innerText);
            });

            newsContainer.appendChild(newsItem);
        });
    }

    // Функция добавления новости
    function addNews() {
        const title = newsTitleInput.value.trim();
        const content = newsContentInput.value.trim();

        if (title && content) {
            const newsList = JSON.parse(localStorage.getItem("news")) || [];
            newsList.push({ title, content });
            localStorage.setItem("news", JSON.stringify(newsList));

            // Очищаем поля ввода
            newsTitleInput.value = "";
            newsContentInput.value = "";

            // Обновляем новости
            loadNews();
        } else {
            alert("Заполните оба поля!");
        }
    }

    // Функция обновления новости при редактировании
    function updateNews(index, field, value) {
        const newsList = JSON.parse(localStorage.getItem("news")) || [];
        newsList[index][field] = value;
        localStorage.setItem("news", JSON.stringify(newsList));
    }

    // Функция удаления новости
    function deleteNews(index) {
        const newsList = JSON.parse(localStorage.getItem("news")) || [];
        newsList.splice(index, 1);
        localStorage.setItem("news", JSON.stringify(newsList));
        loadNews();
    }

    // Обработчик на кнопку добавления новости
    addNewsBtn.addEventListener("click", addNews);

    // Загружаем новости при загрузке страницы
    loadNews();
});
