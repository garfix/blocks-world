import createScene from './scene'

export default (function () {
    let monitor
    let webSocket
    let scene

    function initialize(elementId) {
        monitor = document.getElementById(elementId)

        scene = createScene()

        webSocket = new WebSocket("ws://127.0.0.1:3333/")
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
                print(message.Message)
                send("language", "acknowledge", "")
                break
            case "move_to":
                doMoveTo(message.Resource, message.Message[0])
                break
        }
    }

    function loadScene() {
        send("no-resource", "describe", '')
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
        initialize
    }
})()
