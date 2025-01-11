// Функция для поиска участков
async function searchPlots() {
    const area = document.getElementById('area').value;
    const permittedUse = document.getElementById('permittedUse').value;
    const ownerType = document.getElementById('ownerType').value;
    const rentalStatus = document.getElementById('rentalStatus').value;

    const response = await fetch(`/Coursework/api/search.php?area=${area}&permitted_use=${permittedUse}&owner_type=${ownerType}&rental_status=${rentalStatus}`);
    const plots = await response.json();

    // Сохраняем данные в localStorage
    localStorage.setItem('plots', JSON.stringify(plots));
    console.log("Данные сохранены в localStorage:", plots);

    // Перенаправляем на results.html
    location.href = 'results.html';
}

// Функция для отображения результатов поиска
function displayResults() {
    const plots = JSON.parse(localStorage.getItem('plots'));
    console.log("Данные из localStorage:", plots); // Логирование данных

    if (!plots || !Array.isArray(plots)) {
        console.error("Данные об участках отсутствуют или имеют неверный формат.");
        return;
    }

    const tableBody = document.querySelector('#compareTable tbody');
    tableBody.innerHTML = ""; // Очистка таблицы перед заполнением

    plots.forEach(plot => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plot.FieldArea}</td>
            <td>${plot.Location}</td>
            <td>${plot.PermittedUse}</td>
            <td><button onclick="viewPlot(${plot.ID})">Подробнее</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для просмотра деталей участка
async function displayPlotDetails() {
    const id = localStorage.getItem('selectedPlotId');
    const response = await fetch(`/Coursework/api/plot.php?id=${id}`);
    const plot = await response.json();

    const plotDetails = document.getElementById('plotDetails');
    plotDetails.innerHTML = `
        <h2>Кадастровый номер: ${plot.CadastralNumber}</h2>
        <p>Площадь: ${plot.FieldArea}</p>
        <p>Тип собственника: ${plot.OwnerType}</p>
        <p>Статус аренды: ${plot.RentalStatus}</p>
        <p>Разрешенное использование: ${plot.PermittedUse}</p>
    `;
}

// Функция для регистрации пользователя
async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/Coursework/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.message) {
            alert(data.message);
            location.href = 'login.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при регистрации. Проверьте консоль для подробностей.');
    }
}

// Функция для входа в систему
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/Coursework/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.message) {
            alert(data.message);
            location.href = 'index.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при входе. Проверьте консоль для подробностей.');
    }
}

// Вызов функций при загрузке страниц
if (window.location.pathname.endsWith('results.html')) {
    displayResults();
}

if (window.location.pathname.endsWith('plot.html')) {
    displayPlotDetails();
}