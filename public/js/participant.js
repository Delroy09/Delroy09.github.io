const socket = io();

function register() {
    const name = document.getElementById('name').value;
    if (name.trim()) {
        socket.emit('register', name);
        document.getElementById('registration').style.display = 'none';
        document.getElementById('buzzer-section').style.display = 'block';
    }
}

function pressBuzzer() {
    const answer = document.getElementById('answer').value;
    socket.emit('buzzer', answer);
    document.getElementById('answer').value = '';
    document.getElementById('answer').disabled = true;
    setTimeout(() => {
        document.getElementById('answer').disabled = false;
    }, 5000); // 5 second cooldown
}

socket.on('new-question', (question) => {
    const questionSection = document.getElementById('question-section');
    let questionHtml = `<p>${question.text}</p>`;

    if (question.type === 'mcq') {
        questionHtml += '<ul>';
        question.options.forEach((option, index) => {
            questionHtml += `<li>${option}</li>`;
        });
        questionHtml += '</ul>';
    }

    questionSection.innerHTML = questionHtml;
});