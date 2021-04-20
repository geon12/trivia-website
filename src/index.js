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

function getQandA(data, token) {
    
    
        console.log(data.results)
}

//fetchToken().then(data => resetToken(data.token));

fetchToken().then((data) => {
    fetchQuestions(numQuestions, data.token).then((questions) => {
        
        if (questions.response_code === 4) {
            resetToken(data.token).then( () => {
                //console.log("reset token")
                fetchQuestions(numQuestions,data.token)
                    .then((resetQuestions) => {
                        getQandA(resetQuestions,data.token)//change this
                    })
            })
        }
        else {
            
            getQandA(questions,data.token);//change this
        }

    });
        
})
//fetchQuestions(20).then(console.log);