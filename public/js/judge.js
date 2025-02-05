const socket = io();

document.getElementById('question-type').addEventListener('change', function() {
    const mcqOptions = document.getElementById('mcq-options');
    if (this.value === 'mcq') {
        mcqOptions.style.display = 'block';
    } else {
        mcqOptions.style.display = 'none';
    }
});

function sendQuestion() {
    const questionType = document.getElementById('question-type').value;
    const questionText = document.getElementById('question-text').value;
    let questionData = { type: questionType, text: questionText };

    if (questionType === 'mcq') {
        questionData.options = [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ];
    }

    socket.emit('new-question', questionData);
    document.getElementById('rankings').innerHTML = ''; // Clear rankings
}

socket.on('buzzer-press', (data) => {
    updateAnswers(data.response);
    updateRankings(data.rankings);
});

function updateAnswers(data) {
    const answersDiv = document.getElementById('answers');
    const time = new Date(data.timestamp).toLocaleTimeString();
    
    const answerHtml = `
        <div class="alert alert-info">
            <strong>${data.name}</strong> buzzed at ${time}<br>
            Answer: ${data.answer}
        </div>
    `;
    
    answersDiv.innerHTML = answerHtml + answersDiv.innerHTML;
}

function updateRankings(rankings) {
    const rankingsDiv = document.getElementById('rankings');
    const medals = ['🥇', '🥈', '🥉'];
    
    let rankingsHtml = '<div class="rankings-board">';
    rankings.forEach((response, index) => {
        rankingsHtml += `
            <div class="ranking-item">
                ${medals[index]} ${response.name} - ${new Date(response.timestamp).toLocaleTimeString()}
            </div>
        `;
    });
    rankingsHtml += '</div>';
    
    rankingsDiv.innerHTML = rankingsHtml;
}