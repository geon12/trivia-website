const BASE_URL = 'https://opentdb.com';

const numQuestions = 10;

const questionContainer = document.getElementById("question-container");

let topScore = 0;
let score = 0;
let playerName = "";
let chosenCategory = "";


//Fetch functions

function fetchCategories() {
    return fetch(`${BASE_URL}/api_category.php`)
        .then(res => res.json());
}

function fetchQuestions(num,token,categoryId) {
    
    if (categoryId) {
        return fetch(`${BASE_URL}/api.php?amount=${num}&token=${token}&category=${categoryId}`)
        .then(res => res.json());
    }
    else {
        

        return fetch(`${BASE_URL}/api.php?amount=${num}&token=${token}`)
            .then(res => res.json());    
    }
}



function fetchToken() {

    return fetch(`${BASE_URL}/api_token.php?command=request`)
        .then(res => res.json())
}

function resetToken(token) {
    return fetch(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
        .then(res => res.json())
}


function createStartForm(categories) {
    
    const form = document.createElement("form");
    const inputText = document.createElement("input");
    const inputDropDown = document.createElement("select");
    const inputSubmit = document.createElement("input");

    inputText.type = "text"
    inputText.id = "player-name"
    inputText.required = true;
    inputText.placeholder = "Player Name"

    inputDropDown.type ="select";
    inputDropDown.id = "categories";

    const defaultOption = document.createElement("option");
    defaultOption.innerHTML = "All Categories";
    defaultOption.value = "";
    defaultOption.selected = "selected";
    inputDropDown.appendChild(defaultOption);

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.innerHTML = category.name;
        option.value = category.id;
        inputDropDown.appendChild(option)
    })

    inputSubmit.type = "submit";
    inputSubmit.value = "Enter";

    form.appendChild(inputText);
    form.appendChild(inputDropDown);
    form.appendChild(inputSubmit);

    return form;
    
}

function appendStartForm(form) {
    const h2 = document.createElement('h2')
    h2.innerHTML = "Enter Player Name"
    form.addEventListener('submit',(event) => {
        event.preventDefault();
        const input = document.getElementById("player-name");
        playerName = input.value
        changeScore()

        chosenCategory = document.getElementById("categories").value;

        questionContainer.innerHTML = "";

       
        startPlay()
        
    });
    questionContainer.appendChild(h2)
    questionContainer.appendChild(form)
}



function startPlay() {
    const token = localStorage.getItem('token')
    if (!token){
        fetchToken().then((data) => {
            localStorage.setItem('token', data.token);
            console.log(data.token)
            fetchQuestions(numQuestions, data.token,chosenCategory).then((questions) => {
                
                checkQandA(questions,data.token)
        
            });
                
        }) 
    }
    else {
        fetchQuestions(numQuestions, token,chosenCategory).then((questions) => {
            
            checkQandA(questions,token)
    
        });
    }
}

function checkQandA(questions, token) {
    
    
    if (questions.response_code === 4) {
        resetToken(token).then( () => {
            
            fetchQuestions(numQuestions,token,chosenCategory)
                .then((resetQuestions) => {
                    appendQuestion(resetQuestions.results,0)
                })
        })
    }
    else {
        
       appendQuestion(questions.results,0);
    }
}



function changeScore() {
    const topScoreElement = document.querySelector("h3#top-score");
    const currentScore = document.querySelector("h3#current-score")
    
    topScoreElement.innerHTML = `${playerName}'s Top Score: ${topScore}`;
    currentScore.innerHTML = `${playerName}'s Current Score: ${score}`
}


function createQuestion(questions, counter) {


    
    const question = questions[counter]

    const div = document.createElement("div");
    div.id = "question-div"

    const questionNumber = document.createElement("h4")
    questionNumber.textContent = `${counter + 1} of ${questions.length}`

    const h2 = document.createElement("h2");
    h2.textContent = question.category

    const p = document.createElement("p")
    p.innerHTML = question.question

    const ul = document.createElement("ul")
    ul.id = "answer-list"

    const answers = [...question.incorrect_answers]
    const insertIndex = Math.floor(Math.random() * (answers.length + 1)) 
    answers.splice( insertIndex, 0, question.correct_answer);

    answers.forEach((answer) => {
        const li = document.createElement("li");
        li.innerHTML = answer;
        li.classList.add("hover");
        li.addEventListener('click',() => {
            checkAnswer(decode(answer),decode(question.correct_answer), li);
            nextQuestion(questions,counter);
        });
        
        ul.appendChild(li);
    })

    
    div.appendChild(h2);
    div.appendChild(p);
    div.appendChild(ul);
    div.appendChild(questionNumber)
    
    
    return div

    
    

}

function nextQuestion(questions,counter) {

    const questionDiv = document.getElementById("question-div");
    const answerList = document.getElementById("answer-list");


    //remove event listeners
    const replaceAnswers = answerList.innerHTML
    answerList.innerHTML = replaceAnswers;

    
    const button = document.createElement("button");
    button.textContent = "Next Question =>"

    questionDiv.appendChild(button);

    button.addEventListener('click',    () => {
        if(counter < questions.length - 1) {
            appendQuestion(questions,counter + 1)
        }
        else {
            appendPlayAgainDiv(playAgainDiv());
        }
    });
}

function appendQuestion(questions,counter) {
    questionContainer.innerHTML = "";
    const questionDiv = createQuestion(questions,counter)
    questionContainer.appendChild(questionDiv)

}


function decode(encodedHTML) {
    const temporaryTag = document.createElement('p');
    temporaryTag.innerHTML = encodedHTML;
    return temporaryTag.innerHTML;
}

function checkAnswer(answer,correctAnswer, answerLi) {
    const rightOrWrong = document.createElement("h3");
    const h4 = document.querySelector("h4")
    const questionDiv = document.getElementById("question-div")
    const listItems = [...document.getElementsByTagName('li')]
    
    listItems.forEach((li) => {
        li.classList.remove("hover")
        if(answer !== correctAnswer && li.innerHTML === correctAnswer ) {
            
            li.id = "correct-answer";
        }
    })

    if(answer === correctAnswer) {
        rightOrWrong.textContent = "Correct";
        rightOrWrong.id = "right";

        questionDiv.insertBefore(rightOrWrong,h4);
        
        score = score + 100;
        if (score > topScore) {
            topScore = score;
        }
        changeScore();
        answerLi.id = "correct-answer";
    }
    else {
        rightOrWrong.textContent = "Wrong";
        rightOrWrong.id = "wrong";
        questionDiv.insertBefore(rightOrWrong,h4);

        answerLi.id = "wrong-answer";

        
    }

}

function appendPlayAgainDiv(div) {

    questionContainer.appendChild(div)
}

function playAgainDiv() {
    questionContainer.innerHTML = "";

    const div = document.createElement("div");
    div.id = "play-again"

    const h2 = document.createElement("h2");
    h2.textContent = `Final Score: ${score}`;

    const button = document.createElement("button");
    button.textContent = "Play Again?";
    button.addEventListener('click',restartPlay);

    div.appendChild(h2);
    div.appendChild(button);
    return div;
}

function restartPlay() {
    score = 0;
    changeScore()
    startPlay();
}






fetchCategories().then((categories) => appendStartForm(createStartForm(categories.trivia_categories)))

