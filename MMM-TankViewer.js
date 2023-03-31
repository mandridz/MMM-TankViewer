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

    const getTankInfoClassNameByValue = (value, criticalValue, middleValue) => {
      let classNme = "";

      if (value <= criticalValue) {
        classNme = "critical";
      } else if (value > criticalValue && value <= middleValue) {
        classNme = "middle";
      } else {
        classNme = "optimum";
      }

      return classNme;
    };

    const getPumpInfoClassNameByValue = (value, lowValue, middleValue) => {
      let classNme = "";

      if (value > 0 && value <= lowValue) {
        classNme = "critical";
      } else if (value > lowValue && value <= middleValue) {
        classNme = "optimum";
      } else if (value > middleValue) {
        classNme = "critical";
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
      tdValue.className = `value ${getTankInfoClassNameByValue(
        value,
        criticalValue,
        middleValue
      )}`;
      tdValue.innerHTML = `${value} m`;
      tr.appendChild(tdValue);

      return tr;
    };

    const getPumpInfo = (label, data, property, lowValue, middleValue) => {
      let tr = document.createElement("tr");

      let tdLabel = document.createElement("td");
      tdLabel.innerHTML = label;
      tr.appendChild(tdLabel);

      data.forEach((item) => {
        let tdValue = document.createElement("td");
        tdValue.className = "status";
        if (property === "status") {
          let imgStatus = document.createElement("img");
          imgStatus.src = item.status
            ? "modules/MMM-TankViewer/img/power-on.png"
            : "modules/MMM-TankViewer/img/power-off.png";
          tdValue.appendChild(imgStatus);
        } else if (property === "current") {
          tdValue.className += ` ${getPumpInfoClassNameByValue(
            item.current,
            3,
            10
          )}`;
          tdValue.innerHTML = item[property];
        } else {
          tdValue.innerHTML = item[property];
        }
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
      tabPumps.appendChild(getPumpInfo("Насос", data, "id"));
      tabPumps.appendChild(getPumpInfo("Статус", data, "status"));
      tabPumps.appendChild(getPumpInfo("Ток, A", data, "current", 3, 10));
      wrapper.appendChild(tabPumps);
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
