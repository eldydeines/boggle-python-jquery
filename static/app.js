/* 
Boggle JavaScript with JQuery
Eldy Deines
Developed Game with Class (Object-Oriented)
- Gets word validation from backend dictionary
- Posts score in Flask Session on backend 

*/

class BoggleGame {

    constructor() {
        //Sets variables for timer and scorekeeping. Also, starts the timer with setinterval every 1 second
        this.time = 60;
        this.score = 0;
        this.game_timer = setInterval(this.displayGameTime.bind(this), 1000)
    }


    //Displays timer to player and decrements the timer
    displayGameTime() {
        $("#timer").text(this.time);
        this.time--;
    }

    //shows status of the word
    //if valid and is not a duplicate, it will add updated score and word to display
    showGuessStatus(result, dupe, guess) {

        if (result === "not-on-board") {
            $("#status").text(`${guess} is invalid`);
        }
        else if (result === "not-word") {
            $("#status").text(`${guess} is not a word`);
        }
        else if (dupe === "True") {
            $("#status").text(`${guess} has already been submitted`);
        }
        else {
            $("#status").text(`${guess} is a word and valid!`);
            this.score += guess.length;
            $("#current-score").text(this.score);
            $("#guess-list").append($("<li>").text(guess));

        }
    }

    //sends get request to backend ie. sends current word to determine if in dictionary
    //backend will send response with result and will also state if it is a duplicate
    async sendAndCheckGuess(guess) {
        const response = await axios.get("/guess", { params: { guess: guess } });
        this.showGuessStatus(response.data.result, response.data.dupe, guess);
    }

    //Displays to player if they beat an existing score
    showScoreStatus(highestScore) {
        if (highestScore === this.score) {
            $("#score-status").text("You beat the previous score!")
        }
        else {
            $("#score-status").text(`Your score ${this.score} missed beating the previous score of ${highestScore}!`)
        }
    }

    //sends post to backend with the finished score and will return highest score on record
    //Will then get message to display
    async postScore() {
        const resp = await axios.post("/add-score", { score: this.score });
        this.showScoreStatus(resp.data.scoreStatusRecord);
    }

}


//creates new boggle game
let myBoggleGame = new BoggleGame();

//will add event listener to form and send to Class to evaluate
$("#target").on("submit", (function (e) {

    e.preventDefault();
    myBoggleGame.sendAndCheckGuess($("#guess").val());
    $("#guess").val("");

}));

//will remove timer and hide certain fields from player after 60sec.
setTimeout(function () {
    clearInterval(myBoggleGame.game_timer);
    $("#target").hide();
    $("#guess-status").hide();
    $("#timer-status").hide();
    myBoggleGame.postScore();
}, 60000)





