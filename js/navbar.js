        // Загрузка навигационного меню
        document.addEventListener('DOMContentLoaded', function() {
            fetch('nav/navbarminecraft.html') // Убедитесь, что файл navbar.html существует и доступен по указанному пути
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке навигационной панели');
                    }
                    return response.text();
                })
                .then(data => {
                    document.getElementById('navbar').innerHTML = data;
                })
                .catch(error => {
                    console.error('Ошибка при загрузке навигационной панели:', error);
                });
        });