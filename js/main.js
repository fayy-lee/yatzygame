document.addEventListener('DOMContentLoaded', () => {
    renderDice();
    document.getElementById('roll-button').addEventListener('click', rollDice);
    renderScoreboard();
});

function startGame() {
    fetch('/api/game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_game' })
    }).then(response => response.json())
      .then(data => updateGameState(data));
}

function rollDice() {
    fetch('/api/game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'roll_dice' })
    }).then(response => response.json())
      .then(data => updateGameState(data));
}

function toggleSelectDie(index) {
    fetch('/api/game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_select_die', index: index })
    }).then(response => response.json())
      .then(data => updateGameState(data));
}

function calculateScores() {
    fetch('/api/game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'calculate_scores' })
    }).then(response => response.json())
      .then(data => updateGameState(data));
}

function updateGameState(data) {
    const { game, leaderboard } = data;
    dice = game.dice;
    rollsLeft = game.rollsLeft;
    selectedDice = game.selectedDice;
    scores = game.scores;
    renderDice();
    renderScoreboard();
    renderLeaderboard(leaderboard);
}

function renderDice() {
    const diceContainer = document.getElementById('dice-container');
    diceContainer.innerHTML = '';
    dice.forEach((die, index) => {
        const dieElement = document.createElement('div');
        dieElement.className = `die ${selectedDice[index] ? 'selected' : ''}`;
        dieElement.textContent = die;
        dieElement.addEventListener('click', () => toggleSelectDie(index));
        diceContainer.appendChild(dieElement);
    });
}

function renderScoreboard() {
    for (const [key, value] of Object.entries(scores)) {
        const scoreElement = document.getElementById(`score-${key}`);
        if (scoreElement) {
            scoreElement.textContent = value;
        }
    }
}

function renderLeaderboard(leaderboard) {
    const leaderboardContainer = document.getElementById('leaderboard-container');
    leaderboardContainer.innerHTML = leaderboard.map(score => `<p>${score}</p>`).join('');
}
