let currentPasscode = '';
const correctPasscode = '013122'; // Change this to your 6-digit passcode!

function enterDigit(digit) {
    if (currentPasscode.length < 6) {
        currentPasscode += digit;
        updatePasscodeDisplay();

        // Reset title if user starts typing again
        const title = document.getElementById('passcodeTitle');
        title.textContent = 'enter passcode';
        title.classList.remove('error');

        // Auto-check when 6 characters entered
        if (currentPasscode.length === 6) {
            setTimeout(checkPasscode, 300);
        }
    }
}

function updatePasscodeDisplay() {
    const hearts = document.querySelectorAll('.heart-dot');
    hearts.forEach((heart, index) => {
        if (index < currentPasscode.length) {
            heart.textContent = '❤️';
            heart.classList.add('filled');
        } else {
            heart.textContent = '🤍';
            heart.classList.remove('filled');
        }
    });
}

function checkPasscode() {
    if (currentPasscode === correctPasscode) {
        // Redirect to another webpage
        window.location.href = "homepage.html"; // change this to your link
    } else {
        // Show error in title
        const title = document.getElementById('passcodeTitle');
        title.textContent = 'wrong passcode';
        title.classList.add('error');

        // Make hearts turn broken briefly
        const hearts = document.querySelectorAll('.heart-dot.filled');
        hearts.forEach(heart => {
            heart.textContent = '💔';
        });

        // Shake animation
        const passcodeDisplay = document.getElementById('passcodeDisplay');
        passcodeDisplay.classList.add('passcode-shake');

        setTimeout(() => {
            passcodeDisplay.classList.remove('passcode-shake');
            currentPasscode = '';
            updatePasscodeDisplay();

            // Reset title after 2 seconds
            setTimeout(() => {
                title.textContent = 'enter passcode';
                title.classList.remove('error');
            }, 2000);
        }, 1000);
    }
}


// Allow keyboard input for passcode
document.addEventListener('keydown', function (e) {
    if (e.key >= '0' && e.key <= '9') {
        enterDigit(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (currentPasscode.length > 0) {
            currentPasscode = currentPasscode.slice(0, -1);
            updatePasscodeDisplay();

            // Reset title
            const title = document.getElementById('passcodeTitle');
            title.textContent = 'enter passcode';
            title.classList.remove('error');
        }
    }
});


const startDate = new Date('2022-01-31T00:00:00');

function updateCountdown() {
    const now = new Date();
    const timeDiff = now - startDate;

    // Calculate totals
    const totalSeconds = Math.floor(timeDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate months precisely
    let months = 0;
    let currentDate = new Date(startDate);
    while (currentDate < now) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate <= now) {
            months++;
        }
    }

    const weeks = Math.floor(totalDays / 7);

    // Update displays
    document.getElementById('months').textContent = months;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('weeks').textContent = weeks.toLocaleString();
    document.getElementById('hours').textContent = totalHours.toLocaleString();
    document.getElementById('minutes').textContent = totalMinutes.toLocaleString();
    document.getElementById('seconds').textContent = totalSeconds.toLocaleString();
}

updateCountdown();
setInterval(updateCountdown, 1000); // update every second

// Generate floating hearts
const heartsContainer = document.querySelector('.hearts');

function createHeart() {
    const heart = document.createElement('span');
    heart.textContent = '♥'; // heart shape
    heart.style.left = Math.random() * 100 + 'vw'; // random horizontal
    heart.style.fontSize = Math.random() * 20 + 15 + 'px'; // random size
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's'; // random speed
    heartsContainer.appendChild(heart);

    // remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

setInterval(createHeart, 500); // new heart every 0.5s

for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
        piece.dataset.correct = row * size + col; // correct index
        positions.push(piece);
    }
}

// Shuffle pieces
positions.sort(() => Math.random() - 0.5);
positions.forEach(p => container.appendChild(p));

// Drag and drop logic
let dragSrc = null;

container.addEventListener('dragstart', e => {
    if (e.target.classList.contains('piece')) {
        dragSrc = e.target;
        e.dataTransfer.setData('text/plain', '');
    }
});

container.addEventListener('dragover', e => {
    e.preventDefault();
});

container.addEventListener('drop', e => {
    if (e.target.classList.contains('piece') && dragSrc !== e.target) {
        const srcNext = dragSrc.nextSibling;
        const targetNext = e.target.nextSibling;
        container.insertBefore(dragSrc, targetNext);
        container.insertBefore(e.target, srcNext);
    }
});

// Smooth scroll reveal
// First observer (for .photo-item)
const observerOptions1 = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer1 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions1);

document.querySelectorAll('.photo-item').forEach(item => {
    observer1.observe(item);
});


// Second observer (for .letter-card, .reason-item)
const observerOptions2 = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animationPlayState = 'running';
            }, index * 150);
        }
    });
}, observerOptions2);

document.querySelectorAll('.letter-card, .reason-item').forEach(item => {
    observer2.observe(item);
});


// Observe all animated elements
document.querySelectorAll('.letter-card, .reason-item').forEach(item => {
    observer.observe(item);
});

// Set random rotations for natural scrapbook feel
document.querySelectorAll('.letter-card').forEach((card, index) => {
    const rotations = [-2, 1.5, -1, 2.5];
    card.style.setProperty('--rotation', `${rotations[index % rotations.length]}deg`);
});

// Add subtle floating animation
let floatTime = 0;
setInterval(() => {
    floatTime += 0.01;
    document.querySelectorAll('.letter-card, .reason-item').forEach((item, index) => {
        const float = Math.sin(floatTime + index * 0.3) * 2;
        if (!item.matches(':hover')) {
            const currentTransform = item.style.transform || '';
            if (!currentTransform.includes('translateY')) {
                item.style.transform += ` translateY(${float}px)`;
            }
        }
    });
}, 100);

// Gentle mouse parallax
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 10;

    document.querySelectorAll('.letter-envelope').forEach((envelope, index) => {
        envelope.style.transform = `rotate(-8deg) translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`;
    });
});

