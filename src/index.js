const BASE_URL = 'https://opentdb.com';

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
        .then(console.log)
}

//fetchToken().then(data => resetToken(data.token));

fetchToken().then((data) => {
    fetchQuestions(50, data.token).then(console.log)
})
//fetchQuestions(20).then(console.log);