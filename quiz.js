/**
 * Eemaldab kõik õige/vale style'id ja tulemuse
 */
function clearChecks() {
    const quizContainer = document.querySelector('.quiz');

    const options = quizContainer.querySelectorAll('.correct, .incorrect');
    options.forEach(option => {
        option.classList.remove('correct', 'incorrect');
    });

    const result = quizContainer.querySelector('.quiz-result');
    if (result) result.innerHTML = '';
}

/**
 * Lähtestab vastused
 */
function resetQuiz() {
    const quizContainer = document.querySelector('.quiz');
    const form = quizContainer.querySelector('form');
    if (form) form.reset();

    clearChecks();
}

/** Kontrollib vastuseid
 * @param answers - Õiged vastused (HTML value) vastavas järjekorras listina
 */
function checkQuiz(answers) {
    const quizContainer = document.querySelector('.quiz');
    const form = quizContainer.querySelector('form');
    if (!form) return;

    clearChecks();

    const checkQuestionPick = (question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        return selectedOption && selectedOption.value === answers[index] 
            ? 1 : 0;
    }

    const checkQuestionSelect = (question, correctAnswers) => {
        const selects = question.querySelectorAll('select');
        let score = 0;
        selects.forEach((select, index) => {
            if (select.value === correctAnswers[index]) {
                score += 1 / correctAnswers.length;
            }
        });
        return score;
    }

    const checkQuestionMulti = (question, correctAnswers) => {
        const checkboxes = question.querySelectorAll('input[type="checkbox"]');
        let score = 0;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked && correctAnswers.includes(checkbox.value)) {
                score += 1 / correctAnswers.length;
            }
        });

        return score;
    }

    let score = 0;

    const questions = form.querySelectorAll('.question');
    questions.forEach((question, index) => {
        let qScore = 0;

        if (question.classList.contains('question-pick'))
            qScore = checkQuestionPick(question, index);
        else if (question.classList.contains('question-select')) 
            qScore = checkQuestionSelect(question, answers[index]);
        else if (question.classList.contains('question-multi'))
            qScore = checkQuestionMulti(question, answers[index]);

        score += qScore;
        if (qScore === 1) {
            question.classList.add('correct');
        } else {
            question.classList.add('incorrect');
        }
    });

    const result = quizContainer.querySelector('.quiz-result');
    if (result) {
        result.innerHTML = `Tulemus: ${Math.round((score / questions.length) * 100)}%`;
    }
}