// Призы для ежедневного кейса (бесплатный)
const dailyPrizes = [
    { name: "0 ⭐", emoji: "0 ⭐", chance: 30, value: 0, display: "0 ⭐" },
    { name: "10 ⭐", emoji: "10 ⭐", chance: 25, value: 10, display: "10 ⭐" },
    { name: "50 ⭐", emoji: "50 ⭐", chance: 20, value: 50, display: "50 ⭐" },
    { name: "Сердечко", emoji: "💝", chance: 15, value: 15, display: "💝 Сердечко" },
    { name: "Мишка", emoji: "🧸", chance: 10, value: 15, display: "🧸 Мишка" }
];

let isSpinning = false;

// Показываем список возможных призов
function showPossiblePrizes() {
    const container = document.getElementById('prizesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    dailyPrizes.forEach(prize => {
        const prizeEl = document.createElement('div');
        prizeEl.className = 'prize-preview';
        prizeEl.innerHTML = `
            <div class="prize-preview-image">${prize.emoji}</div>
            <span class="prize-preview-name">${prize.display}</span>
            <span class="prize-preview-chance">${prize.chance}%</span>
        `;
        container.appendChild(prizeEl);
    });
}

// Создаём ленту для прокрутки
function createReel() {
    const reel = document.getElementById('reel');
    if (!reel) return;
    
    reel.innerHTML = '';
    
    // Создаём много призов для эффекта прокрутки
    for (let i = 0; i < 20; i++) {
        dailyPrizes.forEach(prize => {
            const item = document.createElement('div');
            item.className = 'prize-item';
            
            // Для звёзд показываем число + ⭐, для подарков - эмодзи
            if (prize.name.includes('⭐')) {
                item.textContent = prize.name;
            } else {
                item.textContent = prize.emoji;
            }
            
            reel.appendChild(item);
        });
    }
}

// Выбор приза по вероятности
function selectPrize() {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < dailyPrizes.length; i++) {
        cumulative += dailyPrizes[i].chance;
        if (random < cumulative) {
            return i;
        }
    }
    return 0;
}

// Кручение рулетки
function spinDailyCase() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.disabled = true;
    
    const reel = document.getElementById('reel');
    if (!reel) return;
    
    const prizeIndex = selectPrize();
    const prize = dailyPrizes[prizeIndex];
    
    // Рассчитываем позицию для выигрыша
    const itemWidth = 95;
    const itemsPerPrize = dailyPrizes.length;
    const targetPosition = prizeIndex * itemWidth;
    const spinDistance = itemsPerPrize * 15 * itemWidth + targetPosition;
    
    reel.style.transform = `translateX(-${spinDistance}px)`;
    
    // Показываем результат через 2 секунды
    setTimeout(() => {
        // Добавляем выигрыш на баланс
        if (prize.value > 0) {
            addStars(prize.value);
        }
        
        // Показываем модальное окно
        showWinModal(prize);
        
        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;
        
        // Возвращаем в начало
        setTimeout(() => {
            reel.style.transform = 'translateX(0px)';
        }, 500);
        
        // Отправляем результат в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({
                action: "daily_case",
                prize: prize.name,
                value: prize.value
            }));
        }
    }, 2000);
}

// Показываем модальное окно
function showWinModal(prize) {
    const modal = document.getElementById('winModal');
    const winImage = document.getElementById('winImage');
    const winText = document.getElementById('winText');
    
    if (!modal || !winImage || !winText) return;
    
    // Для звёзд показываем число + ⭐, для подарков - эмодзи
    if (prize.name.includes('⭐')) {
        winImage.textContent = prize.name;
    } else {
        winImage.textContent = prize.emoji;
    }
    
    winText.textContent = prize.display;
    
    modal.style.display = 'flex';
}

// Продолжить после выигрыша
function continueAfterWin() {
    const modal = document.getElementById('winModal');
    if (modal) modal.style.display = 'none';
    goBack();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    showPossiblePrizes();
    createReel();
    if (typeof updateBalance === 'function') {
        updateBalance();
    }
});