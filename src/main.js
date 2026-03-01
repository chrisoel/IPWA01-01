// REQ: RB-05 Einsatz von Vue und Bootstrap; QA-08 standardisierte Bibliotheken fuer aktuelle Browser; QA-09 optimierte Auslieferung ueber Framework-Assets
import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles.css'

import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
