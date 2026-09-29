import { createApp } from 'vue';
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/500-italic.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/600-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-mono/500.css'
import App from './App.vue';
import router from './router';
import './assets/main.css';

createApp(App).use(router).mount('#app');
