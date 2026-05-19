// ========================================
// VOCABULARY QUIZ APP - JAVASCRIPT
// ========================================

// ========================================
// STATE MANAGEMENT
// ========================================

let appState = {
    language: 'en',
    vocabulary: JSON.parse(localStorage.getItem('vocabulary')) || [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    selectedAnswers: [],
    quizType: null,
    matchingPairs: [],
    currentRevisionIndex: 0,
    questionsAttempted: 0,
    currentQuestion: null,
};

const translations = {
    en: {
        'Vocabulary': 'Vocabulary',
        'Quiz': 'Quiz',
        'Revision': 'Revision',
        'Add New Word': 'Add New Word',
        'English Word': 'English Word',
        'Arabic Translation': 'Arabic Translation',
        'Example Sentence': 'Example Sentence (Optional)',
        'Add Word': 'Add Word',
        'Vocabulary List': 'Vocabulary List',
        'Select Quiz Type': 'Select Quiz Type',
        'Multiple Choice Questions': 'Multiple Choice Questions',
        'Fill in the Blank': 'Fill in the Blank',
        'Matching Exercise': 'Matching Exercise',
        'Question': 'Question',
        'Check Answer': 'Check Answer',
        'Next Question': 'Next Question',
        'Restart': 'Restart',
        'Match the pairs': 'Match the pairs',
        'English': 'English',
        'Arabic': 'العربية',
        'Quick Revision': 'Quick Revision',
        'Flip': 'Flip',
        'Next': 'Next',
        'Quiz Complete!': 'Quiz Complete!',
        'Back to Quiz Menu': 'Back to Quiz Menu',
        'Made for English Learners': 'Made for English Learners',
        'Correct!': 'Correct! Well done! 🎉',
        'Incorrect!': 'Incorrect! Review the correct answer.',
        'Excellent': 'Excellent! You are a vocabulary master! 🏆',
        'Good': 'Good job! Keep practicing! 👍',
        'Average': 'Not bad! Study more words! 📚',
        'Poor': 'Need more practice! Keep going! 💪',
    },
    ar: {
        'Vocabulary': 'المفردات',
        'Quiz': 'الاختبار',
        'Revision': 'المراجعة',
        'Add New Word': 'إضافة كلمة جديدة',
        'English Word': 'الكلمة الإنجليزية',
        'Arabic Translation': 'الترجمة العربية',
        'Example Sentence': 'جملة مثال (اختياري)',
        'Add Word': 'إضافة كلمة',
        'Vocabulary List': 'قائمة المفردات',
        'Select Quiz Type': 'اختر نوع الاختبار',
        'Multiple Choice Questions': 'أسئلة الاختيار من متعدد',
        'Fill in the Blank': 'ملء الفراغات',
        'Matching Exercise': 'تمرين المطابقة',
        'Question': 'السؤال',
        'Check Answer': 'تحقق من الإجابة',
        'Next Question': 'السؤال التالي',
        'Restart': 'إعادة تشغيل',
        'Match the pairs': 'طابق بين الكلمات',
        'English': 'الإنجليزية',
        'Arabic': 'العربية',
        'Quick Revision': 'المراجعة السريعة',
        'Flip': 'قلب',
        'Next': 'التالي',
        'Quiz Complete!': 'تم إكمال الاختبار!',
        'Back to Quiz Menu': 'العودة إلى قائمة الاختبار',
        'Made for English Learners': 'من أجل متعلمي اللغة الإنجليزية',
        'Correct!': 'صحيح! ممتاز! 🎉',
        'Incorrect!': 'خطأ! حاول مرة أخرى.',
        'Excellent': 'ممتاز! أنت خبير في المفردات! 🏆',
        'Good': 'عمل جيد! استمر في الممارسة! 👍',
        'Average': 'ليس سيء! ادرس المزيد من الكلمات! 📚',
        'Poor': 'تحتاج إلى مزيد من الممارسة! استمر! 💪',
    }
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadVocabulary();
    setupEventListeners();
});

function initializeApp() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    switchLanguage(savedLanguage);
}

// ========================================
// LANGUAGE SWITCHING
// ========================================

function switchLanguage(lang) {
    appState.language = lang;
    localStorage.setItem('language', lang);
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(lang === 'en' ? 'enBtn' : 'arBtn').classList.add('active');
    
    // Update HTML direction
    document.body.classList.remove('rtl', 'ltr');
    document.documentElement.lang = lang;
    document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all text elements
    updateLanguageContent();
    loadVocabulary();
    if (document.getElementById('revision').classList.contains('active')) {
        displayRevisionCard();
    }
}

