import { createApp } from 'vue';

import chatView from './views/chatView/index.vue';


const app = createApp(chatView);

app.mount('#app');

console.log('test', app);
