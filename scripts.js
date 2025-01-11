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
    console.log("Данные из localStorage:", plots);

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
            <td>${plot.PermittedUse}</td>
            <td>${plot.RentalStatus}</td>
            <td><button onclick="viewPlot(${plot.ID})">Подробнее</button></td>
        `;
        tableBody.appendChild(row);
    });
}
function viewPlot(id) {
    // Сохраняем ID выбранного участка в localStorage
    localStorage.setItem('selectedPlotId', id);
    console.log("Выбран участок с ID:", id);

    // Перенаправляем на страницу plot.html
    location.href = 'plot.html';
}

// Функция для просмотра деталей участка
async function displayPlotDetails() {
    const id = localStorage.getItem('selectedPlotId');
    if (!id) {
        console.error("ID участка не найден в localStorage.");
        return;
    }

    try {
        const response = await fetch(`/Coursework/api/plot.php?id=${id}`);
        const plot = await response.json();

        const plotDetails = document.getElementById('plotDetails');
        plotDetails.innerHTML = `
    <h2>Кадастровый номер: ${plot.CadastralNumber}</h2>
    <p>Площадь: ${plot.FieldArea}</p>
    <p>Местоположение: <span data-address="${plot.Location}">${plot.Location}</span></p>
    <p>Тип собственника: ${plot.OwnerType}</p>
    <p>Статус аренды: ${plot.RentalStatus}</p>
    <p>Разрешенное использование: ${plot.PermittedUse}</p>