function updateLanguageContent() {
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = appState.language === 'en' ? 
            element.getAttribute('data-en') : 
            element.getAttribute('data-ar');
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
}

function getTranslation(key) {
    return translations[appState.language][key] || key;
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Language switching
    document.getElementById('enBtn').addEventListener('click', () => switchLanguage('en'));
    document.getElementById('arBtn').addEventListener('click', () => switchLanguage('ar'));
    
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });
    
    // Add word form
    document.getElementById('addWordForm').addEventListener('submit', handleAddWord);
    
    // Auto-translation for vocabulary form
    document.getElementById('englishWord').addEventListener('input', (e) => {
        const englishWord = e.target.value.trim();
        if (englishWord.length > 2) {
            autoTranslate(englishWord, 'en-to-ar');
            generateExampleSentence(englishWord, 'en');
        }
    });
    
    document.getElementById('arabicWord').addEventListener('input', (e) => {
        const arabicWord = e.target.value.trim();
        if (arabicWord.length > 1) {
            autoTranslate(arabicWord, 'ar-to-en');
            generateExampleSentence(arabicWord, 'ar');
        }
    });
    
    // Quiz buttons
    document.getElementById('mcqBtn').addEventListener('click', prepareMCQChoice);
    document.getElementById('fillBtn').addEventListener('click', prepareFillChoice);
    document.getElementById('mcqEnglishBtn').addEventListener('click', () => startQuiz('mcq'));
    document.getElementById('mcqArabicBtn').addEventListener('click', () => startQuiz('mcq_ar_en'));
    document.getElementById('fillEnglishBtn').addEventListener('click', () => startQuiz('fill'));
    document.getElementById('fillArabicBtn').addEventListener('click', () => startQuiz('fill_ar'));
    document.getElementById('matchBtn').addEventListener('click', () => startQuiz('match'));
    document.getElementById('spellingBtn').addEventListener('click', () => startQuiz('spelling'));
    document.getElementById('listeningBtn').addEventListener('click', () => startQuiz('listening'));
    document.getElementById('spellingPlayBtn').addEventListener('click', playSpellingAudio);
    document.getElementById('listeningPlayBtn').addEventListener('click', playListeningAudio);
    
    // Quiz controls
    document.getElementById('checkAnswerBtn').addEventListener('click', checkAnswer);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('restartQuizBtn').addEventListener('click', showQuizMenu);
    document.getElementById('restartBtn').addEventListener('click', showQuizMenu);
    
    // Revision controls
    document.getElementById('flipBtn').addEventListener('click', flipCard);
    document.getElementById('nextRevisionBtn').addEventListener('click', nextRevisionCard);
}

// ========================================
// VOCABULARY MANAGEMENT
// ========================================

function handleAddWord(e) {
    e.preventDefault();
    
    const english = document.getElementById('englishWord').value.trim();
    const arabic = document.getElementById('arabicWord').value.trim();
    const example = document.getElementById('exampleSentence').value.trim();
    
    if (!english || !arabic) {
        alert('Please fill in all required fields');
        return;
    }
    
    const word = {
        id: Date.now(),
        english: english,
        arabic: arabic,
        example: example || ''
    };
    
    appState.vocabulary.push(word);
    localStorage.setItem('vocabulary', JSON.stringify(appState.vocabulary));
    
    document.getElementById('addWordForm').reset();
    document.getElementById('englishStatus').innerHTML = '';
    document.getElementById('arabicStatus').innerHTML = '';
    document.getElementById('exampleStatus').innerHTML = '';
    document.getElementById('englishStatus').className = 'translation-status';
    document.getElementById('arabicStatus').className = 'translation-status';
    document.getElementById('exampleStatus').className = 'translation-status';
    loadVocabulary();
}

