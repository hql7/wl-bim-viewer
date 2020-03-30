<template>
  <div class="wl-bim-viewer">
    <!-- 注入外部Viewer3Dcss -->
    <cssLink></cssLink>
    <!-- 注入外部Viewer3Djs -->
    <scriptLink></scriptLink>
    <!-- 模型区 -->
    <div id="wl-viewer-box" class="wl-viewer-box">
      <div class="wl-viewer-loading" v-if="init"></div>
    </div>
    <!-- 自定义区 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "wlBimViewer",
  components: {
    scriptLink: {
      render(createElement) {
        return createElement("script", {
          attrs: {
            type: "text/javascript",
            src:
              // "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js"
              "http://wlui.oss-cn-beijing.aliyuncs.com/viewer3D.min.js"
          }
        });
      }
    },
    cssLink: {
      render(createElement) {
        return createElement("link", {
          attrs: {
            type: "text/css",
            rel: "stylesheet",
            href:
              // "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css"
              "http://wlui.oss-cn-beijing.aliyuncs.com/style.min.css"
          }
        });
      }
    }
  },
  props: {
    // 模型数据
    docs: Array,
    // 配置项
    props: Object,
    // 是否开启多模型，如果开启则按顺序加载docs数组内的模型
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      viewer: null, // 模型环境变量
      db: {}, // 记录模型数据
      load_options: {}, // 模型加载配置项
      index: null, // 在加载过程中的当前模型索引
      select_info: [], // 选中构建信息
      timer: null,
      init: false
    };
  },
  computed: {
    // 模型数组
    modelArray() {
      return this.docs || [];
    },
    // 模型配置项
    selfProps() {
      return {
        path: "path", // docs数据内得路径字段 必填
        options: "options", // docs数据内的配置项字段，此字段应是一个对象，具体看autodesk forge viewer文档
        name: "name" // 模型名称
      };
    }
  },
  mounted() {
    this.init = true;
    this.timer = setInterval(() => {
      if (window.THREE && window.THREE.Matrix4) {
        clearInterval(this.timer);
        let mat = new window.THREE.Matrix4();
        this.load_options = {
          placementTransform: mat
        };
        this.initViewer();
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
    this.init = false;
    this.uploadViewer();
  },
  methods: {
    // 初始化模型加载器
    initViewer() {
      // 初始化配置项
      let options = {
        env: "Local",
        offline: "true",
        useADP: false
      };
      let self = this;
      // 初始化
      window.Autodesk.Viewing.Initializer(options, function onInitialized() {
        //get the viewer div
        let viewerDiv = document.getElementById("wl-viewer-box");
        //initialize the viewer object
        self.viewer = new window.Autodesk.Viewing.Private.GuiViewer3D(
          viewerDiv,
          {}
        );

        // 初始化回调
        self.$emit("init", self.viewer);

        // self.viewer.initialize();
        // self.viewer.setReverseZoomDirection(true);

        // 关掉渐进式渲染来避免场景闪烁
        // self.viewer.setProgressiveRendering(false);

        // 调用模型加载
        self.multiple ? self.orderLoading() : self.promiseEachModel(0);

        // 多模型选择构建事件监听
        self.viewer.addEventListener(
          window.Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT,
          function(event) {
            /* let color = new THREE.Vector4(0, 0.5, 0, 1);
            let id = event.selections[0].dbIdArray[0];
            self.viewer.setThemingColor(id, color); */

            self.select_info = self.viewer.getAggregateSelection();

            self.$emit(
              "partSelect",
              event.selections,
              event,
              self.viewer.getAggregateSelection()
            );
          }
        );

        // 摄像头新事件 当摄像头的 Transition 完成后就会被触发
        /* self.viewer.addEventListener(
          window.Autodesk.Viewing.CAMERA_TRANSITION_COMPLETED,
          function() {}
        ); */

        // 摄像头变化事件
        self.viewer.addEventListener(
          window.Autodesk.Viewing.CAMERA_CHANGE_EVENT,
          function(rvt) {
            self.$emit("cameraMove", rvt);

            //find out all pushpin markups
            /* let $eles = $("div[id^='mymk']");
            let DOMeles = $eles.get();
            for (let index in DOMeles) {
              //get each DOM element
              let DOMEle = DOMeles[index];
              let divEle = $("#" + DOMEle.id);
              //get out the 3D coordination
              let val = divEle.data("3DData");
              let pushpinModelPt = JSON.parse(val);
              //get the updated screen point
              // let screenpoint = viewer.worldToClient(
              //   new THREE.Vector3(
              //     pushpinModelPt.x,
              //     pushpinModelPt.y,
              //     pushpinModelPt.z
              //   )
              // );
              let screenpoint = self.worldToClient(
                pushpinModelPt.id,
                self.db[pushpinModelPt.mid]
              );
              //update the SVG position.
              divEle.css({
                left: screenpoint.x,
                top: screenpoint.y
              });
            } */
          }
        );
        // 动画初始化触发
        /* self.viewer.addEventListener(
          window.Autodesk.Viewing.ANIMATION_READY_EVENT,
          function(e) {}
        ); */
      });
    },
    /**
     * 加载模型
     * item 模型数据
     * index 模型索引
     */
    loadModel(item = {}, index = 0, successCb, errorCb) {
      let _options = Object.assign(
        {},
        this.load_options,
        item[this.selfProps.options]
      );
      index === 0
        ? this.viewer.start(
            item[this.selfProps.path],
            _options,
            successCb,
            errorCb
          )
        : this.viewer.loadModel(
            item[this.selfProps.path],
            _options,
            successCb,
            errorCb
          );
    },
    // 有序加载
    orderLoading() {
      let index_arr = Array.apply(null, Array(this.modelArray.length)).map(
        (item, index) => index
      );
      // 调用队列加载
      this.processArray(index_arr, this.promiseEachModel).then(
        result => {
          //全部加载完成
          this.$emit("successAll", result);
        },
        reason => {
          this.$emit("errorAll", reason);
        }
      );
    },
    /**
     * 顺序异步加载model
     */
    promiseEachModel(index) {
      return new Promise((resolve, reject) => {
        let modelName = this.modelArray[index][this.selfProps.name];
        let self = this;
        this.loadModel(
          this.modelArray[index],
          index,
          _onLoadModelSuccess,
          _onLoadModelError
        );
        return;

        // 加载成功回调
        function _onLoadModelSuccess(model) {
          self.$emit("success", model);

          self.db[model.id] = model;

          // 监听model渲染完成
          self.viewer.addEventListener(
            window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            _onGeometryLoaded
          );

          //map this item with the corresponding model in case of use
          self.modelArray[index].modelObj = model;
          self.init = false;
        }

        // model渲染完毕回调
        function _onGeometryLoaded(evt) {
          self.init = false;
          /* if ([4, 5].includes(index)) {
            self.drawPushpin(2, evt.model);
          }
          // 部分模型上色
          if (
            !["urn_model2", "urn_model3", "urn_model5", "urn_model6"].includes(
              self.modelArray[index].modelName
            )
          ) {
            self.setModelColor(0, 0.5, 0, 0.5, evt.model);
          }

          // 聚焦到某个模型
          if (self.modelArray[index].modelName === "urn_model5") {
            // 调整焦距
            let focal = self.viewer.getFocalLength();
            self.viewer.setFocalLength(focal - 20);
            // 聚焦指定模型
            self.viewer.fitToView([1], evt.model);
            self.setModelColor(0.5, 0, 0, 0.5, evt.model);
          }

          // 指定模型上色
          if (self.modelArray[index].modelName === "urn_model6") {
            self.setModelColor(0, 0, 0.5, 0.5, evt.model);
          }

          // 指定模型动画
          if ([4, 5].includes(index)) {
            self.setModelRemove(evt.model, 0, 2);
        } */
          self.$emit("loaded", evt);

          // 移除model渲染完毕事件监听
          self.viewer.removeEventListener(
            window.Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
            _onGeometryLoaded
          );

          resolve(self.modelArray[index]);
        }

        // 加载失败回调
        function _onLoadModelError(viewerErrorCode) {
          console.error(
            modelName + ": Load Model Error, errorCode:" + viewerErrorCode
          );
          self.$emit("error", modelName, viewerErrorCode);
          self.init = false;
          //any error
          reject(modelName + " Loading Failed!" + viewerErrorCode);
          // 加载失败回调结束
        }
      });
    },
    // 队列调用
    processArray(array, fn) {
      let results = [];
      return array.reduce(function(p, item) {
        return p.then(function() {
          return fn(item).then(function(data) {
            results.push(data);
            return results;
          });
        });
      }, Promise.resolve());
    },
    // 清空cad颜色
    clearColor() {
      this.viewer && this.viewer.clearThemingColors();
    },
    /**
     * 聚焦指定构件
     * dbids 构件ids
     * focal 焦距
     */
    viewerFiting(ids, focal) {
      if (!this.viewer) return;
      // 调整焦距
      let _focal = focal || this.viewer.getFocalLength();
      this.viewer.setFocalLength(_focal);
      this.viewer.fitToView(ids);
    },
    // 卸载model
    unloadModel(model) {
      this.viewer.impl.unloadModel(model || this.viewer.model);
    },
    // 卸载viewer
    uploadViewer() {
      this.viewer.tearDown();
      this.viewer.finish();
      this.viewer = null;
      window.Autodesk.Viewing.shutdown();
    },
    // 获取模型信息
    getModelInfo() {
      return {
        viewer: this.viewer,
        models: this.db
      };
    }
  }
};
</script>

<style lang="scss">
.wl-viewer-box {
  position: relative;
  width: 100%;
  height: 100%;

  .wl-viewer-loading {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    background: url("../../assets/images/loading.gif") center no-repeat;
    background-color: #fff;
  }
}
</style>