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

/** Kontrollib vastuseid, lisab vastavad CSS klassid ja tulemuse
 * @param answers - Õiged vastused (HTML value) vastavas järjekorras listina
 * @returns {void}
 * @example
 * checkQuiz(['a', ['a', 'b'], ['a', 'c']]);
 * ...
 * <section class="quiz">
        <h2>Teadmistekontroll</h2>

        <form id="quizForm" class="quiz-form" onsubmit="return false;">
            <div class="question question-pick">
                <p class="q">Vali õige vastus:</p>
                <label><input type="radio" value="a">õige</label><br>
                <label><input type="radio" value="b">vale</label><br>
            </div>

            <div class="question question-select">
                <p class="q">Vali õige variant:</p>

                <div class="term-select">
                    <span class="term"><code>Mõiste</code></span>
                    <select name="s1">
                        <option value="a">õige</option>
                        <option value="b">vale</option>
                    </select>
                </div>

                <div class="term-select">
                    <span class="term"><code>Mõiste</code></span>
                    <select name="s1">
                        <option value="a">vale</option>
                        <option value="b">õige</option>
                    </select>
                </div>
            </div>

            <div class="question question-multi">
                <p class="q">Märgi tõesed väited:</p>
                <label><input type="checkbox" value="a">õige</label><br>
                <label><input type="checkbox" value="b">vale</label><br>
                <label><input type="checkbox" value="c">õige</label><br>
            </div>
        </form>
        <div class="quiz-result"></div>
    </section>
 */
function checkQuiz(answers) {
    const quizContainer = document.querySelector('.quizC');
    const form = quizContainer.querySelector('form');
    if (!form) return;

    clearChecks();

    // valikvastusega küsimus (radio button)
    const checkQuestionPick = (question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        return selectedOption && selectedOption.value === answers[index] 
            ? 1 : 0;
    }

    // valikvastusega küsimused (vali õige tähendus jne)
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

    // mitme vastusega küsimus
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


    // kontrolli küsimusi, lisa punkte vastavalt vastustele
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