function loadVocabulary() {
    const container = document.getElementById('wordsList');
    container.innerHTML = '';
    
    if (appState.vocabulary.length === 0) {
        container.innerHTML = `<div class="card" style="grid-column: 1 / -1; text-align: center;">
            <p style="color: var(--text-secondary);">${appState.language === 'en' ? 'No words added yet. Add your first word to get started!' : 'لم يتم إضافة أي كلمات حتى الآن. أضف كلمتك الأولى للبدء!'}</p>
        </div>`;
        return;
    }
    
    appState.vocabulary.forEach(word => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';

        const header = document.createElement('div');
        header.className = 'word-card-header';

        const textContainer = document.createElement('div');
        const englishEl = document.createElement('div');
        englishEl.className = 'word-english';
        englishEl.textContent = word.english;
        const arabicEl = document.createElement('div');
        arabicEl.className = 'word-arabic';
        arabicEl.textContent = word.arabic;

        textContainer.appendChild(englishEl);
        textContainer.appendChild(arabicEl);

        const actions = document.createElement('div');
        actions.className = 'word-actions';

        const ukButton = document.createElement('button');
        ukButton.className = 'btn spell-btn';
        ukButton.type = 'button';
        ukButton.textContent = appState.language === 'en' ? 'UK' : 'بريطانى';
        ukButton.addEventListener('click', () => speakWord(word.english, 'en-GB'));

        const usButton = document.createElement('button');
        usButton.className = 'btn spell-btn';
        usButton.type = 'button';
        usButton.textContent = appState.language === 'en' ? 'US' : 'أمريكي';
        usButton.addEventListener('click', () => speakWord(word.english, 'en-US'));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.type = 'button';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => deleteWord(word.id));

        actions.appendChild(ukButton);
        actions.appendChild(usButton);
        actions.appendChild(deleteBtn);

        header.appendChild(textContainer);
        header.appendChild(actions);
        wordCard.appendChild(header);

        if (word.example) {
            const exampleEl = document.createElement('div');
            exampleEl.className = 'word-example';
            exampleEl.textContent = `"${word.example}"`;
            wordCard.appendChild(exampleEl);

            const sentenceActions = document.createElement('div');
            sentenceActions.className = 'sentence-actions';

            const ukSentenceBtn = document.createElement('button');
            ukSentenceBtn.className = 'btn spell-btn';
            ukSentenceBtn.type = 'button';
            ukSentenceBtn.textContent = appState.language === 'en' ? 'UK' : 'بريطانى';
            ukSentenceBtn.addEventListener('click', () => speakWord(word.example, 'en-GB'));

            const usSentenceBtn = document.createElement('button');
            usSentenceBtn.className = 'btn spell-btn';
            usSentenceBtn.type = 'button';
            usSentenceBtn.textContent = appState.language === 'en' ? 'US' : 'أمريكي';
            usSentenceBtn.addEventListener('click', () => speakWord(word.example, 'en-US'));

            sentenceActions.appendChild(ukSentenceBtn);
            sentenceActions.appendChild(usSentenceBtn);
            wordCard.appendChild(sentenceActions);
        }

        container.appendChild(wordCard);
    });
}

function deleteWord(id) {
    if (confirm('Are you sure you want to delete this word?')) {
        appState.vocabulary = appState.vocabulary.filter(w => w.id !== id);
        localStorage.setItem('vocabulary', JSON.stringify(appState.vocabulary));
        loadVocabulary();
    }
}

// ========================================
// TAB NAVIGATION
// ========================================

function handleTabClick(e) {
    const tabName = e.target.getAttribute('data-tab');
    showTab(tabName);
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Initialize revision if needed
    if (tabName === 'revision') {
        initializeRevision();
    }
}

// ========================================
// QUIZ FUNCTIONALITY
// ========================================

function prepareFillChoice() {
    if (appState.vocabulary.length < 2) {
        alert(appState.language === 'en' ? 
            'Please add at least 2 words to start the quiz' : 
            'يرجى إضافة 2 على الأقل من الكلمات لبدء الاختبار');
        return;
    }

    resetQuizState();
    appState.quizType = 'fill_choice';

    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    showFillChoiceMenu();
}

function prepareMCQChoice() {
    if (appState.vocabulary.length < 2) {
        alert(appState.language === 'en' ? 
            'Please add at least 2 words to start the quiz' : 
            'يرجى إضافة 2 على الأقل من الكلمات لبدء الاختبار');
        return;
    }

    resetQuizState();
    appState.quizType = 'mcq_choice';

    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    showMCQChoiceMenu();
}

function resetQuizState() {
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.questionsAttempted = 0;
    appState.correctCount = 0;
    appState.incorrectCount = 0;
    appState.selectedAnswers = [];
    appState.currentQuestion = null;
    appState.matchingPairs = [];
    updateLiveScore();
    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement) {
        feedbackElement.innerHTML = '';
        feedbackElement.classList.remove('show', 'correct', 'incorrect');
    }
}

