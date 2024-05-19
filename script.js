// Função para configurar o alarme
function setAlarm() {
    const alarmTime = document.getElementById('alarmTime').value;
    const alarmMessage = document.getElementById('alarmMessage').value;

    if (alarmTime === '' || alarmMessage === '') {
        alert('Por favor, ingrese una hora y un mensaje.');
        return;
    }

    const alarmList = document.getElementById('alarmList');
    const listItem = document.createElement('li');
    listItem.innerText = `Alarma a las ${alarmTime} - Mensaje: ${alarmMessage}`;
    alarmList.appendChild(listItem);

    const alarmTimeParts = alarmTime.split(':');
    const alarmDate = new Date();
    alarmDate.setHours(alarmTimeParts[0]);
    alarmDate.setMinutes(alarmTimeParts[1]);
    alarmDate.setSeconds(0);

    const now = new Date();
    const timeToAlarm = alarmDate.getTime() - now.getTime();

    if (timeToAlarm >= 0) {
        setTimeout(() => {
            playAlarmMessage(alarmMessage);
        }, timeToAlarm);
    } else {
        alert('La hora de la alarma ya ha pasado. Por favor, ingrese una hora futura.');
    }
}

// Função para tocar a mensagem do alarme
function playAlarmMessage(message) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'es-ES'; // Define o idioma como espanhol
        window.speechSynthesis.speak(utterance);
        console.log('Mensagem de alarme: ' + message); // Verificação de log
        alert(message); // Exibe o alerta após a síntese de fala
    } else {
        alert('La síntesis de voz no es compatible con su navegador.');
    }
}

// Função para iniciar o reconhecimento de voz
function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('La API de reconocimiento de voz no es compatible con su navegador.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        console.log('Reconocimiento de voz iniciado. Por favor, hable...');
    };

    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        console.log('Resultado de voz: ' + result);
        processVoiceCommand(result);
    };

    recognition.onerror = function(event) {
        console.error('Error en el reconocimiento de voz: ', event.error);
        alert('Error en el reconocimiento de voz: ' + event.error);
    };

    recognition.onend = function() {
        console.log('Reconocimiento de voz terminado.');
    };

    recognition.start();
}

// Função para processar o comando de voz
function processVoiceCommand(command) {
    const timePattern = /(\d{1,2}):(\d{2})/;
    const messagePattern = /mensaje (.+)/i;
    const timeMatch = command.match(timePattern);
    const messageMatch = command.match(messagePattern);

    if (timeMatch && messageMatch) {
        const hour = timeMatch[1];
        const minutes = timeMatch[2];
        const message = messageMatch[1];

        document.getElementById('alarmTime').value = `${hour.padStart(2, '0')}:${minutes}`;
        document.getElementById('alarmMessage').value = message;
        setAlarm();
    } else {
        alert('Comando de voz no reconocido. Por favor, use el formato "alarma a las HH:MM mensaje SU MENSAJE".');
    }
}
