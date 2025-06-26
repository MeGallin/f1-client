// Quick test to verify the new route works
import { router } from '../src/router/index.jsx';

console.log('Testing motorsport-news route...');

// Find the motorsport-news route
const rootRoute = router.routes[0];
const motorsportNewsRoute = rootRoute.children.find(
  (child) => child.path === 'motorsport-news',
);

if (motorsportNewsRoute) {
  console.log('✅ Motorsport News route found!');
  console.log('Route config:', motorsportNewsRoute);
} else {
  console.log('❌ Motorsport News route not found!');
}
