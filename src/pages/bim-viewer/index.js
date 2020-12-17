import wlBimViewer from "./index.vue";

wlBimViewer.install = function(Vue) {
  Vue.component(wlBimViewer.name, wlBimViewer);
};

export default wlBimViewer;
