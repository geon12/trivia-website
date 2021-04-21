const BASE_URL = 'https://opentdb.com';

const numQuestions = 10;

const questionContainer = document.getElementById("question-container");

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

    inputSubmit.type = "submit"
    inputSubmit.value = "Enter"

    form.appendChild(inputText)
    form.appendChild(inputSubmit)

    return form;
    
}

function createQuestion(questions, counter) {


    
    const question = questions[counter]

    const div = document.createElement("div");

    const questionNumber = document.createElement("h4")
    questionNumber.textContent = `${counter + 1} of ${questions.length}`

    const h3 = document.createElement("h3");
    h3.textContent = question.category


    const ul = document.createElement("ul")

    const p = document.createElement("p")
    p.innerHTML = question.question
    const answers = [...question.incorrect_answers]
    const insertIndex = Math.floor(Math.random() * (answers.length + 1)) 
    answers.splice( insertIndex, 0, question.correct_answer);

    answers.forEach((answer) => {
        const li = document.createElement("li");
        li.innerHTML = answer;
        ul.appendChild(li);
    })

    
    div.appendChild(h3);
    div.appendChild(p);
    div.appendChild(ul);
    div.appendChild(questionNumber)
    
    
    return div

    
    
    // const button = document.createElement("button");
    // button.textContent = "Next Question =>"

    // questionContainer.appendChild(button);

    // button.addEventListener('click',    () => {
    //     if(counter < questions.length - 1) {
    //         createQuestion(questions,counter + 1)
    //     }
    // });


}

function appendQuestion(questions,counter) {
    questionContainer.innerHTML = "";
    const questionDiv = createQuestion(questions,counter)
    questionContainer.appendChild(questionDiv)

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

        //let testQuestion = {"category":"Entertainment: Books","type":"multiple","difficulty":"hard","question":"In the Beatrix Potter books, what type of animal is Tommy Brock?","correct_answer":"Badger","incorrect_answers":["Fox","Frog","Rabbit"]}
        // let testQuestion ={"category":"Science & Nature","type":"multiple","difficulty":"easy","question":"What is the unit of electrical resistance?","correct_answer":"Ohm","incorrect_answers":["Mho","Tesla","Joule"]}
        // createQuestion(testQuestion)
        startPlay()
        
    });
    questionContainer.appendChild(h2)
    questionContainer.appendChild(form)
}


appendStartForm(createStartForm());

