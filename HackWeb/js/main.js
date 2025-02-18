        // Загрузка навигационного меню
        fetch('HackWeb/nav/navbar_hack.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar-container').innerHTML = data;
            })
            .catch(error => {
                console.error('Ошибка при загрузке навигационной панели:', error);
            });
  
        // Получаем элементы меню
        const menuToggle = document.querySelector('.menu-toggle');
        const menuList = document.querySelector('.menu-list');
  
        // Обработчик клика для открытия и закрытия меню
        menuToggle.addEventListener('click', () => {
          menuList.classList.toggle('open'); // Переключаем класс 'open' для отображения/скрытия меню
        });