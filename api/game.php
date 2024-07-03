<?php
session_start();

class YatzyGame {
    public $dice;
    public $rollsLeft;
    public $selectedDice;
    public $scores;

    public function __construct() {
        $this->dice = [0, 0, 0, 0, 0];
        $this->rollsLeft = 3;
        $this->selectedDice = [false, false, false, false, false];
        $this->scores = [
            'ones' => 0,
            'twos' => 0,
            'threes' => 0,
            'fours' => 0,
            'fives' => 0,
            'sixes' => 0,
            'threeOfAKind' => 0,
            'fourOfAKind' => 0,
            'fullHouse' => 0,
            'smallStraight' => 0,
            'largeStraight' => 0,
            'yatzy' => 0,
            'chance' => 0,
            'total' => 0
        ];
    }

    public function rollDice() {
        if ($this->rollsLeft > 0) {
            for ($i = 0; $i < count($this->dice); $i++) {
                if (!$this->selectedDice[$i]) {
                    $this->dice[$i] = rand(1, 6);
                }
            }
            $this->rollsLeft--;
        }
    }

    public function toggleSelectDie($index) {
        $this->selectedDice[$index] = !$this->selectedDice[$index];
    }

    public function calculateScores() {
        $this->scores['ones'] = array_count_values($this->dice)[1] ?? 0;
        $this->scores['twos'] = array_count_values($this->dice)[2] * 2 ?? 0;
        $this->scores['threes'] = array_count_values($this->dice)[3] * 3 ?? 0;
        $this->scores['fours'] = array_count_values($this->dice)[4] * 4 ?? 0;
        $this->scores['fives'] = array_count_values($this->dice)[5] * 5 ?? 0;
        $this->scores['sixes'] = array_count_values($this->dice)[6] * 6 ?? 0;
        $this->scores['total'] = array_sum($this->scores);
    }
}

class Leaderboard {
    public $scores;

    public function __construct() {
        $this->scores = [];
    }

    public function addScore($score) {
        $this->scores[] = $score;
        rsort($this->scores);
        $this->scores = array_slice($this->scores, 0, 10);
    }
}

if (!isset($_SESSION['game'])) {
    $_SESSION['game'] = new YatzyGame();
}

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = new Leaderboard();
}

$game = $_SESSION['game'];
$leaderboard = $_SESSION['leaderboard'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data['action'] === 'start_game') {
        $game = new YatzyGame();
        $_SESSION['game'] = $game;
    } elseif ($data['action'] === 'roll_dice') {
        $game->rollDice();
    } elseif ($data['action'] === 'toggle_select_die') {
        $game->toggleSelectDie($data['index']);
    } elseif ($data['action'] === 'calculate_scores') {
        $game->calculateScores();
        $leaderboard->addScore($game->scores['total']);
        $_SESSION['leaderboard'] = $leaderboard;
    }
}

header('Content-Type: application/json');
echo json_encode(['game' => $game, 'leaderboard' => $leaderboard->scores]);