`;
    } catch (error) {
        console.error("Ошибка при загрузке данных об участке:", error);
    }
}

// Функция для регистрации пользователя
async function register() {
    const username = document.getElementById('username').value.trim(); 
    const password = document.getElementById('password').value.trim();

    // Проверка на пустые значения
    if (!username || !password) {
        alert("Логин и пароль не могут быть пустыми!");
        return; 
    }

    if (username.length < 4 || password.length < 4) {
        alert("Логин и пароль должны содержать не менее 4 символов!");
        return;
    }

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
            localStorage.setItem('isLoggedIn', 'true'); // Сохраняем информацию о том, что пользователь авторизован
            location.href = 'index.html'; // Перенаправляем на главную страницу
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при входе. Проверьте консоль для подробностей.');
    }
}

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('isLoggedIn'); // Удаляем информацию о том, что пользователь авторизован
    location.href = 'index.html';
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const searchButtonContainer = document.getElementById('searchButtonContainer');
    const logoutButton = document.getElementById('logoutButton');

    if (isLoggedIn === 'true') {
        searchButtonContainer.innerHTML = `<button onclick="location.href='search.html'">Начните поиск участка прямо сейчас</button>`;
        logoutButton.style.display = 'block'; // показать кнопку выхода
    } else {
        searchButtonContainer.innerHTML = `<p>Авторизируйтесь, чтобы начать поиск</p>`;
        logoutButton.style.display = 'none'; // скрыть
    }
}

function checkAuthForExit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // проверка авторизован ли пользователь
    const logoutButton = document.getElementById('logoutButton');

    if (isLoggedIn === 'true') {
        logoutButton.style.display = 'block'; // показать кнопку выхода
    } else {
        logoutButton.style.display = 'none'; // скрыть
    }
}

// Функция для отображения таблицы с результатами поиска
function showComparisonTable() {
    const container = document.getElementById('comparisonTableContainer');
    container.style.display = 'block';

    // Получаем текущий ID участка
    const currentPlotId = localStorage.getItem('selectedPlotId');
    console.log("Текущий ID участка:", currentPlotId);

    // Получаем все участки из localStorage
    const plots = JSON.parse(localStorage.getItem('plots'));
    console.log("Все участки из localStorage:", plots);

    // Фильтруем участки, исключая текущий
    const filteredPlots = plots.filter(plot => plot.ID != currentPlotId);
    console.log("Отфильтрованные участки:", filteredPlots);

    // Отображаем отфильтрованные участки в таблице
    const tableBody = document.querySelector('#compareTable tbody');
    tableBody.innerHTML = ""; // Очистка таблицы перед заполнением

    if (filteredPlots.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">Нет доступных участков для сравнения</td></tr>`;
        return;
    }

    filteredPlots.forEach(plot => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="radio" name="selectedPlot" value="${plot.ID}"></td>
            <td>${plot.FieldArea}</td>
            <td>${plot.Location}</td>
            <td>${plot.PermittedUse}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция для сравнения выбранного участка с текущим
function comparePlots() {
    const selectedPlotId = document.querySelector('input[name="selectedPlot"]:checked').value;
    const currentPlotId = localStorage.getItem('selectedPlotId');

    if (!selectedPlotId || !currentPlotId) {
        alert("Пожалуйста, выберите участок для сравнения.");
        return;
    }

    // Сохраняем ID участков для сравнения в localStorage
    localStorage.setItem('comparePlotIds', JSON.stringify([currentPlotId, selectedPlotId]));

    // Перенаправляем на страницу сравнения
    location.href = 'compare.html';
}

// Функция для отображения сравнения двух участков
async function displayComparison() {
    const plotIds = JSON.parse(localStorage.getItem('comparePlotIds'));
    if (!plotIds || plotIds.length !== 2) {
        console.error("Недостаточно данных для сравнения.");
        return;
    }

    const [plot1Id, plot2Id] = plotIds;

    try {
        const response1 = await fetch(`/Coursework/api/plot.php?id=${plot1Id}`);
        const plot1 = await response1.json();

        const response2 = await fetch(`/Coursework/api/plot.php?id=${plot2Id}`);
        const plot2 = await response2.json();

        const tableBody = document.querySelector('#compareTable tbody');
        tableBody.innerHTML = `
            <tr>
                <td>Площадь</td>
                <td>${plot1.FieldArea}</td>
                <td>${plot2.FieldArea}</td>
            </tr>
            <tr>
                <td>Местоположение</td>
                <td>${plot1.Location}</td>
                <td>${plot2.Location}</td>
            </tr>
            <tr>
                <td>Разрешенное использование</td>
                <td>${plot1.PermittedUse}</td>
                <td>${plot2.PermittedUse}</td>
            </tr>
            <tr>
                <td>Тип собственника</td>
                <td>${plot1.OwnerType}</td>
                <td>${plot2.OwnerType}</td>
            </tr>
            <tr>
                <td>Статус аренды</td>
                <td>${plot1.RentalStatus}</td>
                <td>${plot2.RentalStatus}</td>
            </tr>
        `;
    } catch (error) {
        console.error("Ошибка при загрузке данных для сравнения:", error);
    }
}

function viewOnMap() {
    console.log("Функция viewOnMap вызвана"); 

    const plotDetails = document.getElementById('plotDetails');
    const addressElement = plotDetails.querySelector('span[data-address]'); //поиск span с data-address
    const rawAddress = addressElement ? addressElement.textContent : null;

    if (!rawAddress) {
        alert("Адрес участка не найден.");
        return;
    }

    // Очищаем адрес
    const address = cleanAddress(rawAddress);
    console.log("Очищенный адрес участка:", address);

    // Показать контейнер для карты
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.style.display = 'block';

    // Инициализация карты после геокодирования
    ymaps.ready(() => {
        console.log("Яндекс.Карты загружены"); 

        // Геокодирование адреса
        ymaps.geocode(address, { results: 1 }).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                console.log("Адрес найден на карте:", firstGeoObject);

                // Получаем координаты адреса
                const coordinates = firstGeoObject.geometry.getCoordinates();

                // Инициализация карты с центром на координатах участка
                const map = new ymaps.Map(mapContainer, {
                    center: coordinates, // Центр карты на координатах участка
                    zoom: 10, // Увеличить масштаб для лучшего обзора
                });

                // Добавить маркер на карту
                const marker = new ymaps.Placemark(coordinates, {
                    hintContent: address, // Подсказка при наведении
                    balloonContent: address, // Текст 
                });

                map.geoObjects.add(marker);
            } else {
                console.error("Адрес не найден на карте"); 
                alert("Не удалось найти адрес на карте.");
            }
        }).catch((error) => {
            console.error("Ошибка при геокодировании:", error); 
            alert("Ошибка при поиске адреса на карте. Проверьте консоль для подробностей.");
        });
    });
}

function cleanAddress(address) {
    // Убираем скобки, лишние пробелы и запятые
    return address
        .replace(/[()]/g, '') // Убрать скобки
        .replace(/,+/g, ',') // Заменить множественные запятые на одну
        .replace(/\s+/g, ' ') // Убрать лишние пробелы
        .trim(); // Убрать пробелы в начале и конце
}

// Вызов функций при загрузке страниц
if (window.location.pathname.endsWith('results.html')) {
    displayResults();
}

if (window.location.pathname.endsWith('plot.html')) {
    displayPlotDetails();
}