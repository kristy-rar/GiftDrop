// Получаем тип кейса из URL
const urlParams = new URLSearchParams(window.location.search);
const caseType = urlParams.get('type');

// Призы для разных кейсов
const casePrizes = {
    daily: [
        { name: "0 ⭐", emoji: "0 ⭐", chance: 30, value: 0, display: "0 ⭐" },
        { name: "10 ⭐", emoji: "10 ⭐", chance: 25, value: 10, display: "10 ⭐" },
        { name: "50 ⭐", emoji: "50 ⭐", chance: 20, value: 50, display: "50 ⭐" },
        { name: "Сердечко", emoji: "💝", chance: 15, value: 15, display: "💝 Сердечко" },
        { name: "Мишка", emoji: "🧸", chance: 10, value: 15, display: "🧸 Мишка" }
    ],
    novice: [
        { name: "10 ⭐", emoji: "10 ⭐", chance: 35, value: 10, display: "10 ⭐" },
        { name: "50 ⭐", emoji: "50 ⭐", chance: 25, value: 50, display: "50 ⭐" },
        { name: "Сердечко", emoji: "💝", chance: 20, value: 15, display: "💝 Сердечко" },
        { name: "Мишка", emoji: "🧸", chance: 15, value: 15, display: "🧸 Мишка" },
        { name: "Ракета", emoji: "🚀", chance: 5, value: 50, display: "🚀 Ракета" }
    ],
    pro: [
        { name: "50 ⭐", emoji: "50 ⭐", chance: 30, value: 50, display: "50 ⭐" },
        { name: "100 ⭐", emoji: "100 ⭐", chance: 25, value: 100, display: "100 ⭐" },
        { name: "Сердечко", emoji: "💝", chance: 15, value: 15, display: "💝 Сердечко" },
        { name: "Мишка", emoji: "🧸", chance: 10, value: 15, display: "🧸 Мишка" },
        { name: "Ракета", emoji: "🚀", chance: 10, value: 50, display: "🚀 Ракета" },
        { name: "Кольцо", emoji: "💍", chance: 10, value: 100, display: "💍 Кольцо" }
    ]
};

let currentPrizes = casePrizes[caseType] || casePrizes.daily;
let isSpinning = false;
let caseCost = caseType === 'novice' ? 10 : (caseType === 'pro' ? 100 : 0);

// Настройка страницы в зависимости от кейса
function setupCasePage() {
    const titleEl = document.getElementById('caseTitle');
    const imageEl = document.getElementById('caseImage');
    const costEl = document.getElementById('caseCost');
    
    if (titleEl) {
        titleEl.textContent = 
            caseType === 'daily' ? 'Ежедневный кейс' :
            caseType === 'novice' ? 'Кейс «Новичок»' :
            caseType === 'pro' ? 'Кейс «Профи»' : 'Кейс';
    }
    
    if (imageEl) {
        imageEl.textContent = 
            caseType === 'daily' ? '🎁' :
            caseType === 'novice' ? '📦' :
            caseType === 'pro' ? '💎' : '📦';
    }
    
    if (costEl) costEl.textContent = caseCost;
}

// Показываем список возможных призов
function showPossiblePrizes() {
    const container = document.getElementById('prizesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    currentPrizes.forEach(prize => {
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
    
    for (let i = 0; i < 20; i++) {
        currentPrizes.forEach(prize => {
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
    
    for (let i = 0; i < currentPrizes.length; i++) {
        cumulative += currentPrizes[i].chance;
        if (random < cumulative) {
            return i;
        }
    }
    return 0;
}

// Кручение рулетки
function spinCase() {
    if (isSpinning) return;
    
    // Проверяем баланс для платных кейсов
    if (caseType !== 'daily' && typeof userBalance !== 'undefined' && userBalance < caseCost) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.showAlert(`Недостаточно звёзд! Нужно ${caseCost} ⭐`);
        }
        return;
    }
    
    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.disabled = true;
    
    // Списываем стоимость для платных кейсов
    if (caseType !== 'daily' && typeof userBalance !== 'undefined') {
        userBalance -= caseCost;
        saveUserData();
        updateBalance();
    }
    
    const reel = document.getElementById('reel');
    if (!reel) return;
    
    const prizeIndex = selectPrize();
    const prize = currentPrizes[prizeIndex];
    
    const itemWidth = 95;
    const itemsPerPrize = currentPrizes.length;
    const targetPosition = prizeIndex * itemWidth;
    const spinDistance = itemsPerPrize * 15 * itemWidth + targetPosition;
    
    reel.style.transform = `translateX(-${spinDistance}px)`;
    
    setTimeout(() => {
        if (prize.value > 0) {
            addStars(prize.value);
        }
        
        // Добавляем в инвентарь если это предмет
        if (!prize.name.includes('⭐')) {
            addToInventory({
                name: prize.display,
                emoji: prize.emoji,
                value: prize.value
            });
        }
        
        showWinModal(prize);
        
        isSpinning = false;
        if (spinBtn) spinBtn.disabled = false;
        
        setTimeout(() => {
            reel.style.transform = 'translateX(0px)';
        }, 500);
        
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify({
                action: "case_open",
                case_type: caseType,
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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    setupCasePage();
    showPossiblePrizes();
    createReel();
    if (typeof updateBalance === 'function') {
        updateBalance();
    }
});