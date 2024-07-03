let dice = [0, 0, 0, 0, 0];
let rollsLeft = 3;
let selectedDice = [false, false, false, false, false];
let scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    threeOfAKind: 0,
    fourOfAKind: 0,
    fullHouse: 0,
    smallStraight: 0,
    largeStraight: 0,
    yatzy: 0,
    chance: 0,
    total: 0
};

document.addEventListener('DOMContentLoaded', () => {
    renderDice();
    document.getElementById('roll-button').addEventListener('click', rollDice);
    renderScoreboard();
});

function rollDice() {
    if (rollsLeft > 0) {
        for (let i = 0; i < dice.length; i++) {
            if (!selectedDice[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollsLeft--;
        renderDice();
    }
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

function toggleSelectDie(index) {
    selectedDice[index] = !selectedDice[index];
    renderDice();
}

function renderScoreboard() {
    for (const [key, value] of Object.entries(scores)) {
        const scoreElement = document.getElementById(`score-${key}`);
        if (scoreElement) {
            scoreElement.textContent = value;
        }
    }
}

function calculateScores() {
    // Calculate and update the scores for each category
    scores.ones = dice.filter(die => die === 1).length * 1;
    scores.twos = dice.filter(die => die === 2).length * 2;
    scores.threes = dice.filter(die => die === 3).length * 3;
    scores.fours = dice.filter(die => die === 4).length * 4;
    scores.fives = dice.filter(die => die === 5).length * 5;
    scores.sixes = dice.filter(die => die === 6).length * 6;
    scores.total = Object.values(scores).reduce((total, num) => total + num, 0);
    renderScoreboard();
}
