import createScene from './scene'

export default (function () {
    let monitor
    let webSocket
    let scene
    let printer

    function initialize(elementId, printerCallback) {
        monitor = document.getElementById(elementId)
        printer = printerCallback

        scene = createScene()

        const domain = location.hostname
        const protocol = location.protocol
        const wsProtocol = protocol === 'https' ? 'wss' : 'ws'

        webSocket = new WebSocket(wsProtocol + "://" + domain + "/ws_chat")
        webSocket.onopen = () => {
            loadScene()
        }
        webSocket.onmessage = (event) => {
            handleIncomingMessage(JSON.parse(event.data))
        }
    }

    function handleIncomingMessage(message) {
        console.log(message)
        switch (message.MessageType) {
            case "description":
                scene.build(monitor, message.Message, monitor.clientWidth, monitor.clientHeight)
                break
            case "print":
                printer(message.Message)
                send("language", "acknowledge", "")
                break
            case "move_to":
                doMoveTo(message.Message[0])
                break
        }
    }

    function handleInput(input) {
        send("language", "respond", input)
    }

    function loadScene() {
        send("no-resource", "describe", '')
    }

    function doMoveTo(moves) {
        let maxDuration = 0;
        let animations = [];

        for (const move of moves) {
            let result = scene.createObjectAnimation({
                E: move[0],
                X: move[1],
                Y: move[3],
                Z: move[2]
            })
            animations.push(result.animation)
            maxDuration = Math.max(maxDuration, result.duration)
        }

        if (animations.length > 0) {
            scene.runAnimations(animations, maxDuration)
        }
        window.setTimeout(function () {
            send("robot", "acknowledge", "")
        }, maxDuration);
    }

    function send(resource, messageType, message) {
        console.log("send", messageType, message)
        webSocket.send(JSON.stringify({
            System: "blocks",
            Resource: resource,
            MessageType: messageType,
            Message: message
        }))
    }

    return {
        initialize,
        handleInput
    }
})()
