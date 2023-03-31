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

  getScripts: function () {
    return [];
  },

  getStyles: function () {
    return ["MMM-TankViewer.css"];
  },

  start: function () {
    Log.info("Starting module: " + this.name);

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

    const getTankInfoClassNameByValue = (value, criticalValue, normalValue) => {
      let classNme = "";

      if (value <= criticalValue) {
        classNme = "critical";
      } else if (value > criticalValue && value <= normalValue) {
        classNme = "sub-critical";
      } else {
        classNme = "optimum";
      }

      return classNme;
    };

    const getPumpInfoClassNameByValue = (value, criticalValue, normalValue) => {
      let classNme = "";

      if (value > 0 && value <= criticalValue) {
        classNme = "critical";
      } else if (value > criticalValue && value <= normalValue) {
        classNme = "optimum";
      } else if (value > normalValue) {
        classNme = "critical";
      }

      return classNme;
    };

    const getTankInfo = (label, value, criticalValue, normalValue) => {
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
        normalValue
      )}`;
      tdValue.innerHTML = `${value} m`;
      tr.appendChild(tdValue);

      return tr;
    };

    const getPumpInfo = (label, data, property, criticalValue, normalValue) => {
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
            criticalValue,
            normalValue
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
        getTankInfo(
          "Канализационный коллектор",
          data[2].sonar,
          this.config.criticalDeepSewerValue,
          this.config.normalDeepSewerValue
        )
      );
      tabTanks.appendChild(
        getTankInfo(
          "Дренажный коллектор",
          data[4].sonar,
          this.config.criticalDeepDrainValue,
          this.config.normalDeepDrainValue
        )
      );
      wrapper.appendChild(tabTanks);

      // table pumps
      let tabPumps = document.createElement("table");
      tabPumps.className = "tab";
      tabPumps.appendChild(getPumpInfo("Насос", data, "id"));
      tabPumps.appendChild(getPumpInfo("Статус", data, "status"));
      tabPumps.appendChild(
        getPumpInfo(
          "Ток, A",
          data,
          "current",
          this.config.criticalCurrentValue,
          this.config.normakCurrentValue
        )
      );
      wrapper.appendChild(tabPumps);
    }

    return wrapper;
  },

  // socketNotificationReceived from helper
  socketNotificationReceived: function (notification, payload) {
    if (notification === "MMM-TankViewer-WS_RESPONSE") {
      // set dataNotification
      this.dataNotification = payload;
      this.updateDom();
    }
  },
});
