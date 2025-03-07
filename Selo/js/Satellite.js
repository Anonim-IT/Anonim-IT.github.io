        // Инициализация списка выпусков
        let issueList = [];

        // Функция для отображения списка выпусков
        function displayIssues() {
            const issueContainer = document.getElementById('issue-list');
            issueContainer.innerHTML = ''; // Очищаем список

            issueList.forEach((issue, index) => {
                const issueItem = document.createElement('div');
                issueItem.classList.add('issue-item');
                issueItem.innerHTML = `
                    <h3>Выпуск #${index + 1}: ${issue.title}</h3>
                    <p>${issue.text}</p>
                `;
                issueContainer.appendChild(issueItem);
            });
        }

        // Обработчик для добавления нового выпуска
        document.getElementById('add-issue-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Останавливаем стандартное поведение формы

            const title = document.getElementById('issue-title').value;
            const text = document.getElementById('issue-text').value;

            // Добавляем новый выпуск в массив
            issueList.push({ title, text });

            // Обновляем список выпусков
            displayIssues();

            // Очищаем форму после добавления
            document.getElementById('issue-title').value = '';
            document.getElementById('issue-text').value = '';
        });

        // Изначально отображаем все выпуски
        displayIssues();