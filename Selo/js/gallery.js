document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("gallery-container");
    const imageInput = document.getElementById("image-input");
    const uploadBtn = document.getElementById("upload-btn");

    // Функция загрузки изображений из localStorage
    function loadGallery() {
        const images = JSON.parse(localStorage.getItem("gallery")) || [];
        galleryContainer.innerHTML = ""; // Очищаем контейнер перед загрузкой

        images.forEach((imageData, index) => {
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("gallery-item");

            imgWrapper.innerHTML = `
                <img src="${imageData}" alt="Фото Северной Долины">
                <button class="delete-image" data-index="${index}">🗑 Удалить</button>
            `;

            // Обработчик удаления изображения
            imgWrapper.querySelector(".delete-image").addEventListener("click", function () {
                deleteImage(index);
            });

            galleryContainer.appendChild(imgWrapper);
        });
    }

    // Функция загрузки нового изображения
    function uploadImage() {
        const file = imageInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const images = JSON.parse(localStorage.getItem("gallery")) || [];
                images.push(event.target.result);
                localStorage.setItem("gallery", JSON.stringify(images));

                loadGallery(); // Обновляем галерею
            };

            reader.readAsDataURL(file);
        } else {
            alert("Выберите изображение!");
        }
    }

    // Функция удаления изображения
    function deleteImage(index) {
        const images = JSON.parse(localStorage.getItem("gallery")) || [];
        images.splice(index, 1);
        localStorage.setItem("gallery", JSON.stringify(images));
        loadGallery();
    }

    // Обработчик кнопки загрузки
    uploadBtn.addEventListener("click", uploadImage);

    // Загружаем галерею при загрузке страницы
    loadGallery();
});
