document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('roll-button').addEventListener('click', () => {
        fetch('api/game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'roll_dice' })
        })
        .then(response => response.json())
        .then(data => {
            updateGameState(data);
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('calculate-scores-button').addEventListener('click', () => {
        fetch('api/game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'calculate_scores' })
        })
        .then(response => response.json())
        .then(data => {
            updateGameState(data);
        })
        .catch(error => console.error('Error:', error));
    });

    // Initial fetch to get the game state when the page loads
    fetch('api/game.php')
        .then(response => response.json())
        .then(data => {
            updateGameState(data);
        })
        .catch(error => console.error('Error:', error));
});

function updateGameState(data) {
    console.log('Updating game state:', data);

    // Update dice display
    const diceContainer = document.getElementById('dice-container');
    diceContainer.innerHTML = '';
    data.game.dice.forEach((die, index) => {
        const dieElement = document.createElement('button');
        dieElement.className = `die ${data.game.selectedDice[index] ? 'selected' : ''}`;
        dieElement.textContent = die;
        dieElement.addEventListener('click', () => toggleSelectDie(index));
        diceContainer.appendChild(dieElement);
    });

    // Update roll info
    document.getElementById('roll-result').textContent = `Rolls left: ${data.game.rollsLeft}`;

    // Update scoreboard
    document.getElementById('score-ones').textContent = data.game.scores.ones;
    document.getElementById('score-twos').textContent = data.game.scores.twos;
    document.getElementById('score-threes').textContent = data.game.scores.threes;
    document.getElementById('score-fours').textContent = data.game.scores.fours;
    document.getElementById('score-fives').textContent = data.game.scores.fives;
    document.getElementById('score-sixes').textContent = data.game.scores.sixes;
    document.getElementById('score-three-of-a-kind').textContent = data.game.scores.threeOfAKind;
    document.getElementById('score-four-of-a-kind').textContent = data.game.scores.fourOfAKind;
    document.getElementById('score-full-house').textContent = data.game.scores.fullHouse;
    document.getElementById('score-small-straight').textContent = data.game.scores.smallStraight;
    document.getElementById('score-large-straight').textContent = data.game.scores.largeStraight;
    document.getElementById('score-yatzy').textContent = data.game.scores.yatzy;
    document.getElementById('score-chance').textContent = data.game.scores.chance;
    document.getElementById('score-total').textContent = data.game.scores.total;

    // Update leaderboard
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    data.leaderboard.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = score;
        leaderboardList.appendChild(listItem);
    });
}

function toggleSelectDie(index) {
    fetch('api/game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'toggle_select_die', index })
    })
    .then(response => response.json())
    .then(data => {
        updateGameState(data);
    })
    .catch(error => console.error('Error:', error));
}
