(function() {
    'use strict';

    // Fonction pour initialiser les variables locales
    window.initCocAES = function(cleMessage, secretKey) {
        // Créer un bouton
        const bouton = document.createElement('button');
        bouton.textContent = 'CA';
        bouton.style.position = 'absolute';
        bouton.style.bottom = '10px';
        bouton.style.right = '40px';
        bouton.style.zIndex = '1000';

        // Ajouter un événement au clic
        bouton.addEventListener('click', () => {
            const messageField = document.querySelector('[data-tid="ckeditor"] p'); // Sélectionner le champ de message

            if (messageField) {
                const textToEncrypt = messageField.textContent;
                const encryptedText = CryptoJS.AES.encrypt(textToEncrypt, secretKey).toString();
                messageField.focus();
                document.execCommand('selectAll', false, null); // Sélectionner tout le texte existant
                document.execCommand('insertText', false, cleMessage + encryptedText); // Insérer le texte chiffré
            } else {
                console.error("Champ de message non trouvé !");
            }
        });

        function decryptMessages() {
            const messages = document.querySelectorAll('[data-tid="chat-pane-message"] p');
            messages.forEach(message => {
                const textContent = message.textContent;
                if (textContent.startsWith(cleMessage)) {
                    const encryptedText = textContent.replace(cleMessage, '');
                    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
                    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
                    if (decryptedText) {
                        message.textContent = decryptedText;
                    }
                }
            });
        }

        setInterval(decryptMessages, 3000);
        document.body.appendChild(bouton);
    };
})();
