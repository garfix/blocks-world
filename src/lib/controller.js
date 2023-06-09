import createScene from './scene'

export default (function () {
    let monitor
    let webSocket
    let scene
    let printer
    let isClearFunction
    let isAutomaticFunction;

    function initialize(elementId, printerCallback, processlistClear, interactionAutomatic) {
        monitor = document.getElementById(elementId)
        printer = printerCallback
        isClearFunction = processlistClear
        isAutomaticFunction = interactionAutomatic

        scene = createScene()

        const domain = location.hostname
        const protocol = location.protocol
        const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'

        webSocket = new WebSocket(wsProtocol + "//" + domain + "/ws_chat")
        webSocket.onopen = () => {
            loadScene()
            processlistClear()
        }
        webSocket.onmessage = (event) => {
            handleIncomingMessage(JSON.parse(event.data))
        }

        document.addEventListener('click', event => {
            const element = event.target
            if (element.type === 'button' && element.dataset.option) {
                choice(element.dataset.option)
            }
        })
    }

    function handleIncomingMessage(message) {
        console.log("received", message)
        switch (message.MessageType) {
            case "description":
                scene.build(monitor, message.Message, monitor.clientWidth, monitor.clientHeight)
                break
            case "print":
                const time = printer(message.Message, false)
                setTimeout(() => {
                    send("language", "acknowledge", "")
                }, time)
                break
            case "move_to":
                doMoveTo(message.Message[0])
                break
            case "processlist_clear":
                isClearFunction()
                break
            case "choose":
                choose(message.Message[0], message.Message[1])
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

    function choose(clarification, options) {
        let out = clarification
        let index = 0
        for (const option of options) {
            out += "<br><br>" + "<button type='button' data-option='" + index + "'>" + option + "</button>"
            index++
        }
        const time = printer(out, true)

        if (isAutomaticFunction()) {
            setTimeout(() => {
                choice(1)
            }, time)
        }
    }

    function choice(index) {
        send("language", "choice", "" + index)
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
