import { createApp } from 'vue';
import { inject } from '@vercel/analytics';
import App from './App.vue';
import './style.css';
import { i18n } from './i18n';

inject();

const app = createApp(App);
app.use(i18n);
app.mount('#app');
