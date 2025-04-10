(function() {
    'use strict';

    // Les variables cleMessage et secretKey doivent être définies localement
    if (typeof cleMessage === 'undefined' || typeof secretKey === 'undefined') {
        console.error("Les variables 'cleMessage' et 'secretKey' doivent être définies localement.");
        return;
    }

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
            //console.log("Texte chiffré :", encryptedText);
            // Sélectionner le champ et insérer le texte chiffré
            messageField.focus();
            document.execCommand('selectAll', false, null); // Sélectionner tout le texte existant
            document.execCommand('insertText', false, cleMessage+encryptedText); // Insérer le texte chiffré

            // Déchiffrement
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            //console.log("Texte déchiffré : ", decryptedText);

        } else {
            console.error("Champ de message non trouvé !");
        }

    });

    function decryptMessages() {
      // Parcourir tous les messages de la page
      const messages = document.querySelectorAll('[data-tid="chat-pane-message"] p');
      messages.forEach(message => {
          const textContent = message.textContent;
          if (textContent.startsWith(cleMessage)) {
              const encryptedText = textContent.replace(cleMessage, '');

              const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
              const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
              if (decryptedText) {
                  message.textContent = decryptedText; // Remplacer le texte chiffré par le texte déchiffré
                  //console.log("Message déchiffré :", decryptedText);
              }
          }
      });
    }

    // Exécuter la fonction toutes les 3 secondes
    setInterval(decryptMessages, 3000);

    // Ajouter le bouton au corps de la page
    document.body.appendChild(bouton);
})();
