/* Magic Mirror
 * Node Helper: MMM-TankViewer2
 *
 * By yen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "MMM-TankViewer-NOTIFICATION_TEST") {
			console.log("---> Working notification system. Notification:", notification, "payload: ", payload);
			// Send notification
			this.sendSocketNotification("MMM-TankViewer-NOTIFICATION_TEST", "Hello from node_helper");
		}
	},

});
