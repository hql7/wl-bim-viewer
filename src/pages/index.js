import wlCadViewer from "./cad-viewer/";

const components = [wlCadViewer];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  wlCadViewer,
};
