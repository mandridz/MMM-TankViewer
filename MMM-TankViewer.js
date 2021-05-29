/* global Module */

/* Magic Mirror
 * Module: MMM-TankViewer
 *
 * By yen
 * MIT Licensed.
 */

Module.register("MMM-TankViewer", {
	defaults: {
		updateInterval: 10000,
		reconnectInterval: 5000,
		debug: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataNotification = null;

		self.sendSocketNotification("MMM-TankViewer-WS_CONNECT", { "config": self.config });

		// Schedule update timer.
		setInterval(function() {
			self.sendSocketNotification("MMM-TankViewer-WS_SEND_MESSAGE");
			self.updateDom();
		}, this.config.updateInterval);
	},

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");

		if (this.dataNotification) {
			// CanalizationTank
			var wrapperCanalizationTank = document.createElement("div");

			var labelCanalizationTank = document.createElement("label");
			labelCanalizationTank.className = "label";
			labelCanalizationTank.innerHTML = "Канализационный коллектор: ";

			var labelCanalizationTankValue = document.createElement("label");
			labelCanalizationTankValue.className = "value";
			labelCanalizationTankValue.innerHTML = this.dataNotification[2].sonarValue + " m";

			wrapperCanalizationTank.appendChild(labelCanalizationTank);
			wrapperCanalizationTank.appendChild(labelCanalizationTankValue);

			// DrainageTank
			var wrapperDrainageTank = document.createElement("div");

			var labelDrainageTank = document.createElement("label");
			labelDrainageTank.className = "label";
			labelDrainageTank.innerHTML = "Дренажный коллектор: ";

			var labelDrainageTankValue = document.createElement("label");
			labelDrainageTankValue.className = "value";
			labelDrainageTankValue.innerHTML = this.dataNotification[4].sonarValue + " m";

			wrapperDrainageTank.appendChild(labelDrainageTank);
			wrapperDrainageTank.appendChild(labelDrainageTankValue);

			wrapper.appendChild(wrapperCanalizationTank);
			wrapper.appendChild(wrapperDrainageTank);
		}

		return wrapper;
	},

	getScripts: function() {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-TankViewer.css",
		];
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		Log.info("***> socketNotificationReceived. Notification: " + notification + ", Payload: " + JSON.stringify(payload));


		if(notification === "MMM-TankViewer-WS_RESPONSE") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
