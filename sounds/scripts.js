document.addEventListener('DOMContentLoaded', function() {
    const soundControls = document.querySelectorAll('.soundControl');
    const stopAllButton = document.getElementById('stopAll');
    const fadeOutAllButton = document.getElementById('fadeOutAll');
    const audioElements = {};

    soundControls.forEach(control => {
        const playOnceButton = control.querySelector('.playOnce');
        const loopPlayButton = control.querySelector('.loopPlay');
        const stopButton = control.querySelector('.stop');
        const fadeOutButton = control.querySelector('.fadeOut');
        const volumeControl = control.querySelector('.volumeControl');
        const soundName = control.getAttribute('data-sound');
        
        const audio = new Audio(`sounds/${soundName}.mp3`);
        audio.loop = false;
        audioElements[soundName] = audio;

        let loopInterval;

        const updateButtonState = (isPlayingOnce, isPlayingLoop, isFading) => {
            playOnceButton.classList.toggle('playing', isPlayingOnce);
            loopPlayButton.classList.toggle('playing', isPlayingLoop);
            fadeOutButton.classList.toggle('fading', isFading);
        };

        playOnceButton.addEventListener('click', () => {
            clearInterval(loopInterval);
            audio.loop = false;
            audio.currentTime = 0;
            audio.play();
            updateButtonState(true, false, false);
            audio.onended = () => updateButtonState(false, false, false);
        });

        loopPlayButton.addEventListener('click', () => {
            clearInterval(loopInterval);
            audio.loop = true;
            audio.currentTime = 0;
            audio.play();
            updateButtonState(false, true, false);
        });

        stopButton.addEventListener('click', () => {
            clearInterval(loopInterval);
            audio.pause();
            audio.currentTime = 0;
            updateButtonState(false, false, false);
        });

        fadeOutButton.addEventListener('click', () => {
            clearInterval(loopInterval);
            const fadeOutDuration = 2000; // フェードアウトの時間（ミリ秒）
            const initialVolume = audio.volume;
            const fadeOutSteps = 20;
            const fadeOutStepTime = fadeOutDuration / fadeOutSteps;
            
            let currentStep = 0;
            updateButtonState(false, false, true);
            
            const fadeOutInterval = setInterval(() => {
                if (currentStep >= fadeOutSteps) {
                    clearInterval(fadeOutInterval);
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = initialVolume; // ボリュームを元に戻す
                    updateButtonState(false, false, false);
                } else {
                    audio.volume = initialVolume * (1 - currentStep / fadeOutSteps);
                    currentStep++;
                }
            }, fadeOutStepTime);
        });

        volumeControl.addEventListener('input', () => {
            audio.volume = volumeControl.value;
        });

        volumeControl.addEventListener('dblclick', () => {
            audio.volume = 0.5;
            volumeControl.value = 0.5;
        });
    });

    stopAllButton.addEventListener('click', () => {
        for (let soundName in audioElements) {
            const audio = audioElements[soundName];
            audio.pause();
            audio.currentTime = 0;
        }
        soundControls.forEach(control => {
            const playOnceButton = control.querySelector('.playOnce');
            const loopPlayButton = control.querySelector('.loopPlay');
            const fadeOutButton = control.querySelector('.fadeOut');
            playOnceButton.classList.remove('playing');
            loopPlayButton.classList.remove('playing');
            fadeOutButton.classList.remove('fading');
        });
    });

    fadeOutAllButton.addEventListener('click', () => {
        const fadeOutDuration = 2000; // フェードアウトの時間（ミリ秒）
        const fadeOutSteps = 20;
        const fadeOutStepTime = fadeOutDuration / fadeOutSteps;
        
        soundControls.forEach(control => {
            const fadeOutButton = control.querySelector('.fadeOut');
            fadeOutButton.classList.add('fading');
        });

        for (let soundName in audioElements) {
            const audio = audioElements[soundName];
            const initialVolume = audio.volume;
            
            let currentStep = 0;

            const fadeOutInterval = setInterval(() => {
                if (currentStep >= fadeOutSteps) {
                    clearInterval(fadeOutInterval);
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = initialVolume; // ボリュームを元に戻す
                } else {
                    audio.volume = initialVolume * (1 - currentStep / fadeOutSteps);
                    currentStep++;
                }
            }, fadeOutStepTime);
        }

        setTimeout(() => {
            soundControls.forEach(control => {
                const playOnceButton = control.querySelector('.playOnce');
                const loopPlayButton = control.querySelector('.loopPlay');
                const fadeOutButton = control.querySelector('.fadeOut');
                playOnceButton.classList.remove('playing');
                loopPlayButton.classList.remove('playing');
                fadeOutButton.classList.remove('fading');
            });
        }, fadeOutDuration);
    });
});
