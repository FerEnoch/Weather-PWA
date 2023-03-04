import React, { useState } from 'react';
import './InstallButton.css';
import logo from './logo.png';

let deferredPrompt = null;

const InstallButton = () => {
    const [visibility, setVisibility] = useState('hidden');

    window.addEventListener('beforeinstallprompt', (evt) => {
        evt.preventDefault();
        deferredPrompt = evt;
        setVisibility('visible');
    });

    const installApp = (evt) => {
        setVisibility('hidden');
        deferredPrompt.prompt();
        deferredPrompt.userChoice
            .then(choiceResult => {
                if (choiceResult.outcome === "accepted") {
                    console.log('PWA septup accepted');
                } else if (choiceResult.outcome === 'dismissed') {
                    console.log('PWA setup rejected');
                }
                deferredPrompt = null;
            });
        window.addEventListener("appinstalled", evt => {
            console.log("PWA installed!", evt);
        });
    }

    return (
        <button
            id='install_button'
            style={{ visibility: `${visibility}` }}
            onClick={installApp}
        >
            Install the app
            <img
                src={logo}
                alt='A white cloud with a sun behind' />
        </button>
    )
}

export default InstallButton;