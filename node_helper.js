/* Magic Mirror
 * Node Helper: MMM-TankViewer
 *
 * By yen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
const WebSocket = require("ws");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		var self = this;

		console.log("---> Working notification system. Notification:", notification, "payload: ", payload);

		if (notification === "MMM-TankViewer-NOTIFICATION_TEST") {
			// Send notification
			this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
		} else if (notification === "WS_CONNECT") {
			// Connect event will be handeled internally
			self.config = payload.config;
			self.connect(payload.config);

			return;
		} else if (notification === "WS_DISCONNECT") {
			// Disconnect event will be handeled internally
			self.config = undefined;
			self.disconnect();

			return;
		}

		// Forward all other socket notifications
		if(self.ws && self.ws.readyState === WebSocket.OPEN) {
			self.ws.send(self.config.message, function ack(error){
				if(error) {
					self.error("Error while sending obj: ", obj);
				}
			});
		} else {
			self.debug("Can not send notification because WebSocket is not yet connected!", notification)
		}

	},

	connect: function(config, callback) {
		var self = this;

		// Disconnect to assure only one instance is running.
		self.disconnect();

		const url = "ws://" + config.host + ":" + config.port + config.path;
		self.ws = new WebSocket(url);

		// Register error listener
		self.ws.onerror = function(event){
			if(callback) {
				callback(event.code)
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
				} catch(error) {
					self.error("Error while handling event:", event, error);
				}
			};

			// Notify callback if needed
			if(callback) {
				callback();
			}
		};
	},

	sendMessage: function(event) {
		var self = this;
		self.debug("Send event: ", event.payload);
		self.sendSocketNotification("MMM-TankViewer-REQUEST_VALUE", event.payload);
	},

	reconnect: function(config) {
		var self = this;
		self.debug("Trying to reconnect...");
		self.connect(config, function(error) {
			if(error) {
				self.error("Error while reconnecting to websocket...", error);
				setTimeout(function() { self.reconnect(config) }, config.interval);
			}
		});
	},

	disconnect: function() {
		var self = this;
		if (self.ws) {
			// Unregister listener
			self.ws.onclose = undefined;
			self.ws.onerror = undefined;
			self.ws.onopen = undefined;
			self.ws.onmessage = undefined;

			if(self.ws.readyState === WebSocket.OPEN) {
				self.ws.close();
				self.ws.terminate();
			}
			self.ws = undefined;
		}
	},

	debug: function() {
		var self = this;
		if(config.debug) {
			console.log.apply(self, arguments);
		}
	},

	error: function() {
		var self = this;
		console.error.apply(self, arguments);
	},











	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("MMM-TankViewer-NOTIFICATION_TEST", payload);
	},

	// this you can create extra routes for your module
	extraRoutes: function() {
		var self = this;
		this.expressApp.get("/MMM-TankViewer/extra_route", function(req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	// Test another function
	anotherFunction: function() {
		return {date: new Date()};
	}
});
