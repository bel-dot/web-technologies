'use strict'

const selects = [ ...document.getElementsByClassName('form-select') ];
const inputs = [ ...document.getElementsByTagName('input'), ...selects ];

const fire = 'https://media.tenor.com/3QNUdJR3PUgAAAAi/twitch-youngmulti.gif';

const formWindow = document.getElementById('form-window'),
    formsDiv = document.getElementById('forms-div'),
    rememberCheckbox = document.getElementById('remember'),
    startButton = document.getElementById('start-button'),
    backgroundMusic = new Audio('./thrash.mp3'),
    tabIcon = document.getElementById('icon'),
    laughSound = new Audio('./laugh.mp3'),
    goodSound = new Audio('./good.mp3'),
    dontForget = new Audio('./dont_forget.mp3');

backgroundMusic.muted = true;
backgroundMusic.autoplay = true;

let forgot = localStorage.getItem('remember') === 'yes';

rememberCheckbox.addEventListener('change', () => {
    if(!forgot && rememberCheckbox.checked) {
        forgot = true;
        backgroundMusic.pause();
        dontForget.currentTime = 0;
        dontForget.play();
        tabIcon.href = './favicon2.png';
    }
});

dontForget.addEventListener('ended', returnBackgroundMusic)

function returnBackgroundMusic() {
    backgroundMusic.volume = 0;
    backgroundMusic.play();
    tabIcon.href = './favicon.png';
    
    const intervalId = setInterval(() => {
        backgroundMusic.volume += 0.01;
        if(backgroundMusic.volume >= 0.5) {
            backgroundMusic.volume = 0.5;
            clearInterval(intervalId);
        }
    }, 5);
}

inputs.forEach(element => {
    element.addEventListener('input', () => {
        element.className = '';
    })
});

selects.forEach(select => {
    select.addEventListener('change', () => {
        if(select.value != 'none') {
            select.options[0].style.display = 'none';
        }
    })
})

const countryInput = document.getElementById('country'),
    cityInput = document.getElementById('city');

startButton.addEventListener('click', startPage);

function startPage() {

    if(countryInput.value != '') {
        onCountryChange();
    }
    
    startButton.hidden = true;
    document.body.style.backgroundImage = `url('${fire}')`;
    
    backgroundMusic.volume = 0.5;
    laughSound.volume = 0.5;
    goodSound.volume = 0.5;
    dontForget.volume = 0.5;
    playBackground();

    if(localStorage.getItem('username') != null && localStorage.getItem('password') != null) {
        formWindow.style.display = 'none';
        startService();
    }
    else {
        setTimeout(runIntro, 500);
    }
}

function playBackground() {
    backgroundMusic.preload = 'auto';
    backgroundMusic.currentTime = 0;
    backgroundMusic.loop = true;
    backgroundMusic.muted = false;
    backgroundMusic.play();
}

function runIntro() {
    formWindow.classList.toggle('intro');
    formsDiv.style.visibility = 'hidden';
    
    setTimeout(() => {
        formWindow.classList.toggle('intro');
        formWindow.classList.toggle('active');
        formsDiv.style.visibility = 'visible';
    }, 6000);
}

countryInput.addEventListener('change', onCountryChange);

function onCountryChange() {
    for(const option of document.querySelectorAll('#city option')) {
        option.style.display = 'none';
    }

    const selectedGroup = document.getElementsByClassName(`${countryInput.value}-option`);
    for(const option of selectedGroup) {
        option.style.display = 'initial';
    }
}

const registerForm = document.forms.register,
    loginForm = document.forms.login,
    succesfullBlock = document.getElementById('all-valid'),
    succesfullLoginBlock = document.getElementById('all-valid-login'),
    registerBtn = document.getElementById('register'),
    loginBtn = document.getElementById('login');


registerBtn.addEventListener('click', () => {
    loginBtn.classList.remove('active');
    registerBtn.classList.add('active');
    registerForm.style.display = 'flex';
    loginForm.style.display = 'none';
})

loginBtn.addEventListener('click', () => {
    registerBtn.classList.remove('active');
    loginBtn.classList.add('active');
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
})


function validateInput(input) {
    input.className = '';        
    
    if(input.value.length < 3 || input.value.length > 15) {
        input.className = 'invalid';
        return false;
    }
    else input.className = 'valid';
    
    return true;
}

function validateEmail(email) {
    const pattern = /.*@.*\..*/i;
    
    email.className = pattern.test(email.value) ? 'valid' : 'invalid';
    return pattern.test(email.value);
}

function validatePhone(phone) {
    const pattern = /\+380\d{9}/i;
    
    phone.className = pattern.test(phone.value) ? 'valid' : 'invalid';
    return pattern.test(phone.value);
}

function validateLoginPassword(pass) {
    pass.className = pass.value.length >= 6 ? 'valid' : 'invalid';
    return pass.value.length >= 6;
}

function validatePassword(pass, confirm) {
    pass.className = pass.value.length >= 6 ? 'valid' : 'invalid';
    confirm.className = confirm.value == pass.value && confirm.value.length >= 6 ? 'valid' : 'invalid';
    
    return pass.className == 'valid' && confirm.className == 'valid';
}

function validateDate(date) {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 12);
    if(date.value != '') {
        const dateValue = date.valueAsDate;
        date.className = dateValue < today ? 'valid' : 'invalid';
        return dateValue < today;
    }
    else {
        date.className = 'invalid';
        return false;
    }
}

function validateUsername(username) {
    username.className = username.value.length > 0 ? 'valid' : 'invalid';
    return username.value.length > 0;
}

function validateSelects() {
    let validated = true;
    for(const select of selects) {
        if(select.value == 'none') {
            select.classList.remove('valid');
            select.classList.add('invalid');
            validated = false;
        }
        else {
            select.classList.remove('invalid');
            select.classList.add('valid');
        }
    }
    return validated;
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const validates = [
        validateInput(registerForm['first-name']),
        validateInput(registerForm['last-name']),
        validateEmail(registerForm.email),
        validatePassword(registerForm.pass, registerForm['confirm-pass']),
        validatePhone(registerForm.phone),
        validateDate(registerForm['date-birth']),
        validateSelects(),
    ];

    if(validates.every(validate => validate)) {
        registerForm.reset();
        laughSound.currentTime = 0;
        laughSound.play();
        succesfullBlock.classList.toggle('show')
        setTimeout(() => {
            succesfullBlock.classList.toggle('show')
        }, 6000);
    } 
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const validates = [
        validateLoginPassword(loginForm.pass),
        validateUsername(loginForm.username),
    ];
    
    if(validates.every(validate => validate)) {
        if(loginForm.remember.checked) {
            localStorage.setItem('remember', 'yes');
        }
        localStorage.setItem('username', loginForm.username.value);
        localStorage.setItem('password', loginForm.pass.value);
        loginForm.reset();
        loginForm.pass.className = '';
        loginForm.username.className = '';
        
        tabIcon.href = './favicon.png';
        dontForget.pause();
        backgroundMusic.play();
        formWindow.style.display = 'none';
        formWindow.classList.remove('active');
        startService();
    } 
});

window.addEventListener('unload', () => {
    if(localStorage.getItem('remember') != 'yes') {
        localStorage.clear();
        friends = [];
        thrashed = [];
    }
})