function showFillChoiceMenu() {
    document.querySelectorAll('.quiz-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('fillChoiceMenu').style.display = 'block';
    document.getElementById('fillChoiceMenu').classList.add('active');
}

function showMCQChoiceMenu() {
    document.querySelectorAll('.quiz-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('mcqChoiceMenu').style.display = 'block';
    document.getElementById('mcqChoiceMenu').classList.add('active');
}

function startQuiz(type) {
    if (appState.vocabulary.length < 2) {
        alert(appState.language === 'en' ? 
            'Please add at least 2 words to start the quiz' : 
            'يرجى إضافة 2 على الأقل من الكلمات لبدء الاختبار');
        return;
    }
    
    appState.quizType = type;
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.questionsAttempted = 0;
    appState.correctCount = 0;
    appState.incorrectCount = 0;
    appState.selectedAnswers = [];
    appState.currentQuestion = null;
    appState.matchingPairs = [];
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('checkAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    
    document.getElementById('fillChoiceMenu').style.display = 'none';
    document.getElementById('mcqChoiceMenu').style.display = 'none';
    displayQuestion();
}

function displayQuestion() {
    const questionNum = appState.currentQuestionIndex + 1;
    document.getElementById('questionNumber').textContent = questionNum;
    document.getElementById('totalQuestions').textContent = '∞';
    document.getElementById('progressFill').style.width = '100%';
    updateLiveScore();
    
    // Hide all quiz sections
    document.querySelectorAll('.quiz-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    document.getElementById('mcqChoiceMenu').style.display = 'none';
    document.getElementById('fillChoiceMenu').style.display = 'none';
    document.getElementById('fillSection').style.display = 'none';
    document.getElementById('spellingSection').style.display = 'none';
    document.getElementById('listeningSection').style.display = 'none';
    
    // Clear feedback
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').classList.remove('show', 'correct', 'incorrect');
    
    if (appState.quizType === 'mcq' || appState.quizType === 'mcq_ar_en') {
        displayMCQ();
    } else if (appState.quizType === 'fill' || appState.quizType === 'fill_ar') {
        displayFill();
    } else if (appState.quizType === 'match') {
        displayMatching();
    } else if (appState.quizType === 'spelling') {
        displaySpelling();
    } else if (appState.quizType === 'listening') {
        displayListening();
    }
}

function updateLiveScore() {
    document.getElementById('liveScore').textContent = appState.score;
    document.getElementById('liveCorrect').textContent = appState.correctCount || 0;
    document.getElementById('liveIncorrect').textContent = appState.incorrectCount || 0;
    document.getElementById('liveAttempts').textContent = appState.questionsAttempted;
}


function displayMCQ() {
    const mcqSection = document.getElementById('mcqSection');
    mcqSection.classList.add('active');
    mcqSection.style.display = 'block';
    appState.currentQuestion = getRandomWord();
    const currentWord = appState.currentQuestion;
    const reverseMode = appState.quizType === 'mcq_ar_en';
    const promptText = reverseMode ?
        (appState.language === 'en' ?
            `What is the English translation of "${currentWord.arabic}"?` :
            `ما الترجمة الإنجليزية لـ "${currentWord.arabic}"؟`) :
        (appState.language === 'en' ?
            `What is the Arabic translation of "${currentWord.english}"?` :
            `ما هي الترجمة العربية لـ "${currentWord.english}"؟`);

    document.getElementById('mcqQuestion').textContent = promptText;

    const correctAnswer = reverseMode ? currentWord.english : currentWord.arabic;
    const options = [correctAnswer];
    const otherWords = appState.vocabulary.filter(w => w.id !== currentWord.id);

    while (options.length < 4 && otherWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        options.push(reverseMode ? otherWords[randomIndex].english : otherWords[randomIndex].arabic);
        otherWords.splice(randomIndex, 1);
    }

    const shuffledOptions = shuffleArray(options);
    const optionsContainer = document.getElementById('mcqOptions');
    optionsContainer.innerHTML = '';

    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectMCQOption(option, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectMCQOption(option, element) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    appState.selectedAnswers[appState.currentQuestionIndex] = option;
}

function displayFill() {
    document.getElementById('fillSection').style.display = 'block';
    document.getElementById('fillSection').classList.add('active');
    
    appState.currentQuestion = getRandomWord();
    const currentWord = appState.currentQuestion;
    const reverseMode = appState.quizType === 'fill_ar';
    
    document.getElementById('fillQuestion').textContent = 
        appState.language === 'en' ? 
        (reverseMode ?
            `Fill in the English translation: "${currentWord.arabic}" = ____` :
            `Fill in the Arabic translation: "${currentWord.english}" = ____`) :
        (reverseMode ?
            `أكمل الترجمة الإنجليزية: "${currentWord.arabic}" = ____` :
            `أكمل الترجمة العربية: "${currentWord.english}" = ____`);
    
    const fillInput = document.getElementById('fillAnswer');
    fillInput.value = '';
    fillInput.focus();
}

function displayMatching() {
    const matchSection = document.getElementById('matchSection');
    matchSection.classList.add('active');
    matchSection.style.display = 'block';
    
    const matchSize = Math.min(5, appState.vocabulary.length);
    const matchWords = shuffleArray([...appState.vocabulary]).slice(0, matchSize);
    appState.currentQuestion = { matchWords };
    
    const leftContainer = document.getElementById('matchLeft');
    const rightContainer = document.getElementById('matchRight');
    
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';
    
    const shuffledRight = shuffleArray([...matchWords]);
    
    matchWords.forEach((word, index) => {
        const leftItem = document.createElement('div');
        leftItem.className = 'match-item left';
        leftItem.textContent = word.english;
        leftItem.dataset.index = index;
        leftItem.dataset.wordId = word.id;
        leftItem.addEventListener('click', () => selectMatchItem(leftItem, 'left'));
        leftContainer.appendChild(leftItem);
    });
    
    shuffledRight.forEach(word => {
        const rightItem = document.createElement('div');
        rightItem.className = 'match-item right';
        rightItem.textContent = word.arabic;
        rightItem.dataset.wordId = word.id;
        rightItem.addEventListener('click', () => selectMatchItem(rightItem, 'right'));
        rightContainer.appendChild(rightItem);
    });
}

let selectedLeftItem = null;
let selectedRightItem = null;

function selectMatchItem(element, side) {
    element.classList.toggle('selected');
    
    if (side === 'left') {
        if (selectedLeftItem) {
            selectedLeftItem.classList.remove('selected');
        }
        selectedLeftItem = element.classList.contains('selected') ? element : null;
    } else {
        if (selectedRightItem) {
            selectedRightItem.classList.remove('selected');
        }
        selectedRightItem = element.classList.contains('selected') ? element : null;
    }
    
    // Auto check if both selected
    if (selectedLeftItem && selectedRightItem) {
        setTimeout(() => {
            checkMatchingPair();
        }, 300);
    }
}

function checkMatchingPair() {
    // Validate if the pairing is correct by comparing wordIds
    const leftWordId = selectedLeftItem.dataset.wordId;
    const rightWordId = selectedRightItem.dataset.wordId;
    
    const isCorrect = leftWordId === rightWordId;
    
    appState.questionsAttempted++;
    if (isCorrect) {
        appState.score++;
        appState.correctCount = (appState.correctCount || 0) + 1;
        selectedLeftItem.classList.add('correct-match');
        selectedRightItem.classList.add('correct-match');
        showFeedback(true, getTranslation('Correct!'), null);
    } else {
        appState.incorrectCount = (appState.incorrectCount || 0) + 1;
        selectedLeftItem.classList.add('incorrect-match');
        selectedRightItem.classList.add('incorrect-match');
        
        // Find the correct match for the selected left item
        const correctRightItem = document.querySelector(`.match-item.right[data-word-id="${leftWordId}"]`);
        const correctAnswer = correctRightItem ? correctRightItem.textContent : 'Unknown';
        showFeedback(false, getTranslation('Incorrect!'), correctAnswer);
    }
    
    updateLiveScore();
    
    // Remove the matched/incorrect items after a delay
    setTimeout(() => {
        selectedLeftItem.classList.remove('selected', 'correct-match', 'incorrect-match');
        selectedRightItem.classList.remove('selected', 'correct-match', 'incorrect-match');
        selectedLeftItem = null;
        selectedRightItem = null;
    }, 1000);
}

function checkAnswer() {
    const currentWord = appState.currentQuestion;
    let isCorrect = false;
    let correctAnswerText = '';
    
    if (appState.quizType === 'mcq' || appState.quizType === 'mcq_ar_en') {
        const expectedAnswer = appState.quizType === 'mcq' ? currentWord.arabic : currentWord.english;
        isCorrect = appState.selectedAnswers[appState.currentQuestionIndex] === expectedAnswer;
        correctAnswerText = expectedAnswer;
    } else if (appState.quizType === 'fill' || appState.quizType === 'fill_ar') {
        const userAnswer = document.getElementById('fillAnswer').value.trim().toLowerCase();
        const correctAnswer = appState.quizType === 'fill' ? currentWord.arabic.toLowerCase() : currentWord.english.toLowerCase();
        isCorrect = userAnswer === correctAnswer;
        correctAnswerText = appState.quizType === 'fill' ? currentWord.arabic : currentWord.english;
    } else if (appState.quizType === 'spelling') {
        const userAnswer = document.getElementById('spellingAnswer').value.trim().toLowerCase();
        const correctAnswer = currentWord.english.toLowerCase();
        isCorrect = userAnswer === correctAnswer;
        correctAnswerText = currentWord.english;
    } else if (appState.quizType === 'listening') {
        const selectedAnswer = appState.selectedAnswers[appState.currentQuestionIndex];
        isCorrect = selectedAnswer === currentWord.arabic;
        correctAnswerText = currentWord.arabic;
    } else if (appState.quizType === 'match') {
        // Matching is handled separately in checkMatchingPair
        return;
    }
    
    appState.questionsAttempted++;
    if (isCorrect) {
        appState.score++;
        appState.correctCount = (appState.correctCount || 0) + 1;
        showFeedback(true, getTranslation('Correct!'), null);
    } else {
        appState.incorrectCount = (appState.incorrectCount || 0) + 1;
        showFeedback(false, getTranslation('Incorrect!'), correctAnswerText);
    }
    updateLiveScore();
    
    document.getElementById('checkAnswerBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
}

function showFeedback(isCorrect, message, correctAnswer = null) {
    const feedbackElement = document.getElementById('feedback');
    let feedbackHTML = `<div class="feedback-message">${message}</div>`;
    
    if (!isCorrect && correctAnswer) {
        const correctLabel = appState.language === 'en' ? 'Correct answer: ' : 'الإجابة الصحيحة: ';
        feedbackHTML += `<div class="correct-answer-display">${correctLabel}<strong>${correctAnswer}</strong></div>`;
    }
    
    feedbackElement.innerHTML = feedbackHTML;
    feedbackElement.classList.add('show', isCorrect ? 'correct' : 'incorrect');
}

function nextQuestion() {
    appState.currentQuestionIndex++;
    document.getElementById('checkAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    displayQuestion();
}

function showScore() {
    const totalQuestions = appState.currentQuiz.length;
    const percentage = Math.round((appState.score / totalQuestions) * 100);
    
    let message = '';
    if (percentage >= 80) {
        message = getTranslation('Excellent');
    } else if (percentage >= 60) {
        message = getTranslation('Good');
    } else if (percentage >= 40) {
        message = getTranslation('Average');
    } else {
        message = getTranslation('Poor');
    }
    
    document.getElementById('scoreNumber').textContent = `${appState.score}/${totalQuestions}`;
    document.getElementById('scorePercentage').textContent = `${percentage}%`;
    document.getElementById('scoreMessage').textContent = message;
    
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('scoreSection').style.display = 'flex';
}

function showQuizMenu() {
    document.getElementById('quizMenu').style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('checkAnswerBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
}

// ========================================
// REVISION FUNCTIONALITY
// ========================================

function initializeRevision() {
    if (appState.vocabulary.length === 0) {
        document.getElementById('revisionContent').innerHTML = 
            `<p style="color: var(--text-secondary);">${appState.language === 'en' ? 'No words to revise. Add some words first!' : 'لا توجد كلمات للمراجعة. أضف بعض الكلمات أولاً!'}</p>`;
        document.getElementById('revisionControls').style.display = 'none';
        return;
    }
    
    document.getElementById('revisionControls').style.display = 'flex';
    appState.currentRevisionIndex = 0;
    displayRevisionCard();
}

function displayRevisionCard() {
    const word = appState.vocabulary[appState.currentRevisionIndex];
    const content = document.getElementById('revisionContent');
    
    content.innerHTML = `
        <div class="revision-word" id="revisionCard">
            ${appState.language === 'en' ? word.english : word.arabic}
        </div>
    `;
    
    document.getElementById('revisionCard').addEventListener('click', flipCard);
}

function flipCard() {
    const card = document.getElementById('revisionCard');
    const word = appState.vocabulary[appState.currentRevisionIndex];
    
    if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        card.textContent = appState.language === 'en' ? word.english : word.arabic;
    } else {
        card.classList.add('flipped');
        card.textContent = appState.language === 'en' ? word.arabic : word.english;
    }
}

function nextRevisionCard() {
    appState.currentRevisionIndex++;
    if (appState.currentRevisionIndex >= appState.vocabulary.length) {
        appState.currentRevisionIndex = 0;
    }
    displayRevisionCard();
}

// ========================================
// SPELLING QUIZ
// ========================================

function displaySpelling() {
    document.getElementById('spellingSection').classList.add('active');
    document.getElementById('spellingSection').style.display = 'block';
    
    appState.currentQuestion = getRandomWord();
    const currentWord = appState.currentQuestion;
    
    const promptText = appState.language === 'en' ?
        'Listen to the audio and type the English word' :
        'استمع إلى الصوت واكتب الكلمة الإنجليزية';
    
    document.getElementById('spellingQuestion').textContent = promptText;
    document.getElementById('spellingAnswer').value = '';
    document.getElementById('spellingAnswer').focus();
}

function playSpellingAudio() {
    if (!appState.currentQuestion) return;
    const word = appState.currentQuestion;
    speakWord(word.english, 'en-US');
}

// ========================================
// LISTENING COMPREHENSION QUIZ
// ========================================

function displayListening() {
    document.getElementById('listeningSection').classList.add('active');
    document.getElementById('listeningSection').style.display = 'block';
    
    appState.currentQuestion = getRandomWord();
    const currentWord = appState.currentQuestion;
    
    document.getElementById('listeningQuestion').textContent = 
        appState.language === 'en' ?
        'What is the meaning of the word you just heard?' :
        '\u0645\u0627 \u0647\u0648 \u0645\u0639\u0646\u0649 \u0627\u0644\u0643\u0644\u0645\u0629 \u0627\u0644\u062a\u064a \u0633\u0645\u0639\u062a\u0647\u0627 \u0644\u0644\u062a\u0648';
    
    // Generate listening comprehension options
    const correctAnswer = currentWord.arabic;
    const options = [correctAnswer];
    const otherWords = appState.vocabulary.filter(w => w.id !== currentWord.id);
    
    while (options.length < 4 && otherWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        options.push(otherWords[randomIndex].arabic);
        otherWords.splice(randomIndex, 1);
    }
    
    const shuffledOptions = shuffleArray(options);
    const optionsContainer = document.getElementById('listeningOptions');
    optionsContainer.innerHTML = '';
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectListeningOption(option, btn));
        optionsContainer.appendChild(btn);
    });
    
    // Auto-play audio on display
    setTimeout(() => playListeningAudio(), 500);
}

function playListeningAudio() {
    if (!appState.currentQuestion) return;
    const word = appState.currentQuestion;
    speakWord(word.english, 'en-US');
}

function selectListeningOption(option, element) {
    document.querySelectorAll('#listeningOptions .option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
    appState.selectedAnswers[appState.currentQuestionIndex] = option;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomWord() {
    if (appState.vocabulary.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * appState.vocabulary.length);
    return appState.vocabulary[randomIndex];
}

function speakWord(word, voiceLang) {
    if (!window.speechSynthesis) {
        alert(appState.language === 'en' ? 'Speech synthesis is not supported in this browser.' : 'الميزة غير مدعومة في هذا المتصفح.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    const voice = getSpeechVoice(voiceLang);

    if (voice) {
        utterance.voice = voice;
    }
    utterance.lang = voiceLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

function getSpeechVoice(lang) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
        window.speechSynthesis.onvoiceschanged = () => getSpeechVoice(lang);
        return null;
    }

    const exactVoice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase());
    if (exactVoice) return exactVoice;

    return voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) || voices[0];
}

// Auto-translation function
async function autoTranslate(text, direction) {
    try {
        const englishInput = document.getElementById('englishWord');
        const arabicInput = document.getElementById('arabicWord');
        const englishStatus = document.getElementById('englishStatus');
        const arabicStatus = document.getElementById('arabicStatus');
        
        // Clear previous status
        englishStatus.innerHTML = '';
        arabicStatus.innerHTML = '';
        englishStatus.className = 'translation-status';
        arabicStatus.className = 'translation-status';
        
        if (direction === 'en-to-ar') {
            englishStatus.textContent = '⏳ Translating...';
            englishStatus.classList.add('translating');
            
            const translation = await translateText(text, 'en', 'ar');
            if (translation) {
                arabicInput.value = translation;
                englishStatus.textContent = '✓ Translated';
                englishStatus.classList.remove('translating');
                englishStatus.classList.add('success');
                setTimeout(() => {
                    englishStatus.innerHTML = '';
                    englishStatus.className = 'translation-status';
                }, 2000);
            }
        } else if (direction === 'ar-to-en') {
            arabicStatus.textContent = '⏳ Translating...';
            arabicStatus.classList.add('translating');
            
            const translation = await translateText(text, 'ar', 'en');
            if (translation) {
                englishInput.value = translation;
                arabicStatus.textContent = '✓ Translated';
                arabicStatus.classList.remove('translating');
                arabicStatus.classList.add('success');
                setTimeout(() => {
                    arabicStatus.innerHTML = '';
                    arabicStatus.className = 'translation-status';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Translation error:', error);
        document.getElementById('englishStatus').innerHTML = '';
        document.getElementById('arabicStatus').innerHTML = '';
        document.getElementById('englishStatus').className = 'translation-status';
        document.getElementById('arabicStatus').className = 'translation-status';
    }
}

// Translation API call using MyMemory (free, no auth required)
async function translateText(text, sourceLang, targetLang) {
    try {
        const langCodes = {
            'en': 'en',
            'ar': 'ar'
        };
        
        const source = langCodes[sourceLang];
        const target = langCodes[targetLang];
        
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`,
            {
                method: 'GET',
                timeout: 5000
            }
        );
        
        if (!response.ok) {
            throw new Error('Translation API error');
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        
        return null;
    } catch (error) {
        console.error('Translation fetch error:', error);
        return null;
    }
}

// Generate example sentence based on the word
async function generateExampleSentence(word, language) {
    try {
        const exampleInput = document.getElementById('exampleSentence');
        const exampleStatus = document.getElementById('exampleStatus');
        
        exampleStatus.textContent = '⏳ Generating...';
        exampleStatus.className = 'translation-status translating';
        
        let sentence = '';
        
        if (language === 'en') {
            // Generate English example sentence
            sentence = await getEnglishExampleSentence(word);
        } else if (language === 'ar') {
            // Generate Arabic example sentence
            sentence = await getArabicExampleSentence(word);
        }
        
        if (sentence) {
            exampleInput.value = sentence;
            exampleStatus.textContent = '✓ Generated';
            exampleStatus.classList.remove('translating');
            exampleStatus.classList.add('success');
            
            setTimeout(() => {
                exampleStatus.innerHTML = '';
                exampleStatus.className = 'translation-status';
            }, 2000);
        } else {
            exampleStatus.innerHTML = '';
            exampleStatus.className = 'translation-status';
        }
    } catch (error) {
        console.error('Example generation error:', error);
        exampleStatus.innerHTML = '';
        exampleStatus.className = 'translation-status';
    }
}

// Get example sentence for English word
async function getEnglishExampleSentence(word) {
    try {
        // Generate a wider variety of example sentences by using several patterns
        const raw = String(word).trim();
        if (!raw) return null;
        const lower = raw.toLowerCase();
        const cap = raw.charAt(0).toUpperCase() + raw.slice(1);

        const templates = [
            `She used "${lower}" in her presentation yesterday.`,
            `The ${lower} was essential for solving the problem.`,
            `He described the situation as "${lower}".`,
            `In many contexts, "${lower}" appears naturally.`,
            `${cap} often appears in academic texts.`,
            `Can you use "${lower}" in a sentence?`,
            `We studied the meaning of "${lower}" in class.`,
            `This example shows how "${lower}" can be used.`,
            `People frequently encounter "${lower}" at work.`,
            `Reading helped me understand "${lower}" better.`,
            `The concept of "${lower}" is important in this field.`,
            `She gave an example using the word "${lower}".`,
            `They noticed the ${lower} during the experiment.`,
            `The book explains what "${lower}" means.`,
            `It is common to hear "${lower}" in news reports.`,
            `Try to make your own sentence with "${lower}".`,
            `A simple example: "${cap} is useful in daily speech."`,
            `Students often practice using "${lower}" in exercises.`,
            `You might find "${lower}" in this paragraph.`
        ];

        // pick a random template
        return templates[Math.floor(Math.random() * templates.length)];
    } catch (error) {
        console.error('Error generating English sentence:', error);
        return null;
    }
}

// Get example sentence for Arabic word
async function getArabicExampleSentence(word) {
    try {
        const raw = String(word).trim();
        if (!raw) return null;

        const templates = [
            `استخدمتُ كلمة "${raw}" في جملتي اليوم.`,
            `تعتبر "${raw}" كلمة مهمة في هذا السياق.`,
            `سمعتُ كلمة "${raw}" في الأخبار.`,
            `تعلمت معنى كلمة "${raw}" في الدرس.`,
            `يمكنك استخدام كلمة "${raw}" عند الكتابة.`,
            `يستعمل الناس كلمة "${raw}" في الحديث اليومي.`,
            `مثال: "${raw}" يساعد في توضيح الفكرة.`,
            `الكثير من الطلاب يجدون "${raw}" مفيدة.`,
            `في العمل، قد تصادف كلمة "${raw}" كثيراً.`,
            `دعنا نضع "${raw}" في جملة بسيطة.`,
            `الجملة التالية توضح معنى "${raw}".`,
            `استخدم المعلم كلمة "${raw}" كمثال.`
        ];

        return templates[Math.floor(Math.random() * templates.length)];
    } catch (error) {
        console.error('Error generating Arabic sentence:', error);
        return null;
    }
}
