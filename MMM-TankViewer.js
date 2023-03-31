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

  requiresVersion: "2.1.0",

  start: function () {
    var self = this;
    var dataNotification = undefined;

    this.data.header = this.config.headerText + " [Обновление ...]";

    self.sendSocketNotification("MMM-TankViewer-WS_CONNECT", {
      config: self.config,
    });
  },

  getDom: function () {
    let wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const getHeader = () => {
      const date = new Date();

      this.data.header =
        this.config.headerText +
        ` [Обновлено: ${date.toLocaleTimeString(
          "ru-RU"
        )} / ${date.toLocaleDateString("ru-RU")}]`;
    };

    const getClassNameByValue = (value, criticalValue, middleValue) => {
      let classNme = "";

      if (value <= classNme) {
        classNme = "critical";
      } else if (value > criticalValue && value <= middleValue) {
        classNme = "middle";
      } else {
        classNme = "optimum";
      }

      return classNme;
    };

    const getTankInfo = (label, value, criticalValue, middleValue) => {
      let tr = document.createElement("tr");

      // td label
      let tdLabel = document.createElement("td");
      tdLabel.className = "label";
      tdLabel.innerHTML = label;
      tr.appendChild(tdLabel);

      //td value
      let tdValue = document.createElement("td");
      tdValue.className = `value ${getClassNameByValue(
        value,
        criticalValue,
        middleValue
      )}`;
      tdValue.innerHTML = `${value} m`;
      tr.appendChild(tdValue);

      return tr;
    };

    const getPumpInfo = (label, data, property) => {
      let tr = document.createElement("tr");

      let tdLabel = document.createElement("td");
      tdLabel.innerHTML = label;
      tr.appendChild(tdLabel);

      data.forEach((item) => {
        let tdValue = document.createElement("td");
        tdValue.innerHTML = item[property];
        tr.appendChild(tdValue);
      });

      return tr;
    };

    if (this.dataNotification) {
      let data = this.dataNotification;

      // header refresh time
      getHeader();

      // table Tanks
      let tabTanks = document.createElement("table");
      tabTanks.className = "tab";
      tabTanks.appendChild(
        getTankInfo("Канализационный коллектор", data[2].sonar, 1.2, 2)
      );
      tabTanks.appendChild(
        getTankInfo("Дренажный коллектор", data[4].sonar, 2, 3.5)
      );
      wrapper.appendChild(tabTanks);

      // table pumps
      let tabPumps = document.createElement("table");
      tabPumps.className = "tab";
      getPumpInfo("Насос", data, "id");
      getPumpInfo("Статус", data, "status");
      getPumpInfo("Ток", data, "current");
      wrapper.appendChild(tabPumps);

      /*
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

      wrapper.appendChild(tabStatus);

       */
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
