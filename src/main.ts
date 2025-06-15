import 'virtual:uno.css';
import { createApp } from 'vue';
import '@unocss/reset/tailwind-compat.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/common.scss';
import router from './router';
import pinia from './store';
import App from './App.vue';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ElementPlus);

app.mount('#app');
