import wlBimViewer from "./cad-viewer/";

const components = [wlBimViewer];

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
  wlBimViewer,
};
