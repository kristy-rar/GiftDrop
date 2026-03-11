// Функция покупки звёзд
function buyStars(amount) {
    // Показываем подтверждение
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showConfirm(
            `Купить ${amount} ⭐ за ${amount} звезд Telegram?`,
            function(confirmed) {
                if (confirmed) {
                    initiateStarPurchase(amount);
                }
            }
        );
    } else {
        // Для тестирования вне Telegram
        alert(`Покупка ${amount} ⭐ (тестовый режим)`);
        simulatePurchase(amount);
    }
}

// Инициируем покупку через Telegram Stars
function initiateStarPurchase(amount) {
    // Показываем загрузку
    showLoading();
    
    // В реальном проекте здесь будет запрос к вашему бэкенду
    // Сейчас используем симуляцию
    
    setTimeout(() => {
        // Успешная покупка
        const success = Math.random() > 0.1; // 90% успеха для теста
        
        if (success) {
            completePurchase(amount);
        } else {
            showError("Платёж не прошёл. Попробуйте ещё раз.");
        }
        
        hideLoading();
    }, 2000);
}

// Завершение покупки
function completePurchase(amount) {
    // Добавляем бонусы для больших пакетов
    let bonus = 0;
    if (amount >= 500) bonus = 25;
    if (amount >= 1000) bonus = 75;
    if (amount >= 2500) bonus = 250;
    
    const totalAmount = amount + bonus;
    
    // Добавляем звёзды на баланс
    if (typeof userBalance !== 'undefined') {
        userBalance += totalAmount;
        saveUserData();
        updateBalance();
    }
    
    // Сохраняем историю покупки
    savePurchaseHistory(amount, bonus, totalAmount);
    
    // Показываем успешное сообщение
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(
            `✅ Успешно!\n\nКуплено: ${amount} ⭐\nБонус: ${bonus} ⭐\nВсего: ${totalAmount} ⭐`
        );
    }
    
    // Обновляем историю на странице
    loadPurchaseHistory();
}

// Сохраняем историю покупок
function savePurchaseHistory(amount, bonus, total) {
    const history = JSON.parse(localStorage.getItem('purchase_history') || '[]');
    
    const purchase = {
        date: new Date().toISOString(),
        amount: amount,
        bonus: bonus,
        total: total
    };
    
    history.unshift(purchase); // Добавляем в начало
    localStorage.setItem('purchase_history', JSON.stringify(history));
}

// Загружаем историю покупок
function loadPurchaseHistory() {
    const historyList = document.getElementById('purchaseHistory');
    if (!historyList) return;
    
    const history = JSON.parse(localStorage.getItem('purchase_history') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">История пополнений пуста</div>';
        return;
    }
    
    historyList.innerHTML = '';
    history.slice(0, 5).forEach(purchase => { // Показываем последние 5
        const date = new Date(purchase.date);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0,5)}`;
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <span class="history-item-date">${formattedDate}</span>
            <span class="history-item-amount">+${purchase.total} ⭐</span>
        `;
        historyList.appendChild(item);
    });
}

// Заглушка для тестирования
function simulatePurchase(amount) {
    completePurchase(amount);
}

// Показываем загрузку
function showLoading() {
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Обработка платежа...</div>';
        document.body.appendChild(overlay);
    }
}

// Скрываем загрузку
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Показываем ошибку
function showError(message) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(`❌ Ошибка: ${message}`);
    } else {
        alert(`Ошибка: ${message}`);
    }
}

// Навигация на страницу пополнения
function goToTopUp() {
    window.location.href = 'topup.html';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadPurchaseHistory();
    if (typeof updateBalance === 'function') {
        updateBalance();
    }
});

// Добавляем стили для загрузки
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #404040;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

.loading-text {
    color: #ffffff;
    font-size: 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(loadingStyles);