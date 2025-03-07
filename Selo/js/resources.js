document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#resourcesTable tbody");
    const resourceName = document.querySelector("#resourceName");
    const resourceAmount = document.querySelector("#resourceAmount");
    const resourcePurpose = document.querySelector("#resourcePurpose"); // Новое поле
    const resourcePlayer = document.querySelector("#resourcePlayer");
    const addButton = document.querySelector("#addResource");

    // Загружаем сохранённые ресурсы из localStorage
    function loadResources() {
        const savedResources = JSON.parse(localStorage.getItem("resources")) || [];
        tableBody.innerHTML = ""; // Очищаем таблицу

        savedResources.forEach((resource, index) => {
            addResourceToTable(resource.name, resource.amount, resource.player, resource.purpose, index);
        });
    }

    // Добавляем ресурс в таблицу
    function addResourceToTable(name, amount, player, purpose, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${amount}</td>
            <td>${purpose}</td> <!-- Новое поле в таблице -->
            <td>${player}</td>
            <td><button class="delete-btn" data-index="${index}">Удалить</button></td>
        `;

        tableBody.appendChild(row);
    }

    // Сохранение ресурса
    function saveResource(name, amount, purpose, player) {
        const resources = JSON.parse(localStorage.getItem("resources")) || [];
        resources.push({ name, amount, purpose, player }); // Добавлено поле purpose
        localStorage.setItem("resources", JSON.stringify(resources));
        loadResources();
    }

    // Обработчик добавления ресурса
    addButton.addEventListener("click", function () {
        if (resourceName.value && resourceAmount.value && resourcePurpose.value && resourcePlayer.value) {
            saveResource(resourceName.value, resourceAmount.value, resourcePurpose.value, resourcePlayer.value);
            resourceName.value = "";
            resourceAmount.value = "";
            resourcePurpose.value = ""; // Очищаем поле после добавления
            resourcePlayer.value = "";
        }
    });

    // Удаление ресурса
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            const resources = JSON.parse(localStorage.getItem("resources")) || [];
            resources.splice(index, 1);
            localStorage.setItem("resources", JSON.stringify(resources));
            loadResources();
        }
    });

    // Загружаем ресурсы при загрузке страницы
    loadResources();
});
