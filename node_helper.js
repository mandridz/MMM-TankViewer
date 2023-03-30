/* Magic Mirror
 * Node Helper: MMM-TankViewer2
 *
 * By yen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const WebSocket = require("ws");

module.exports = NodeHelper.create({
  // Override socketNotificationReceived method.
  socketNotificationReceived: function (notification, payload) {
    var self = this;

    if (notification === "MMM-TankViewer-WS_CONNECT") {
      // Connect event will be handeled internally
      self.config = payload.config;
      self.connect(payload.config);
    }
  },

  connect: function (config, callback) {
    var self = this;

    // Disconnect to assure only one instance is running.
    self.disconnect();

    const url = "ws://" + config.host + ":" + config.port + config.path;
    self.ws = new WebSocket(url);

    // Register error listener
    self.ws.onerror = function (event) {
      if (callback) {
        callback(event.code);
      }
    };

    // Register open listener
    self.ws.onopen = function open() {
      self.debug("Connection established:", url);

      // Register on close listener
      self.ws.onclose = function close(event) {
        self.error("Connection was closed!", event.code, event.reason);
        self.reconnect(config);
      };

      // Register message handler
      self.ws.onmessage = function message(event) {
        try {
          self.sendMessage(JSON.parse(event.data));
        } catch (error) {
          self.error("Error while handling event:", event, error);
        }
      };

      // Notify callback if needed
      if (callback) {
        callback();
      }
    };
  },

  sendMessage: function (event) {
    var self = this;
    self.debug(`[${this.name}]: Send event: `, event);

    self.sendSocketNotification(
      "MMM-TankViewer-WS_RESPONSE",
      //JSON.stringify(event)
      event
    );
  },

  reconnect: function (config) {
    var self = this;
    self.debug("Trying to reconnect...");
    self.connect(config, function (error) {
      if (error) {
        self.error("Error while reconnecting to websocket...", error);
        setTimeout(function () {
          self.reconnect(config);
        }, config.reconnectInterval);
      }
    });
  },

  disconnect: function () {
    var self = this;
    if (self.ws) {
      // Unregister listener
      self.ws.onclose = undefined;
      self.ws.onerror = undefined;
      self.ws.onopen = undefined;
      self.ws.onmessage = undefined;

      if (self.ws.readyState === WebSocket.OPEN) {
        self.ws.close();
        self.ws.terminate();
      }
      self.ws = undefined;
    }
  },

  debug: function () {
    var self = this;
    if (self.config.debug) {
      console.log.apply(self, arguments);
    }
  },

  error: function () {
    var self = this;
    console.error.apply(self, arguments);
  },
});
