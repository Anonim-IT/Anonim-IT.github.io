document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#housesTable tbody");
    const playerName = document.querySelector("#playerName");
    const coordX = document.querySelector("#coordX");
    const coordY = document.querySelector("#coordY");
    const coordZ = document.querySelector("#coordZ");
    const addButton = document.querySelector("#addHouse");

    // Загружаем сохранённые координаты из localStorage
    function loadHouses() {
        const savedHouses = JSON.parse(localStorage.getItem("houses")) || [];
        tableBody.innerHTML = ""; // Очищаем таблицу

        savedHouses.forEach((house, index) => {
            addHouseToTable(house.name, house.x, house.y, house.z, index);
        });
    }

    // Добавляем дом в таблицу
    function addHouseToTable(name, x, y, z, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${x}</td>
            <td>${y}</td>
            <td>${z}</td>
            <td><button class="delete-btn" data-index="${index}">Удалить</button></td>
        `;

        tableBody.appendChild(row);
    }

    // Сохранение координат дома
    function saveHouse(name, x, y, z) {
        const houses = JSON.parse(localStorage.getItem("houses")) || [];
        houses.push({ name, x, y, z });
        localStorage.setItem("houses", JSON.stringify(houses));
        loadHouses();
    }

    // Обработчик добавления дома
    addButton.addEventListener("click", function () {
        if (playerName.value && coordX.value && coordY.value && coordZ.value) {
            saveHouse(playerName.value, coordX.value, coordY.value, coordZ.value);
            playerName.value = "";
            coordX.value = "";
            coordY.value = "";
            coordZ.value = "";
        }
    });

    // Удаление дома
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            const houses = JSON.parse(localStorage.getItem("houses")) || [];
            houses.splice(index, 1);
            localStorage.setItem("houses", JSON.stringify(houses));
            loadHouses();
        }
    });

    // Загружаем дома при загрузке страницы
    loadHouses();
});
