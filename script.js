let tg = window.Telegram.WebApp;
tg.ready();
tg.expand(); // Растягиваем на весь экран

// Система баланса
let userBalance = 0;
let userInventory = [];

// Загружаем данные пользователя при старте
function loadUserData() {
    const savedBalance = localStorage.getItem('nft_balance');
    const savedInventory = localStorage.getItem('nft_inventory');
    
    userBalance = savedBalance ? parseInt(savedBalance) : 0;
    userInventory = savedInventory ? JSON.parse(savedInventory) : [];
    
    updateBalance();
}

// Сохраняем данные
function saveUserData() {
    localStorage.setItem('nft_balance', userBalance.toString());
    localStorage.setItem('nft_inventory', JSON.stringify(userInventory));
}

// Обновляем отображение баланса
function updateBalance() {
    const balanceEl = document.getElementById('balance');
    if (balanceEl) {
        balanceEl.textContent = `${userBalance} ⭐`;
    }
}

// Добавляем звёзды на баланс
function addStars(amount) {
    userBalance += amount;
    saveUserData();
    updateBalance();
    tg.showAlert(`+${amount} ⭐`);
}

// Добавляем предмет в инвентарь
function addToInventory(item) {
    userInventory.push(item);
    saveUserData();
}

// Навигация
function goToHome() {
    window.location.href = 'index.html';
}

function goToProfile() {
    window.location.href = 'profile.html';
}

function goBack() {
    window.history.back();
}

// Открытие ежедневного кейса (теперь без ограничений)
function openDailyCase() {
    window.location.href = 'daily-case.html';
}
    localStorage.setItem('last_daily', today);
    window.location.href = 'daily-case.html';
}

// Открытие рулетки с кейсами
function openRoulette() {
    window.location.href = 'roulette.html';
}

// Открытие кейса (общая функция)
function openCase(caseType, cost) {
    if (caseType !== 'daily' && userBalance < cost) {
        tg.showAlert(`Недостаточно звёзд! Нужно ${cost} ⭐`);
        return;
    }
    
    if (caseType !== 'daily') {
        userBalance -= cost;
        saveUserData();
        updateBalance();
    }
    
    // Передаём параметры кейса в страницу открытия
    window.location.href = `case-open.html?type=${caseType}`;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', loadUserData);

// Получаем данные пользователя Telegram
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    console.log('Пользователь:', user);
}
// Переход на страницу пополнения
function goToTopUp() {
    window.location.href = 'topup.html';
}