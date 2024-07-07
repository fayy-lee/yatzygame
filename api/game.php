<?php
session_start();

class YatzyGame {
    public $dice;
    public $selectedDice;
    public $rollsLeft;
    public $scores;

    public function __construct() {
        $this->dice = [1, 1, 1, 1, 1];
        $this->selectedDice = [false, false, false, false, false];
        $this->rollsLeft = 3;
        $this->scores = [
            'ones' => 0, 'twos' => 0, 'threes' => 0, 'fours' => 0, 'fives' => 0, 'sixes' => 0,
            'threeOfAKind' => 0, 'fourOfAKind' => 0, 'fullHouse' => 0,
            'smallStraight' => 0, 'largeStraight' => 0, 'yatzy' => 0, 'chance' => 0, 'total' => 0
        ];
    }

    public function rollDice() {
        if ($this->rollsLeft > 0) {
            for ($i = 0; $i < 5; $i++) {
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
        $counts = array_count_values($this->dice);
        $this->scores['ones'] = $counts[1] ?? 0;
        $this->scores['twos'] = ($counts[2] ?? 0) * 2;
        $this->scores['threes'] = ($counts[3] ?? 0) * 3;
        $this->scores['fours'] = ($counts[4] ?? 0) * 4;
        $this->scores['fives'] = ($counts[5] ?? 0) * 5;
        $this->scores['sixes'] = ($counts[6] ?? 0) * 6;
        $this->scores['threeOfAKind'] = in_array(3, $counts) ? array_sum($this->dice) : 0;
        $this->scores['fourOfAKind'] = in_array(4, $counts) ? array_sum($this->dice) : 0;
        $this->scores['fullHouse'] = in_array(3, $counts) && in_array(2, $counts) ? 25 : 0;
        $this->scores['smallStraight'] = (count(array_intersect([1, 2, 3, 4], $this->dice)) == 4 || count(array_intersect([2, 3, 4, 5], $this->dice)) == 4 || count(array_intersect([3, 4, 5, 6], $this->dice)) == 4) ? 30 : 0;
        $this->scores['largeStraight'] = (count(array_intersect([1, 2, 3, 4, 5], $this->dice)) == 5 || count(array_intersect([2, 3, 4, 5, 6], $this->dice)) == 5) ? 40 : 0;
        $this->scores['yatzy'] = in_array(5, $counts) ? 50 : 0;
        $this->scores['chance'] = array_sum($this->dice);
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

header('Content-Type: application/json');

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

    echo json_encode(['game' => $game, 'leaderboard' => $leaderboard->scores]);
    exit;
}

echo json_encode(['message' => 'Invalid request method']);
?>
