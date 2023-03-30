/* Magic Mirror
 * Node Helper: MMM-TankViewer2
 *
 * By yen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
//const WebSocket = require("ws");
const ReconnectingWebSocket = require("reconnecting-websocket");

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
    self.rws = new ReconnectingWebSocket(url, [], {
      debug: true,
    });

    // Register error listener
    self.rws.onerror = function (event) {
      if (callback) {
        callback(event.code);
      }
    };

    // Register open listener
    self.rws.onopen = function open() {
      self.debug("Connection established:", url);

      // Register on close listener
      self.rws.onclose = function close(event) {
        self.error("Connection was closed!", event.code, event.reason);
        self.reconnect(config);
      };

      // Register message handler
      self.rws.onmessage = function message(event) {
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
    if (self.rws) {
      // Unregister listener
      self.rws.onclose = undefined;
      self.rws.onerror = undefined;
      self.rws.onopen = undefined;
      self.rws.onmessage = undefined;

      if (self.rws.readyState === WebSocket.OPEN) {
        self.rws.close();
        self.rws.terminate();
      }
      self.rws = undefined;
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
