import Slide from "./Slide.vue";
import Carousel3d from "./Carousel3d.vue";

const install = (Vue) => {
    Vue.component('carousel3d', Carousel3d)
    Vue.component('slide', Slide)
}

export default {
    install
}

export {
    Carousel3d,
    Slide
}
