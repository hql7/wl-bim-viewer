<template>
  <div id="app">
    <div class="a-logo">
      <a href="http://github.com/hql7">Github</a>&nbsp;
      <a href="17796646068@163.com">Email</a>
      <img alt="Vue logo" class="a-img" src="./assets/logo.png" />
      <a href="https://segmentfault.com/u/weilan_595deafa69d76">Segmentfault</a>&nbsp;
      <a href="https://juejin.im/user/591d141e0ce46300692184a4">掘金</a>
      <div class="u-btn" @click="changeModel">改变模型数据</div>
    </div>
    <!-- viewer区 -->
    <wl-bim-viewer multiple :docs="bims" class="wl-viewer"></wl-bim-viewer>
  </div>
</template>

<script>
import WlBimViewer from "@/pages/bim-viewer";

export default {
  name: "App",
  components: {
    WlBimViewer,
  },
  data() {
    return {
      bims: [
        {
          name: "urn_model1",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo1/0.svf",
          modelObj: null,
        },
        {
          name: "urn_model2",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo2/0.svf",
          modelObj: null,
        },
      ],
      bimsNext: [
        {
          name: "urn_model3",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo3/0.svf",
          modelObj: null,
        },
        {
          name: "urn_model4",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo4/0.svf",
          modelObj: null,
        },
        {
          name: "urn_model5",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo5/Sphere.svf",
          modelObj: null,
        },
        {
          name: "urn_model6",
          path: "http://wlui.oss-cn-beijing.aliyuncs.com/bimdata/demo5/Sphere.svf",
          modelObj: null,
        },
      ],
    };
  },
  methods: {
    changeModel() {
      this.bims = this.bimsNext;
    },
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.a-logo {
  height: 20%;
  margin-bottom: 1%;

  > .a-img {
    height: 100%;
  }
  .u-btn {
    display: inline-block;
    margin-left: 15px;
    padding: 4px 12px;
    border: 1px solid crimson;
    background: coral;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
}

.wl-viewer {
  width: 90%;
  height: 75%;
  margin: 0 auto;
}
</style>
