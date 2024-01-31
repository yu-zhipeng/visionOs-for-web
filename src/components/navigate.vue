<!-- navigate -->
<template>
  <div id="left-navigate">
    <div @mousemove="++lightAngle" :style="{'--light-angle': lightAngle + 'deg' }" ref="leftNavigate" class="left-navigate fresnel-rect" >
      <div @click="handleClick(item, index)" class="left-navigate-item" v-for="(item, index) in navigateButtons">
        <div class="btn" :class="activeButton === index ? 'active-btn' : ''">
          <span class="iconfont app-icon" :class="item.icon" ></span>
          <span class="app-label" >{{ item.label }}</span>
        </div>
      </div>
    </div>
    <!-- <input style="position: absolute;" type="text" v-model="lightAngle" > -->
  </div>
</template>

<script setup >
import { ref } from 'vue';
// import interact from "interactjs"

if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule('data:text/javascript,' + encodeURIComponent(`

      function create360Gradient(ctx, size, angle) {
        // 将角度转换为弧度
        const radians = angle * Math.PI / 180;

        // 计算渐变的起点和终点
        const x1 = size.width / 2 + size.width / 2 * Math.cos(radians);
        const y1 = size.height / 2 + size.height / 2 * Math.sin(radians);
        const x2 = size.width / 2 - size.width / 2 * Math.cos(radians);
        const y2 = size.height / 2 - size.height / 2 * Math.sin(radians);

        // 创建线性渐变
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        return gradient;
      }

      class FresnelRectPainter {
          static get inputProperties() { return ['--border-radius', '--fresnel-color', '--light-angle']; }

          paint(ctx, size, properties) {
              const borderRadius = parseFloat(properties.get('--border-radius')[0]) || 30;
              const fresnelColor = properties.get('--fresnel-color')[0] || 'rgba(255, 255, 255, .1)';
              const lightAngle = parseFloat(properties.get('--light-angle')[0]) || 0;

              // 绘制圆角矩形
              ctx.beginPath();
              ctx.moveTo(borderRadius, 0);
              ctx.lineTo(size.width - borderRadius, 0);
              ctx.arcTo(size.width, 0, size.width, borderRadius, borderRadius);
              ctx.lineTo(size.width, size.height - borderRadius);
              ctx.arcTo(size.width, size.height, size.width - borderRadius, size.height, borderRadius);
              ctx.lineTo(borderRadius, size.height);
              ctx.arcTo(0, size.height, 0, size.height - borderRadius, borderRadius);
              ctx.lineTo(0, borderRadius);
              ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
              ctx.closePath();
              ctx.fillStyle = 'rgba(255, 255, 255, .2)'; // 填充颜色
              ctx.fill();

              // 模拟光照效果
              const gradient = create360Gradient(ctx, size, lightAngle)
              ctx.fillStyle = gradient;
              ctx.fill();

              // 添加菲涅尔效果
              // 这里我们简单使用边缘渐变来模拟
              const borderGradient = ctx.createLinearGradient(0, 0, size.width, size.height);
              borderGradient.addColorStop(0, fresnelColor);
              borderGradient.addColorStop(0.2, 'rgba(255,255,255, 0.7)');
              borderGradient.addColorStop(1, fresnelColor);

              ctx.strokeStyle = borderGradient;
              ctx.lineWidth = 2; // 设置线宽来控制菲涅尔效果的宽度
              ctx.stroke();
          }
      }

      registerPaint('fresnelRect', FresnelRectPainter);
  `));
}

const activeButton = ref(0)

const lightAngle = ref(0)

const updateLightAngle = (newAngle) => {
  lightAngle.value = newAngle;
};

const navigateButtons = ref([{
  label: "Apps",
  icon: "icon-ios-baseball",
}, {
  label: "People",
  icon: "icon-ios-chatbubbles",
}, {
  label: "Environments",
  icon: "icon-ios-aperture",
}])

const leftNavigate = ref(null)
// const position = { x: 0, y: 0 }
// interact('.left-navigate').draggable({
//   // origin: 'self',
//   // inertia: true,
//   listeners: {
//     move(event) {
//       console.log(event.pageX, event.pageY)
//       position.x += event.dx
//       position.y += event.dy
//       event.target.style.transform =
//         `translate(${position.x}px, ${position.y}px)`
//       // leftNavigate.value.pageX = event.pageX
//       // leftNavigate.value.pageY = event.pageY
//       // leftNavigate.value.setAttribute("style", `transform: translate(${event.pageX}px, ${event.pageY}px);`)
//     },
//   },
// })
const handleClick = (item, index) => {
  activeButton.value = index
}

</script>
<style scoped>

.fresnel-rect {
  background-image: paint(fresnelRect);
}

@supports (background: paint(id)) {
  .fresnel-rect {
    background-image: paint(fresnelRect);
  }
}

#left-navigate {
  position: absolute;
  top: calc(50% - 110px);
  left: -150px;
  z-index: 1;
}

.left-navigate {
  z-index: 1;
  position: relative;
  height: auto;
  padding: 10px 0px;
  backdrop-filter: blur(3px);
  border-radius: 30px;
  transition: all ease-in-out .3s;
  width: 54px;

  .left-navigate-item {
    padding: 0px 7px;
    color: aliceblue;
    overflow: hidden;
  }
}

.left-navigate:hover {
  width: 200px;
  cursor: pointer !important;
  transition: all ease-in-out .3s;
}


.active-btn {
  background-color: rgba(255, 255, 255, 0.5);
  width: 40px;
  border-radius: 30px;
  color: #fff !important;
  transition: all ease-in-out .3s;
  .app-label {
  color: #fff !important;
  }
}

.left-navigate:hover .active-btn {
  width: 185px;
  transition: none;
}
.left-navigate:hover .app-label {
  padding-left: 0px;
}

.btn {
  width: 40px;
  height: 40px;
  color: #e6e6e6;
  position: relative;
  .iconfont {
    font-size: 24px;
  }
}

.app-icon {
  position: absolute;
  left: 8.5px;
  top: 2px;
}
.app-label {
  position: absolute;
  left: 50px;
  top: 8px;
  color: #e6e6e6;
}
</style>