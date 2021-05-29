/* Magic Mirror
 * Node Helper: MMM-TankViewer2
 *
 * By yen
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function(notification, payload) {
		if (notification === "MMM-TankViewer-NOTIFICATION_TEST") {
			console.log("---> Working notification system. Notification:", notification, "payload: ", payload);
			// Send notification
			this.sendNotificationTest("---> Hello from node_helper");
		}
	},

	// Example function send notification test
	sendNotificationTest: function(payload) {
		this.sendSocketNotification("---> MMM-TankViewer-NOTIFICATION_TEST", payload);
	},

});
