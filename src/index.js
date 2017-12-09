import { waitDOMReady } from "./utils/dom";
import runApplication from "./main";

waitDOMReady().then(() => {
  SC.initialize({
    client_id: "129995c68429621b69af9121acc1c116"
  });

  runApplication("app");
});
