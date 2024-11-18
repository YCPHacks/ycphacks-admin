import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

import router from './router'
import store from './store/store.js';

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
