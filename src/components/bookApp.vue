<!-- book -->
<template>
    <div id="vision-app-bookapp">
        <div :style="{ '--light-angle': lightAngle + 'deg' }" ref="leftNavigate" class="vision-app fresnel-rect">
            <!-- <div>随手记</div> -->


            <div class="app-operate">
                <span class="app-close" @click="closeWindow">
                </span>
                <span id="vision-app-bookapp-move" class="app-move"></span>
            </div>
            <div class="app-operate-scale">
                <svg width="150" height="50" xmlns="http://www.w3.org/2000/svg">
                    <!-- 绘制一个矩形并在中间弯曲90度 -->
                    <path id="vision-app-bookapp-scale" d="M 37 25
           L 45 24
           Q 53 25 55 15
           L 55 10
           Q 59 2.5 63 10
           L 63 20
           Q 60 33 45 33
           L 37 33
           Q 29 29 37 25
           " fill="#FFFFFF" />
                </svg>
            </div>
        </div>
        <!-- <input style="position: absolute;" type="text" v-model="lightAngle" > -->
    </div>
</template>

<script setup >
import { ref, onMounted } from 'vue';
import interact from "interactjs"
let appDom = null
const emit = defineEmits(['close']);

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

        class FresnelAppRectPainter {
            static get inputProperties() { return ['--border-radius', '--fresnel-color', '--light-angle']; }

            paint(ctx, size, properties) {
                const borderRadius = properties.get('--border-radius').value || 30;
                const fresnelColor = properties.get('--fresnel-color').toString() || 'rgba(255, 255, 255, .9)';
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
                ctx.fillStyle = 'rgba(163, 163, 163)'; // 填充颜色
                ctx.fill();

                // 模拟光照效果
                const gradient = create360Gradient(ctx, size, lightAngle)
                ctx.fillStyle = gradient;
                ctx.fill();

                // 添加菲涅尔效果
                // 这里我们简单使用边缘渐变来模拟
                const borderGradient = ctx.createLinearGradient(0, 0, size.width, size.height);
                borderGradient.addColorStop(0, fresnelColor);
                borderGradient.addColorStop(0.7, 'rgba(255,255,255, 0.7)');
                borderGradient.addColorStop(1, fresnelColor);

                ctx.strokeStyle = borderGradient;
                ctx.lineWidth = 1.5; // 设置线宽来控制菲涅尔效果的宽度
                ctx.stroke();
            }
        }

        registerPaint('fresnelAppRect', FresnelAppRectPainter);
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
const position = { x: 0, y: 0 }

interact('#vision-app-bookapp-move').draggable({
    // origin: 'self',
    // inertia: true,
    listeners: {
        move(event) {
            console.log(event.pageX, event.pageY)
            position.x += event.dx
            position.y += event.dy
            appDom.style.transform =
                `translate(${position.x}px, ${position.y}px)`
            // event.target.style.transform =
            //     `translate(${position.x}px, ${position.y}px)`
            // leftNavigate.value.pageX = event.pageX
            // leftNavigate.value.pageY = event.pageY
            // leftNavigate.value.setAttribute("style", `transform: translate(${event.pageX}px, ${event.pageY}px);`)
        },
    },
})
const win = { width: 0, height: 0 }
interact('#vision-app-bookapp-scale').resizable({
    // origin: 'self',
    // inertia: true,
    edges: { top: false, left: false, bottom: true, right: true },
    listeners: {
        move(event) {
            const style = appDom.getBoundingClientRect()
            console.log(style.height + event.dy)
            Object.assign(appDom.style, {
                width: `${style.width + event.dx}px`,
                height: `${style.height + event.dy}px`
            })
            // Object.assign(event.target.dataset, { x, y })
        },
    },
})

const closeWindow = () => {
    emit('close');
    setTimeout(() => {
        position.x = 0
        position.y = 0
        appDom.style.transform =
            `translate(${0}px, ${0}px)`
    }, 300)
}

onMounted(() => {
    appDom = document.querySelector("#vision-app-bookapp")
})

</script>
<style scoped>
.fresnel-rect {
    background-image: paint(fresnelAppRect);
}

@supports (background: paint(id)) {
    .fresnel-rect {
        background-image: paint(fresnelAppRect);
    }
}

#vision-app-bookapp {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    height: 600px;
}

.vision-app {
    z-index: 1;
    position: relative;
    width: 1000px;
    height: 100%;
    padding: 10px 0px;
    backdrop-filter: blur(3px);
    border-radius: 30px;
}

.vision-app:hover {
    cursor: default !important;
}

.app-operate {
    position: absolute;
    bottom: -20px;
    display: flex;
    left: 50%;
    transform: translateX(-50%);

    .app-move {
        width: 120px;
        height: 8px;
        background-color: rgb(163, 163, 163);
        margin-left: 16px;
        border-radius: 10px;
        transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
    }

    .app-move:hover {
        transition: all 0.3s ease-in-out;
        transform: scale3d(1.1, 1.1, 1.1);
        background-color: rgb(255, 255, 255);

        .app-close {
            display: none;
        }
    }

    .app-move:active {
        transition: all 0.3s ease-in-out;
        transform: scale3d(1.0, 1.0, 1);
        background-color: rgb(255, 255, 255);
    }

    .app-move:active .app-close {
        display: none;
    }

    .app-close {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgb(163, 163, 163);
        position: relative;
        transition: all 0.3s ease-in-out;
    }

    .app-close:hover {
        transform: scale3d(1.3, 1.3, 1.3);
        background-color: rgb(255, 255, 255);
    }
}

.app-operate-scale {
    position: absolute;
    right: -98px;
    bottom: -38px;
    z-index: 1;
    transition: all 0.3s ease-in-out;
    opacity: 0;
    transform: scale(0.9);
}

#vision-app-bookapp-scale {
    cursor: inherit !important;
}

.app-operate-scale:hover {
    transform: scale(1.1);
    opacity: 1;
}

.app-operate-scale:active {
    transform: scale(0.9);
}
</style>