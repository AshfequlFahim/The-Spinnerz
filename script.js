const spinner = document.getElementById('spinner');
const bgMusic = document.getElementById('bgMusic');
const fullSpinSound = document.getElementById('fullSpinSound'); // Renamed audio element

let currentVolume = 1.0;
const volumeDecrement = 0.1;
let rotation = 0;
let isSpinning = false;
let animationFrameId;
let initialRotation = 0;
rotation = initialRotation;
spinner.style.transform = `rotate(${rotation}deg)`;
const spinDuration = 33000; // Match your sound effect duration (in milliseconds)
let initialSpeed = 8; // Adjust initial speed as needed
let currentSpeed = 0;
const maxSpeed = 15; // Adjust max speed as needed
let decelerationRate = 0.994; // Adjust deceleration as needed
let spinStartTime;
let soundStartTime; // To track when the sound started

function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(error => {
            console.error("Error playing sound:", error);
        });
    }
}

function rotate() {
    rotation += currentSpeed;
    spinner.style.transform = `rotate(${rotation}deg)`;

    if (isSpinning || Math.abs(currentSpeed) > 0.1) {
        currentSpeed *= decelerationRate;
        animationFrameId = requestAnimationFrame(rotate);
    } else {
        currentSpeed = 0;
        isSpinning = false;
        cancelAnimationFrame(animationFrameId);
        if (fullSpinSound) {
            fullSpinSound.pause(); // Stop the sound when spin ends
            fullSpinSound.currentTime = 0;
        }
    }
}

function startSpin(event) {
    event.preventDefault();
    if (!isSpinning) {
        isSpinning = true;
        currentSpeed = initialSpeed;
        spinStartTime = Date.now();
        requestAnimationFrame(rotate);

        // Play the full spin sound
        if (fullSpinSound) {
            playSound(fullSpinSound);
            soundStartTime = Date.now(); // Record when the sound started
        }

        if (bgMusic) {
            bgMusic.volume = currentVolume;
            bgMusic.play().catch(error => {
                console.error("Error playing background music:", error);
            });
        }

        const speedUpInterval = setInterval(() => {
            if (isSpinning && Date.now() - spinStartTime < spinDuration * 0.3 && currentSpeed < maxSpeed) { // Speed up for a portion of the duration
                currentSpeed += 0.5;
            } else if (!isSpinning || Date.now() - spinStartTime >= spinDuration) {
                clearInterval(speedUpInterval);
            }
        }, 50);
    }
}

function stopSpin() {
    if (isSpinning) {
        isSpinning = false;
        // The deceleration in the rotate function will handle the gradual stop

        // Stop the sound if it's still playing and the spin is manually stopped
        if (fullSpinSound && Date.now() - soundStartTime < spinDuration) {
            fullSpinSound.pause();
            fullSpinSound.currentTime = 0;
        }

        if (bgMusic && currentVolume > 0) {
            currentVolume = Math.max(0, currentVolume - volumeDecrement);
            bgMusic.volume = currentVolume;
        }
    }
}

spinner.addEventListener('mousedown', startSpin);
spinner.addEventListener('mouseup', stopSpin);
spinner.addEventListener('mouseleave', stopSpin);
spinner.addEventListener('touchstart', startSpin);
spinner.addEventListener('touchend', stopSpin);
spinner.addEventListener('touchcancel', stopSpin);

// Optional: Play background music on page load
// window.addEventListener('load', () => {
//     if (bgMusic) {
//         bgMusic.volume = currentVolume;
//         bgMusic.play().catch(error => {
//             console.error("Error playing background music:", error);
//         });
//     }
// });