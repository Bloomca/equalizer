import runApplication from "./main";

document.addEventListener("DOMContentLoaded", () => {
  SC.initialize({
    client_id: "129995c68429621b69af9121acc1c116"
  });

  runApplication("app");
});
