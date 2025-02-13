document.addEventListener("DOMContentLoaded", function () {
    fetch("WebAudio/nav/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => console.error("Ошибка загрузки навбара:", error));
});
async function updateProgress() {
    const goalId = "8537706"; // ID цели из DonatAlerts
    const token = "jPYAJnq52a6YLlhdiUh2"; // Твой токен
    const url = `https://www.donationalerts.com/api/v1/goals/${goalId}?token=${token}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const goalAmount = data.goal.amount;
        const raisedAmount = data.raised_amount;
        const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);

        // Обновляем прогресс-бар
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progressPercentage)}%`;
    } catch (error) {
        console.error("Ошибка при получении данных: ", error);
    }
}

// Обновляем прогресс каждые 10 секунд
setInterval(updateProgress, 10000);
updateProgress(); // Для первоначальной загрузки