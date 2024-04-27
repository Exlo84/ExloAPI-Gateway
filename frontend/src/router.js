import { createRouter, createWebHistory } from 'vue-router';

const Home = () => import('./components/HelloWorld.vue');
const Models = () => import('./components/Models.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/models',
    name: 'Models',
    component: Models
  }
  // Add additional routes as needed
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  console.log(`Navigating from ${from.name} to ${to.name}`);
  next();
});

router.afterEach((to, from) => {
  console.log(`Navigation to ${to.name} from ${from.name} completed`);
});

export default router;