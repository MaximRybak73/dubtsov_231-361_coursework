// Функция для поиска участков
async function searchPlots() {
    const area = document.getElementById('area').value;
    const permittedUse = document.getElementById('permittedUse').value;
    const ownerType = document.getElementById('ownerType').value;
    const rentalStatus = document.getElementById('rentalStatus').value;

    const response = await fetch(`api/search.php?area=${area}&permitted_use=${permittedUse}&owner_type=${ownerType}&rental_status=${rentalStatus}`);
    const plots = await response.json();

    localStorage.setItem('plots', JSON.stringify(plots));
    location.href = 'results.html';
}

// Функция для отображения результатов поиска
function displayResults() {
    const plots = JSON.parse(localStorage.getItem('plots'));
    const tableBody = document.querySelector('#compareTable tbody');

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
    const response = await fetch(`api/plot.php?id=${id}`);
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

    const response = await fetch('/api/register.php', {
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
}

// Функция для входа в систему
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login.php', {
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
    }
}

// Вызов функций при загрузке страниц
if (window.location.pathname.endsWith('results.html')) {
    displayResults();
}

if (window.location.pathname.endsWith('plot.html')) {
    displayPlotDetails();
}