// Функция для поиска участков
async function searchPlots() {
    const areaMin = document.getElementById('areaMin').value || null;
    const areaMax = document.getElementById('areaMax').value || null;
    const permittedUse = document.getElementById('permittedUse').value || null;
    const ownerType = document.getElementById('ownerType').value || null;
    const rentalStatus = document.getElementById('rentalStatus').value || null;

    // Формирование URL с параметрами
    const params = new URLSearchParams();
    if (areaMin !== null) params.append('areaMin', areaMin);
    if (areaMax !== null) params.append('areaMax', areaMax);
    if (permittedUse !== null) params.append('permitted_use', permittedUse);
    if (ownerType !== null) params.append('owner_type', ownerType);
    if (rentalStatus !== null) params.append('rental_status', rentalStatus);

    try {
        const response = await fetch(`search.php?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
        }
        const plots = await response.json();
        console.log("Данные получены:", plots);

        // Сохрантиь данные в localStorage
        localStorage.setItem('plots', JSON.stringify(plots));
        location.href = 'results.html';
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
    }
}
// Функция для отображения результатов поиска
function displayResults() {
    const plots = JSON.parse(localStorage.getItem('plots'));
    console.log("Данные из localStorage:", plots);

    const tableBody = document.querySelector('#compareTable tbody');
    tableBody.innerHTML = ""; // Очистка таблицы перед заполнением

    if (!plots || !Array.isArray(plots) || plots.length === 0) {
        // Если данные отсутствуют или массив пуст
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="4" style="text-align: center;">Не найдены подходящие участки</td>
        `;
        tableBody.appendChild(row);
        return;
    }

    // Если участки найдены
    plots.forEach(plot => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plot.FieldArea}</td>
            <td>${plot.PermittedUse}</td>
            <td>${plot.RentalStatus}</td>
            <td><button class="tablebuttons" onclick="viewPlot(${plot.ID})">Подробнее</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function viewPlot(id) {
    // Сохранить ID выбранного участка в localStorage
    localStorage.setItem('selectedPlotId', id);
    console.log("Выбран участок с ID:", id);

    location.href = 'plot.html';
}

function viewPlotFav(id) {
    // Сохранить ID выбранного участка в localStorage
    localStorage.setItem('selectedPlotId', id);
    console.log("Выбран участок с ID:", id);

    location.href = 'plotInFavourite.html';
}
// Функция для просмотра деталей участка
async function displayPlotDetails() {
    const id = localStorage.getItem('selectedPlotId');
    if (!id) {
        console.error("ID участка не найден в localStorage.");
        return;
    }

    try {
        const response = await fetch(`plot.php?id=${id}`);
        const plot = await response.json();

        const plotDetails = document.getElementById('plotDetails');
        plotDetails.innerHTML = `
        <h2>Кадастровый номер: ${plot.CadastralNumber}</h2>
        <p>Площадь: ${plot.FieldArea}</p>
        <p>Местоположение: <span data-address="${plot.Location}">${plot.Location}</span></p>
        <p>Тип собственника: ${plot.OwnerType}</p>
        <p>Статус аренды: ${plot.RentalStatus}</p>
        <p>Разрешенное использование: ${plot.PermittedUse}</p>`;
    } catch (error) {
        console.error("Ошибка при загрузке данных об участке:", error);
    }
}

// Функция для регистрации пользователя
async function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Логин и пароль не могут быть пустыми!");
        return;
    }

    if (username.length < 4 || password.length < 4) {
        alert("Логин и пароль должны содержать не менее 4 символов!");
        return;
    }

    try {
        const response = await fetch('register.php', {
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
        const response = await fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.message) {
            alert(data.message);
            localStorage.setItem('isLoggedIn', 'true'); // Сохранить информацию о том, что пользователь авторизован
            localStorage.setItem('username', username); // Сохранить имя пользователя
            location.href = 'index.html';
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
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('username'); 
    location.href = 'index.html';
}


function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const searchButtonContainer = document.getElementById('searchButtonContainer');
    const FavButtonContainer = document.getElementById('favButtonContainer');
    const logoutButton = document.getElementById('logoutButton');

    if (isLoggedIn === 'true') {
        searchButtonContainer.innerHTML = `<button class="mainbuttons" onclick="location.href='search.html'">Начните поиск участка сейчас</button>`;
        FavButtonContainer.innerHTML = `<button class="mainbuttons"
         style="margin-top:10px" onclick="location.href='favourites.html'">Избранные участки</button>`
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


let tableInitialized = false; // Флаг для отслеживания инициализации таблицы

function showComparisonTable() {
    if (tableInitialized) return; // Если таблица уже инициализирована то выйти

    const currentPlotId = localStorage.getItem('selectedPlotId');
    const plots = JSON.parse(localStorage.getItem('plots'));
    const filteredPlots = plots.filter(plot => plot.ID != currentPlotId);

    const tableBody = document.querySelector('#compareTable tbody');
    tableBody.innerHTML = "";

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

    tableInitialized = true; // Установить флаг, что таблица инициализирована
}

let isComparisonTableVisible = false; // для отслеживания состояния таблицы

function toggleComparisonTable() {
    const comparisonTableContainer = document.getElementById('comparisonTableContainer');
    isComparisonTableVisible = !isComparisonTableVisible; // изменить состояние на противоположное

    if (isComparisonTableVisible) {
        comparisonTableContainer.style.display = 'block'; // показать таблицу
        showComparisonTable(); // Загрузить данные в таблицу
    } else {
        comparisonTableContainer.style.display = 'none'; // Скрыть таблицу
    }
}

// Функция для сравнения выбранного участка с текущим
function comparePlots() {
    const selectedPlotId = document.querySelector('input[name="selectedPlot"]:checked').value;
    const currentPlotId = localStorage.getItem('selectedPlotId');

    if (!selectedPlotId || !currentPlotId) {
        alert("Пожалуйста, выберите участок для сравнения.");
        return;
    }

    localStorage.setItem('comparePlotIds', JSON.stringify([currentPlotId, selectedPlotId]));

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
        const response1 = await fetch(`plot.php?id=${plot1Id}`);
        const plot1 = await response1.json();

        const response2 = await fetch(`plot.php?id=${plot2Id}`);
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

let mapInitialized = false; // Флаг для отслеживания инициализации карты

function viewOnMap() {
    if (mapInitialized) return; // Если карта уже инициализирована, выйти

    console.log("Функция viewOnMap вызвана");

    const plotDetails = document.getElementById('plotDetails');
    const addressElement = plotDetails.querySelector('span[data-address]');
    const rawAddress = addressElement ? addressElement.textContent : null;

    if (!rawAddress) {
        alert("Адрес участка не найден.");
        return;
    }

    const address = cleanAddress(rawAddress);
    console.log("Очищенный адрес участка:", address);

    ymaps.ready(() => {
        console.log("Яндекс.Карты загружены");

        ymaps.geocode(address, { results: 1 }).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
                console.log("Адрес найден на карте:", firstGeoObject);

                const coordinates = firstGeoObject.geometry.getCoordinates();
                const map = new ymaps.Map('mapContainer', {
                    center: coordinates,
                    zoom: 10,
                });

                const marker = new ymaps.Placemark(coordinates, {
                    hintContent: address,
                    balloonContent: address,
                });

                map.geoObjects.add(marker);
                mapInitialized = true; // флаг, что карта инициализирована
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

let isMapVisible = false; // Флаг для отслеживания состояния карты

function toggleMap() {
    const mapContainer = document.getElementById('mapContainer');
    isMapVisible = !isMapVisible; // изменить состояние на противоположное

    if (isMapVisible) {
        mapContainer.style.display = 'block'; // показать карту
        viewOnMap(); // инициализировать карту
    } else {
        mapContainer.style.display = 'none'; // Скрыть карту
    }
}

function cleanAddress(address) {
    return address
        .replace(/[()]/g, '') // Убрать скобки
        .replace(/,+/g, ',') // Заменить множественные запятые на одну
        .replace(/\s+/g, ' ') // Убрать лишние пробелы
        .trim(); // Убрать пробелы в начале и конце
}

async function addToFavorites() {
    const plotId = localStorage.getItem('selectedPlotId');

    if (!plotId) {
        alert("ID участка не найден.");
        return;
    }

    try {
        const response = await fetch('add_favourite.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // указание, что отправляем JSON
            body: JSON.stringify({ plot_id: plotId }) // отправка данных в формате JSON
        });

        const text = await response.text();
        console.log("Ответ сервера:", text);

        const data = JSON.parse(text); //распарсить ответ как JSON
        if (data.message) {
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении в избранное.');
    }
}

async function displayFavorites() {
    try {
        const response = await fetch('get_favourites.php');
        const favorites = await response.json();

        const tableBody = document.querySelector('#favoritesTable tbody');
        tableBody.innerHTML = ""; // Очистка таблицы перед заполнением

        if (favorites.length === 0) {
            // Если избранных участков нет
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" style="text-align: center;">Вы не добавили еще ни одного участка</td>
            `;
            tableBody.appendChild(row);
        } else {
            // Если есть избранные участки
            favorites.forEach(plot => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${plot.FieldArea}</td>
                    <td>${plot.PermittedUse}</td>
                    <td>${plot.RentalStatus}</td>
                    <td>
                        <button class="tablebuttons" onclick="viewPlotFav(${plot.ID})">Подробнее</button>
                        <button class="tablebuttons" style="margin-top: 5px" onclick="removeFromFavorites(${plot.ID})">Удалить</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error("Ошибка при загрузке избранных участков:", error);
    }
}

async function removeFromFavorites(plotId) {
    if (!plotId) {
        alert("ID участка не найден.");
        return;
    }

    try {
        const response = await fetch('remove_favourite.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ plot_id: plotId }) 
        });

        const text = await response.text();
        console.log("Ответ сервера:", text);

        const data = JSON.parse(text); 
        if (data.message) {
            alert(data.message);
            displayFavorites(); // обновить таблицу после удаления
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при удалении из избранного.');
    }
}

//при загрузке страниц
if (window.location.pathname.endsWith('results.html')) {
    displayResults();
}

if (window.location.pathname.endsWith('plot.html')) {
    displayPlotDetails();
}

if (window.location.pathname.endsWith('index.html')) {
    checkAuth();
    checkAuthForExit();
}

