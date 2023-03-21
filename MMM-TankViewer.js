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
    debug: false,
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  start: function () {
    var self = this;
    var dataNotification = null;

    self.sendSocketNotification("MMM-TankViewer-WS_CONNECT", {
      config: self.config,
    });

    // Schedule update timer.
    setInterval(function () {
      self.sendSocketNotification("MMM-TankViewer-WS_SEND_MESSAGE");
      self.updateDom();
    }, this.config.updateInterval);
  },

  getDom: function () {
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
      labelCanalizationTankValue.innerHTML =
        this.dataNotification[2].sonarValue + " m";

      wrapperCanalizationTank.appendChild(labelCanalizationTank);
      wrapperCanalizationTank.appendChild(labelCanalizationTankValue);

      // DrainageTank
      var wrapperDrainageTank = document.createElement("div");

      var labelDrainageTank = document.createElement("label");
      labelDrainageTank.className = "label";
      labelDrainageTank.innerHTML = "Дренажный коллектор: ";

      var labelDrainageTankValue = document.createElement("label");
      labelDrainageTankValue.className = "value";
      labelDrainageTankValue.innerHTML =
        this.dataNotification[4].sonarValue + " m";

      // Pump Status
      var tabStatus = document.createElement("table");
      tabStatus.className = "tab";

      var trHeader = document.createElement("tr");
      var tdName = document.createElement("td");
      tdName.innerHTML = "Насос";
      var tdName1 = document.createElement("td");
      tdName1.innerHTML = "1";
      var tdName2 = document.createElement("td");
      tdName2.innerHTML = "2";
      var tdName3 = document.createElement("td");
      tdName3.innerHTML = "3";
      var tdName4 = document.createElement("td");
      tdName4.innerHTML = "4";
      var tdName5 = document.createElement("td");
      tdName5.innerHTML = "5";

      var trStatus = document.createElement("tr");
      var tdStatus = document.createElement("td");
      tdStatus.innerHTML = "Статус";
      var tdStatus1 = document.createElement("td");
      tdStatus1.innerHTML = this.dataNotification[0].tankStatus;
      var tdStatus2 = document.createElement("td");
      tdStatus2.innerHTML = this.dataNotification[1].tankStatus;
      var tdStatus3 = document.createElement("td");
      tdStatus3.innerHTML = this.dataNotification[2].tankStatus;
      var tdStatus4 = document.createElement("td");
      tdStatus4.innerHTML = this.dataNotification[3].tankStatus;
      var tdStatus5 = document.createElement("td");
      tdStatus5.innerHTML = this.dataNotification[4].tankStatus;

      var trCurrent = document.createElement("tr");
      var tdCurrent = document.createElement("td");
      tdCurrent.innerHTML = "Ток, А";
      var tdCurrent1 = document.createElement("td");
      tdCurrent1.innerHTML = this.dataNotification[0].currentValue;
      var tdCurrent2 = document.createElement("td");
      tdCurrent2.innerHTML = this.dataNotification[1].currentValue;
      var tdCurrent3 = document.createElement("td");
      tdCurrent3.innerHTML = this.dataNotification[2].currentValue;
      var tdCurrent4 = document.createElement("td");
      tdCurrent4.innerHTML = this.dataNotification[3].currentValue;
      var tdCurrent5 = document.createElement("td");
      tdCurrent5.innerHTML = this.dataNotification[4].currentValue;

      trHeader.appendChild(tdName);
      trHeader.appendChild(tdName1);
      trHeader.appendChild(tdName2);
      trHeader.appendChild(tdName3);
      trHeader.appendChild(tdName4);
      trHeader.appendChild(tdName5);

      trStatus.appendChild(tdStatus);
      trStatus.appendChild(tdStatus1);
      trStatus.appendChild(tdStatus2);
      trStatus.appendChild(tdStatus3);
      trStatus.appendChild(tdStatus4);
      trStatus.appendChild(tdStatus5);

      trCurrent.appendChild(tdCurrent);
      trCurrent.appendChild(tdCurrent1);
      trCurrent.appendChild(tdCurrent2);
      trCurrent.appendChild(tdCurrent3);
      trCurrent.appendChild(tdCurrent4);
      trCurrent.appendChild(tdCurrent5);

      tabStatus.appendChild(trHeader);
      tabStatus.appendChild(trStatus);
      tabStatus.appendChild(trCurrent);

      wrapperDrainageTank.appendChild(labelDrainageTank);
      wrapperDrainageTank.appendChild(labelDrainageTankValue);

      wrapper.appendChild(wrapperCanalizationTank);
      wrapper.appendChild(wrapperDrainageTank);

      wrapper.appendChild(tabStatus);
    }

    return wrapper;
  },

  getScripts: function () {
    return [];
  },

  getStyles: function () {
    return ["MMM-TankViewer.css"];
  },

  // socketNotificationReceived from helper
  socketNotificationReceived: function (notification, payload) {
    Log.info(
      "***> socketNotificationReceived. Notification: " +
        notification +
        ", Payload: " +
        JSON.stringify(payload)
    );

    if (notification === "MMM-TankViewer-WS_RESPONSE") {
      // set dataNotification
      this.dataNotification = payload;
      this.updateDom();
    }
  },
});
