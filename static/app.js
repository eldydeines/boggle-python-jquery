
let score = 0;
let time = 60;
let game_timer = setInterval(displayGameTime, 1000)

function updateScore(len) {
    score += len;
    $("#current-score").text(score);
}

function addGuess(guess) {
    $("#guess-list").append($("<li>").text(guess));
}


async function sendAndCheckGuess(guess) {
    const response = await axios.get("/guess", { params: { guess: guess } });

    if (response.data.result === "not-on-board") {
        $("#status").text(`${guess} is invalid`);
    }
    else if (response.data.result === "not-word") {
        $("#status").text(`${guess} is not a word`);
    }
    else {
        $("#status").text(`${guess} is a word and valid!`);
        addGuess(guess);
        updateScore(guess.length);
    }
}

function displayGameTime() {
    time--;
    $("#timer").text(time);
}

async function postScore() {
    console.log(score);
    const resp = await axios.post("/add-score", { score: score });
    if (resp.data.scoreStatusRecord === score) {
        $("#score-status").text("You beat the previous score!")
    }
    else {
        $("#score-status").text(`You missed beating the previuos score of ${resp.data.scoreStatusRecord}!`)
    }

}


$("#target").on("submit", (function (e) {

    e.preventDefault();
    sendAndCheckGuess($("#guess").val());
    $("#guess").val("");

}));

setTimeout(function () {
    clearInterval(game_timer);
    $("#target").hide();
    $("#guess-status").hide();
    postScore();
}, 60000)





