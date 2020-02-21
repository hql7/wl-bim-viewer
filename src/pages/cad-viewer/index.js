import wlCadViewer from "./index.vue";

wlCadViewer.install = function(Vue) {
  Vue.component(wlCadViewer.name, wlCadViewer);
};

export default wlCadViewer;
