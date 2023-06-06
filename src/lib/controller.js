import createScene from './scene'

const WAIT_TIME = 1000;

export default (function () {
    let monitor
    let webSocket
    let scene
    let printer
    let next
    let idGenerator = 0;
    let demo;

    function initialize(elementId, printerCallback, nextInteraction, demoRunning) {
        monitor = document.getElementById(elementId)
        printer = printerCallback
        next = nextInteraction
        demo = demoRunning

        scene = createScene()

        const domain = location.hostname
        const protocol = location.protocol
        const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'

        webSocket = new WebSocket(wsProtocol + "//" + domain + "/ws_chat")
        webSocket.onopen = () => {
            loadScene()
            nextInteraction()
        }
        webSocket.onmessage = (event) => {
            handleIncomingMessage(JSON.parse(event.data))
        }
    }

    function handleIncomingMessage(message) {
        console.log("received", message)
        switch (message.MessageType) {
            case "description":
                scene.build(monitor, message.Message, monitor.clientWidth, monitor.clientHeight)
                break
            case "print":
                printer(message.Message, false)
                send("language", "acknowledge", "")
                break
            case "move_to":
                doMoveTo(message.Message[0])
                break
            case "processlist_clear":
                next()
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
        let index = 1
        for (const option of options) {
            const id = idGenerator++
            out += "<br><br>" + "<button type='button' id='option" + id + "'>" + option + "</button>"
            const handler = createOptionHandler(index)
            window.setTimeout(() => {
                document.getElementById('option' + id).onclick = handler
            }, 0)
            index++
        }
        printer(out, true)

        if (demo) {
            setTimeout(() => {
                choice(1)
            }, WAIT_TIME)
        }
    }

    function createOptionHandler(index) {
        return () => {
            choice(index)
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
