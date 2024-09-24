import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

import router from './router';

createApp(App).use(router).mount('#app');
