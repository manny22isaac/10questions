// this list contains 
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

// Loads the 10 questions from an JSON response.
// Error returns a prompt inside an HTML tag
async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=10';
    try {
        const result = await fetch(`${APIUrl}`);
        const data = await result.json();

        if (data.results && data.results.length > 0) {
            _result.innerHTML = "";
            showQuestion(data.results[0]);
        } else {
            throw new Error("No questions found");
        }
    } catch (error) {
        _result.innerHTML = "<p>Failed to load question. Please Refresh the page.</p>";
    }
}

// when either the checkBtn or playAgainBtn are clicked on
// they will activate their function in either parameter
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

// the DOM will return the questions to the html template.
document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

// Display question and options
function showQuestion(data){
    _checkBtn.disabled = false; //makes the button clickable 
    correctAnswer = HTMLDecode(data.correct_answer); //Returns the
    let incorrectAnswers = data.incorrect_answers.map(answer => HTMLDecode(answer));
    let optionsList = incorrectAnswers;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

// Options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// when an option is selected it will query that response.
// as the selected answer from the 
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer === correctAnswer){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// takes strings and outputs it into an HTML text
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

/*
    when the number of askedCount questions is equal to 
    the totalquestions which is 10
    it will return the final score
*/
function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        setTimeout(function(){
            _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
            _playAgainBtn.style.display = "block";
            _checkBtn.style.display = "none";
        }, 5000);
    } else {
        setTimeout(function(){
            loadQuestion();
        }, 300);
    }
}


/*
    This will reset the amount of questions and the 
*/
function setCount(){
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

/* - resets the asked count and the correct score,
   - returns the button to play the game again.
   - disables the check btn to false
*/ 
function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}
