const BASE_URL = 'https://opentdb.com';

const numQuestions = 50;

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
                    return resetQuestions.results//change this
                })
        })
    }
    else {
        
       return questions.results;//change this
    }
}

//fetchToken().then(data => resetToken(data.token));

fetchToken().then((data) => {
    fetchQuestions(numQuestions, data.token).then((questions) => {
        
        checkQandA(questions,data.token)

    });
        
})
//fetchQuestions(20).then(console.log);