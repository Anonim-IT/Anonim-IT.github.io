document.addEventListener("DOMContentLoaded", function () {
    // Загружаем сохраненные данные
    const elements = document.querySelectorAll("[contenteditable='true']");
    elements.forEach((el, index) => {
        const savedText = localStorage.getItem("editable_" + index);
        if (savedText) {
            el.innerHTML = savedText;
        }

        // Сохраняем изменения при вводе
        el.addEventListener("input", () => {
            localStorage.setItem("editable_" + index, el.innerHTML);
        });
    });

    // Обработка загрузки изображений
    const fileInput = document.getElementById("file-input");
    const gallery = document.getElementById("gallery");

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("gallery-img");
                gallery.appendChild(img);
                saveGallery();
            };
            reader.readAsDataURL(file);
        }
    });

    // Функция сохранения галереи в localStorage
    function saveGallery() {
        const images = [];
        document.querySelectorAll(".gallery-img").forEach((img) => {
            images.push(img.src);
        });
        localStorage.setItem("gallery", JSON.stringify(images));
    }

    // Загрузка изображений из localStorage
    function loadGallery() {
        const images = JSON.parse(localStorage.getItem("gallery")) || [];
        images.forEach((src) => {
            const img = document.createElement("img");
            img.src = src;
            img.classList.add("gallery-img");
            gallery.appendChild(img);
        });
    }
    loadGallery();

    // Кнопка сохранения всех изменений
    document.getElementById("save-btn").addEventListener("click", function () {
        alert("Изменения сохранены!");
    });
});
