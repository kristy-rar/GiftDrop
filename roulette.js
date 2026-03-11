// Выбор кейса
function selectCase(caseType) {
    if (caseType === 'novice') {
        openCase('novice', 10);
    } else if (caseType === 'pro') {
        openCase('pro', 100);
    }
}

// Обновляем баланс при загрузке
updateBalance();