# MMM-TankViewer

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Show info about deep in canalization and drainage collectors

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-TankViewer',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `host`           | *Required* Remote Host
| `port`           | *Required* Remote Port
| `path`           | *Required* Path to remote WebSocket Server
| `interval`       | *Required* Interval to send message to Server (ms) (Default 10000 ms)
| `message`        | *Required* Message to Server
| `debug`          | *Optional* Show Debug info in console (Default false)
