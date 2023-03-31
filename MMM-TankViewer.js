/* global Module */

/* Magic Mirror
 * Module: MMM-TankViewer
 *
 * By yen
 * MIT Licensed.
 */

Module.register("MMM-TankViewer", {
  defaults: {
    debug: false,
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

  start: function () {
    var self = this;
    var dataNotification = undefined;

    var headerText = this.data.header;
    this.data.header = headerText + " [Something]";

    self.sendSocketNotification("MMM-TankViewer-WS_CONNECT", {
      config: self.config,
    });
  },

  getDom: function () {
    this.data.header = this.headerText + " [Some text]";

    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    if (!this.loaded) {
      wrapper.classList.add("top");
      wrapper.innerHTML = this.translate("Обновление ...");

      return wrapper;
    }

    const date = new Date();

    if (this.dataNotification) {
      var data = this.dataNotification;

      var top = document.createElement("div");
      top.classList.add("top");
      top.innerHTML = `Обновлено: ${date.toLocaleTimeString(
        "ru-RU"
      )} / ${date.toLocaleDateString("ru-RU")}`;

      wrapper.appendChild(top);

      // CanalizationTank
      var wrapperCanalizationTank = document.createElement("div");

      var labelCanalizationTank = document.createElement("label");
      labelCanalizationTank.className = "label";
      labelCanalizationTank.innerHTML = "Канализационный коллектор: ";

      var labelCanalizationTankValue = document.createElement("label");
      labelCanalizationTankValue.className = "value";
      labelCanalizationTankValue.innerHTML = data[2].sonar + " m";

      wrapperCanalizationTank.appendChild(labelCanalizationTank);
      wrapperCanalizationTank.appendChild(labelCanalizationTankValue);

      // DrainageTank
      var wrapperDrainageTank = document.createElement("div");

      var labelDrainageTank = document.createElement("label");
      labelDrainageTank.className = "label";
      labelDrainageTank.innerHTML = "Дренажный коллектор: ";

      var labelDrainageTankValue = document.createElement("label");
      labelDrainageTankValue.className = "value";
      labelDrainageTankValue.innerHTML = data[4].sonar + " m";

      // Pump Status
      var tabStatus = document.createElement("table");
      tabStatus.className = "tab";

      var trHeader = document.createElement("tr");
      var tdName = document.createElement("td");
      tdName.className = "header-left";
      tdName.innerHTML = "Насос:";
      var tdName1 = document.createElement("td");
      tdName1.className = "header";
      tdName1.innerHTML = "1";
      var tdName2 = document.createElement("td");
      tdName2.className = "header";
      tdName2.innerHTML = "2";
      var tdName3 = document.createElement("td");
      tdName3.className = "header";
      tdName3.innerHTML = "3";
      var tdName4 = document.createElement("td");
      tdName4.className = "header";
      tdName4.innerHTML = "4";
      var tdName5 = document.createElement("td");
      tdName5.className = "header";
      tdName5.innerHTML = "5";

      var trStatus = document.createElement("tr");
      var tdStatus = document.createElement("td");
      tdStatus.className = "status-left";
      tdStatus.innerHTML = "Статус:";
      var tdStatus1 = document.createElement("td");
      tdStatus1.className = "status";
      var imgPower1 = document.createElement("img");
      imgPower1.src = data[0].status
        ? "modules/MMM-TankViewer/img/power-on.png"
        : "modules/MMM-TankViewer/img/power-off.png";
      tdStatus1.appendChild(imgPower1);
      var tdStatus2 = document.createElement("td");
      tdStatus2.className = "status";
      var imgPower2 = document.createElement("img");
      imgPower2.src = data[1].status
        ? "modules/MMM-TankViewer/img/power-on.png"
        : "modules/MMM-TankViewer/img/power-off.png";
      tdStatus2.appendChild(imgPower2);
      var tdStatus3 = document.createElement("td");
      tdStatus3.className = "status";
      var imgPower3 = document.createElement("img");
      imgPower3.src = data[2].status
        ? "modules/MMM-TankViewer/img/power-on.png"
        : "modules/MMM-TankViewer/img/power-off.png";
      tdStatus3.appendChild(imgPower3);
      var tdStatus4 = document.createElement("td");
      tdStatus4.className = "status";
      var imgPower4 = document.createElement("img");
      imgPower4.src = data[3].status
        ? "modules/MMM-TankViewer/img/power-on.png"
        : "modules/MMM-TankViewer/img/power-off.png";
      tdStatus4.appendChild(imgPower4);
      var tdStatus5 = document.createElement("td");
      tdStatus5.className = "status";
      var imgPower5 = document.createElement("img");
      imgPower5.src = data[4].status
        ? "modules/MMM-TankViewer/img/power-on.png"
        : "modules/MMM-TankViewer/img/power-off.png";
      tdStatus5.appendChild(imgPower5);

      var trCurrent = document.createElement("tr");
      var tdCurrent = document.createElement("td");
      tdCurrent.className = "curr-left";
      tdCurrent.innerHTML = "Ток:";
      var tdCurrent1 = document.createElement("td");
      tdCurrent1.className = "curr";
      tdCurrent1.innerHTML = `${data[0].current}, A`;
      var tdCurrent2 = document.createElement("td");
      tdCurrent2.className = "curr";
      tdCurrent2.innerHTML = `${data[1].current}, A`;
      var tdCurrent3 = document.createElement("td");
      tdCurrent3.className = "curr";
      tdCurrent3.innerHTML = `${data[2].current}, A`;
      var tdCurrent4 = document.createElement("td");
      tdCurrent4.className = "curr";
      tdCurrent4.innerHTML = `${data[3].current}, A`;
      var tdCurrent5 = document.createElement("td");
      tdCurrent5.className = "curr";
      tdCurrent5.innerHTML = `${data[4].current}, A`;

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
    if (notification === "MMM-TankViewer-WS_RESPONSE") {
      // set dataNotification
      this.dataNotification = payload;
      this.loaded = true;
      this.updateDom();
    }
  },
});
