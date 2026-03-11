// Загружаем и отображаем данные профиля
function loadProfile() {
    // Имя пользователя из Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('profileName').textContent = user.first_name;
        document.getElementById('profileAvatar').textContent = 
            user.first_name ? user.first_name[0] : '👤';
    }
    
    // Статистика (можно добавить позже)
    document.getElementById('totalOpened').textContent = 
        localStorage.getItem('total_cases_opened') || '0';
    document.getElementById('totalWon').textContent = 
        (localStorage.getItem('total_stars_won') || '0') + ' ⭐';
    
    // Отображаем инвентарь
    displayInventory();
}

// Отображаем инвентарь
function displayInventory() {
    const inventoryGrid = document.getElementById('inventory');
    const inventory = JSON.parse(localStorage.getItem('nft_inventory') || '[]');
    
    document.getElementById('nftCount').textContent = inventory.length;
    
    if (inventory.length === 0) {
        inventoryGrid.innerHTML = '<div class="stat-row">Инвентарь пуст</div>';
        return;
    }
    
    inventoryGrid.innerHTML = '';
    inventory.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.textContent = item.emoji || '🖼️';
        itemEl.title = item.name;
        inventoryGrid.appendChild(itemEl);
    });
}

// Инициализация
loadProfile();
updateBalance();