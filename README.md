# StreamCompanion Overlay Template

This repository contains starter files for creating a new canvas-based stream overlay using [Piotrekol's StreamCompanion](https://github.com/Piotrekol/StreamCompanion).
Simply copy the directory and its contents into your overlay directory, rename it and edit as you please.
By default, you should see a blank canvas in your browser rendering "Hello world".

## Making an overlay

The [main.js](./js/main.js) is, in theory, the only file you should ever touch while working on an overlay.
It contains all the logic that you can hook into and make use of.
By default, the script takes over some annoying parts that you don't have to reimplement.

- It creates a canvas that spans the entire browser window and makes sure it always resizes.
- It creates the rendering context and starts the render loop.
- It connects to StreamCompanion's WebSocket endpoint and automatically requests updates for the tokens you require.
- It parses token updates and passes them on to your overlay.  
- It takes information from [config.json](./config.json) and passes it on to your overlay.

There is one variable and three main functions that you can make use of.

### `tokens`

`tokens` is an array of strings and the very first thing you should see upon opening the overlay script.
Here, you can add tokens you'd like to receive updates for.
Despite it being `const`, you can still add and remove tokens from it dynamically.
Just be aware that you add the tokens you want to listen for before the WebSocket is created.
This is best done by using ...

### `setup(config: object)`

This function is called after the overlay script has loaded and parsed the [config.json](./config.json) file.
Its contents are passed onto the `setup` function as a plain object. 
You can edit the [config.json](./config.json) however you like and create options for your users to manipulate themselves.
This is also the perfect time to append or remove tokens from the `tokens` array, because the WebSocket is created shortly after.

### `update(tokenData: object)`

This function is called whenever token updates are sent by StreamCompanion.
The changed values are passed onto the `update` function as a plain object.
You can use this object to modify the state of your overlay.

### `render(ctx: CanvasRenderingContext2D, w: number, h: number)`

This function is called whenever a new frame is rendered onto the canvas.
`ctx` is the rendering context of the canvas.
`w` and `h` are the current width and height of the canvas respectively.
This is where you should draw things onto the canvas and make your overlay magic happen.

## Managing overlay state

Generally, you should keep the entire state of your overlay in top-level variables in your main script.
Initialize them with sensible defaults and let the `update` function keep all variables up-to-date.
Say you want to track the current player combo, then you create a variable called `combo` and update it whenever the respective token receives an update.

Your render logic should never alter your overlay state.
This will only complicate things further and make things a mess.
If you really need to change your state in your render function, first consider if there's another way to accomplish it before getting your hands dirty.
The structure of the overlay fits this event-driven workflow really well and shouldn't be messed with unless absolutely necessary.

## Other utilities

The [util.js](./js/util.js) file currently contains a single utility function.
It will be expanded whenever some useful functionality that is tedious to implement over and over should become part of this template.

### `execIfPresent(data: object, key: object, fn: (key: object, value: object) => void)`

This is a utility function that is best used inside the `update` function.
It checks whether the provided key is present on the data object and, if so, passes the key and value on to the callback function.
An example with the `osuIsRunning` token can be seen in the template.

```js
// This is executed whenever the "osuIsRunning" token is updated.
const onOsuIsRunning = (key, value) => {
    console.log("osu is " + (value == 0 ? "not " : "") + "running");
}

// This is executed whenever any token is updated.
const update = (tokenData) => {
    // This checks if "osuIsRunning" is among the updated tokens and, if so, executed onOsuIsRunning.
    execIfPresent(tokenData, "osuIsRunning", onOsuIsRunning);
}
```

## License

MIT.