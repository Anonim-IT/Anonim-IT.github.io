// main.js

// Динамическая загрузка боковой панели
fetch('sidebar.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('sidebar').innerHTML = html;
  });

// Модальное окно
function showSettings() {
  document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settingsModal').style.display = 'none';
}
