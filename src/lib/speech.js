export default (function () {

    let recognition

    function isSupported() {
        return window.SpeechRecognition || window.webkitSpeechRecognition
    }

    function init(textResultCallback) {

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 10;

        recognition.onresult = (event) => {
            console.log(event.results)
            const text = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence
            textResultCallback(text, confidence)
        };

        recognition.onnomatch = () => {
            textResultCallback('', 0)
        }

        recognition.onerror = () => {
            textResultCallback('', 0)
        }

        recognition.onspeechend = () => {
            textResultCallback('', 0)
        }

    }

    function start() {
        recognition.start();
    }

    return {
        isSupported,
        init,
        start
    }
}())



