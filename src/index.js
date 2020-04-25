import "core-js/stable";
import "regenerator-runtime/runtime";

import ally from './ally';

(function (ally) {
  let okr = new ally.OKR(document.querySelector("#app"),
    "https://okrcentral.github.io/sample-okrs/db.json");
  okr.init();
})(ally);