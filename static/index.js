const $submitBtn = $("#submit-btn");
const $startBtn = $("#start-btn");
const $input = $("#user-guess");
const $responseMsgDiv = $("#response-msg");
const $scoreCount = $("#score-count");
const $timerDiv = $("#timer");

let score = 0;
let timer = 60;
let guesses = [];
$input.prop("disabled", true);
$submitBtn.prop("disabled", true);

// Trigger handleGuess on submit
$submitBtn.on("click", async (e) => {
  e.preventDefault();
  const value = $input[0].value;

  if (value) {
    await handleGuess(value);
    $input[0].value = "";
  }
});

// Start the 60 second timer and enable submit-btn and input
$startBtn.on("click", () => {
  $startBtn.prop("disabled", true);
  $submitBtn.prop("disabled", false);
  $input.prop("disabled", false);

  $startBtn.addClass("start");
  $timerDiv.addClass("green").removeClass("red");

  if (timer === 0) {
    score = 0;
    timer = 60;
    guesses = [];
    $scoreCount[0].innerText = `Current Score: ${score}`;
    $timerDiv[0].innerText = `Time Left: ${timer} seconds`;
    $responseMsgDiv.empty();
  }

  const intervalId = setInterval(() => {
    countDown();
    if (timer === 0) {
      clearInterval(intervalId);
    }
  }, 1000);
});

// Sends user guess to the server and displays server msg on DOM
const handleGuess = async (value) => {
  const resp = await axios.get("/check", { params: { word: value } });
  const msg = resp.data["message"];
  console.log(msg);

  $responseMsgDiv.empty();
  if (msg === "not-word") {
    $responseMsgDiv.append("<p>That's not a word!</p>");
  } else if (msg === "not-on-board") {
    $responseMsgDiv.append("<p>That word isn't on the board!</p>");
  } else if (guesses.indexOf(value) > -1) {
    $responseMsgDiv.append("<p>You already guessed that word!</p>");
  } else {
    $responseMsgDiv.append("<p>Nice!</p>");
    guesses.push(value);
    countScore(value);
  }
};

// Keeps track of user score
const countScore = (word) => {
  score += word.length;
  $scoreCount[0].innerText = `Current Score: ${score}`;
};

// 60 second timer - displays the amount of time left on DOM
const countDown = () => {
  timer--;
  $timerDiv[0].innerText = `Time Left: ${timer} seconds`;

  if (timer <= 20 && timer > 0) {
    $timerDiv.addClass("gold").removeClass("green");
  }
  if (timer === 0) {
    $timerDiv.addClass("red").removeClass("gold");
    $timerDiv[0].innerText = "Time's Up!";
    $scoreCount[0].innerText = `Final Score: ${score}`;
    $startBtn[0].innerText = "Play Again";
    $startBtn.prop("disabled", false);
    $submitBtn.prop("disabled", true);
    $input.prop("disabled", true);
    $startBtn.removeClass("start");
    updateStats();
  }
};

const updateStats = async () => {
  await axios.post("/stats", { score: score });
};
