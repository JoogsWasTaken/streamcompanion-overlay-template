/**
 * Array of requested tokens.
 */
const tokens = ["osuIsRunning"];

/**
 * Handles the "osuIsRunning" token.
 * 
 * @param {string} key 
 * @param {number} value 
 */
const onOsuIsRunning = (key, value) => {
    console.log("osu is " + (value == 0 ? "not " : "") + "running");
}

/**
 * Runs setup with the provided config. 
 * 
 * @param {object} config Config object sourced from "config.json" file
 */
const setup = (config) => {
    console.log("config", config);
}

/**
 * Performs updates based on new token data.
 * 
 * @param {object} tokenData Object with new token data
 */
const update = (tokenData) => {
    execIfPresent(tokenData, "osuIsRunning", onOsuIsRunning);
}

/**
 * Renders a frame onto the canvas using the provided 2D rendering context.
 * 
 * @param {CanvasRenderingContext2D} ctx Rendering context 
 * @param {number} w Canvas width 
 * @param {number} h Canvas height 
 */
const render = (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "black";
    ctx.fillText("Hello world!", 10, 10);
}

// /!\ DO NOT CHANGE ANYTHING PAST THIS POINT
(async () => {
    // fetch config.json and pass it on to setup function
    setup(await (await fetch("config.json")).json());

    // create web socket
    const socket = new ReconnectingWebSocket(`${window.overlay.config.getWs()}/tokens`, null, {
        automaticOpen: false,
        reconnectInterval: 3000
    });
    
    // send query to listen to tokens once the socket is open
    socket.onopen = () => {
        console.log("socket is open, listening to changes to the following tokens", tokens);
        socket.send(JSON.stringify(tokens));
    }
    
    // handler for incoming messages
    socket.onmessage = (eventData) => {
        try {
            update(JSON.parse(eventData.data));
        } catch (err) {
            console.error("failed to process socket message", err)
        }
    }

    // create canvas and rendering context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // null type guard
    if (ctx == null) {
        console.error("cannot create rendering context")
        return;
    }

    // add canvas to body
    document.body.insertBefore(canvas, document.body.firstChild);

    // handler for when the window is resized to make the canvas fit
    const updateCanvasSize = () => {
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
    }

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    // open socket
    socket.open();

    // start rendering loop
    const doLoop = () => {
        render(ctx, canvas.width, canvas.height);
        requestAnimationFrame(doLoop);
    }

    requestAnimationFrame(doLoop);
})().catch((err) => {
    console.error("error during initialization", err)
});



