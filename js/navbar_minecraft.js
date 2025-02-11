        // Загрузка навигационной панели
        function loadNavbar() {
            fetch('nav/navbarminecraft.html')
                .then(response => {
                    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                    return response.text();
                })
                .then(html => document.getElementById('navbar').innerHTML = html)
                .catch(error => console.error('Ошибка загрузки меню:', error));
        }