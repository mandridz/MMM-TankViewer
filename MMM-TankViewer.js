/* global Module */

/* Magic Mirror
 * Module: MMM-TankViewer
 *
 * By yen
 * MIT Licensed.
 */

Module.register("MMM-TankViewer", {
	require( 'console-stamp' )( console );
	
	defaults: {
		//updateInterval: 60000,
		//retryDelay: 5000,

		host: '10.0.3.3',
		port: 8080,
		path: '',
		interval: 10000,
		message: '',
		debug: false
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		console.log("*** Sending Socket Notification to node_helper");

		self.sendSocketNotification("WS_CONNECT", { "config": self.config });

		//this.updateDom();

		setInterval(function() {
			console.log("*** Send sendSocketNotification from setInterval function");

			self.sendSocketNotification("MESSAGE", { "config": self.config });
		}, this.config.interval);

		// Schedule update timer.
		//this.getData();
		//setInterval(function() {
			//self.updateDom();
		//}, this.config.interval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	 /*
	getData: function() {
		var self = this;

		var urlApi = "https://jsonplaceholder.typicode.com/posts/1";
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},
	*/


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	 /*
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.interval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},
	*/

	getDom: function() {
		var self = this;

		var wrapper = document.createElement("div");

		if (this.dataRequest) {
			// CanalizationTank
			var wrapperCanalizationTank = document.createElement("div");

			var labelCanalizationTank = document.createElement("label");
			labelCanalizationTank.className = "label";
			labelCanalizationTank.innerHTML = "Канализационный коллектор: ";

			var labelCanalizationTankValue = document.createElement("label");
			labelCanalizationTankValue.className = "value";
			labelCanalizationTankValue.innerHTML = "2.06 m";

			wrapperCanalizationTank.appendChild(labelCanalizationTank);
			wrapperCanalizationTank.appendChild(labelCanalizationTankValue);

			// DrainageTank
			var wrapperDrainageTank = document.createElement("div");

			var labelDrainageTank = document.createElement("label");
			labelDrainageTank.className = "label";
			labelDrainageTank.innerHTML = "Дренажный коллектор: ";

			var labelDrainageTankValue = document.createElement("label");
			labelDrainageTankValue.className = "value";
			//labelDrainageTankValue.innerHTML = this.dataRequest.title + " m";
			labelDrainageTankValue.innerHTML = this.dataRequest ? JSON.stringify(this.dataRequest) : "0";

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

	processData: function(data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		//this.sendSocketNotification("MMM-TankViewer-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function(notification, payload) {

		console.log("****** socketNotificationReceived in Main Module ****** ---> " + payload);

		if (notification === "MMM-TankViewer-REQUEST_VALUE") {

			console.log("---> Receved notification MMM-TankViewer-REQUEST_VALUE: " + payload);

			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
