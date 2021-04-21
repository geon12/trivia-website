const BASE_URL = 'https://opentdb.com';

const numQuestions = 10;

const questionContainer = document.getElementById("question-container");

let topScore = 0;
let score = 0;

function fetchQuestions(num,token) {
    
    return fetch(`${BASE_URL}/api.php?amount=${num}&token=${token}`)
        .then(res => res.json());
}

function fetchToken() {

    return fetch(`${BASE_URL}/api_token.php?command=request`)
        .then(res => res.json())
}

function resetToken(token) {
    return fetch(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
        .then(res => res.json())
}

function checkQandA(questions, token) {
    
    
    if (questions.response_code === 4) {
        resetToken(token).then( () => {
            
            fetchQuestions(numQuestions,token)//change this if you add categories later
                .then((resetQuestions) => {
                    appendQuestion(resetQuestions.results,0)//change this
                })
        })
    }
    else {
        
       appendQuestion(questions.results,0);//change this
    }
}




// fetchToken().then((data) => {
//     fetchQuestions(numQuestions, data.token).then((questions) => {
        
//         console.log(checkQandA(questions,data.token))

//     });
        
// })

function startPlay() {

    fetchToken().then((data) => {
        fetchQuestions(numQuestions, data.token).then((questions) => {
            
            checkQandA(questions,data.token)
    
        });
            
    })
}

function createStartForm() {
    
    const form = document.createElement("form");
    const inputText = document.createElement("input");
    const inputSubmit = document.createElement("input");
    inputText.type = "text"
    inputText.id = "player-name"
    inputText.required = true;
    inputText.placeholder = "Player Name"

    inputSubmit.type = "submit"
    inputSubmit.value = "Enter"

    form.appendChild(inputText)
    form.appendChild(inputSubmit)

    return form;
    
}

function appendStartForm(form) {
    const h2 = document.createElement('h2')
    h2.innerHTML = "Enter Player Name"
    form.addEventListener('submit',(event) => {
        event.preventDefault();
        const score = document.querySelector("h3#score");
        const input = document.getElementById("player-name");
        score.innerHTML = `${input.value}'s Top Score: 0`;

        questionContainer.innerHTML = "";

       
        startPlay()
        
    });
    questionContainer.appendChild(h2)
    questionContainer.appendChild(form)
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
        li.addEventListener('click',() => {
            checkAnswer(answer,question.correct_answer, li);
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

function checkAnswer(answer,correctAnswer, answerLi) {
    const rightOrWrong = document.createElement("h3");
    const ul = document.querySelector("ul")
    if(answer === correctAnswer) {
        rightOrWrong.textContent = "Correct"
        ul.appendChild(rightOrWrong);
        
    }
    else {
        rightOrWrong.textContent = "Wrong"
        ul.appendChild(rightOrWrong);
    }

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
    });
}

function appendQuestion(questions,counter) {
    questionContainer.innerHTML = "";
    const questionDiv = createQuestion(questions,counter)
    questionContainer.appendChild(questionDiv)

}



appendStartForm(createStartForm());

