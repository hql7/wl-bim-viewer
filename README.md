# wl-bim-viewer

一个用于在浏览器上展示bim模型的vue插件，可以预览转化后的BIM、CAD文件。       
基于vue和autodesk forge viewer写成。        
目前支持单模型加载及多模型顺序加载。        
其他特性正在扩展中。

传送门：[Github](https://github.com/hql7/wl-bim-viewer)      &        [autodesk forge viewer文档](https://forge.autodesk.com/en/docs/viewer/v7/reference/Viewing/)

## [在线访问](http://wlui.com.cn/ui/bim) 

## 快速上手
`npm i wl-bim-viewer -S`

```
import wlBimViewer from "wl-bim-viewer";`
import "wl-bim-viewer/lib/wl-bim-viewer.css"
Vue.use(wlBimViewer);
```

```
<wl-bim-viewer 
    multiple 
    :docs="bims" 
    class="wl-viewer">
</wl-bim-viewer>
```

### 重要更新
> 1.1.0 减少组件包体积，将js依赖cdn；请勿使用低于1.1.0版本

## 文档

### Attributes
| 序号 | 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| 1 | docs | 模型数据数组，元素为对象且至少需要一个path字段（模型文件路径，可配置） | Array | - |
| 2 | props | 配置项,详见下 | Object | - |
| 3 | multiple | 是否开启多模型顺序加载 | Boolean | false |

### props
| 序号 | 参数 | 说明 | 默认字段 | 字段值类型 |
| ---- | ---- | ---- | ---- | ---- |
| 1 | path | 用于配置docs参数内的模型文件路径字段，必填 | path | String |
| 2 | options | 用于loadModel时的自定义模型配置项，可配置模型角度、位置等。此字段应是一个对象 | options | Object |
| 3 | name | 用于docs参数内模型的名称字段，选填 | name | String |

### Events
| 序号 | 事件名称 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | init | viewer初始化事件，此时模型还未加载，可进行配置或注册事件操作 | function(viewer) 依次为当前viewer对象 | 
| 2 | partSelect | 构件点击事件 | function(selections, event, info) 以此为当前选择构件、当前点击对象、构件信息 | 
| 3 | cameraMove | 摄像头移动事件 | function(rvt) 依次为当前rvt对象 |
| 4 | successAll | 多模型时，全部加载完毕事件 | function(result) 依次为全部模型对象数组 |
| 5 | errorAll | 多模型时，全部加载失败事件 | function(result) 依次为失败信息 |
| 6 | success | 模型加载成功回调 | function(result) 依次为当前模型信息 |
| 7 | loaded | 模型渲染完毕回调 | function(evt) 依次为当前模型信息 |
| 8 | error | 模型加载失败回调 | function(name, code) 依次为当前模型docs参数name字段、错误码 |

### Form Methods
| 序号 | 方法名 | 说明 | 参数 |
| ---- | ---- | ---- | ---- |
| 1 | clearColor | 清空模型构件上色 | - |
| 2 | viewerFiting | 聚焦摄像头 | function(ids, focal) 依次为需要聚焦至的构件id、焦距 | 
| 3 | unloadModel | 卸载model模型 | function(model) 依次为需要卸载的模型model，无则默认为当前model | 
| 4 | uploadViewer | 卸载viewer | - |
| 5 | getModelInfo | 获取模型信息 | function(viewer, models) 依次为viewer对象、已加载的model对象 | 

### Slot
| 序号 | name | 说明 |
| ---- | ---- | ---- |
| 1 | - | 位于模型dom下的自定义dom区 | 

### 版本记录
> 1.1.0 减少组件包体积，将js依赖cdn

> 1.0.0 因国外cdn时间波动太大，将js依赖本地化，并优化初始化事件防止init错误

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

