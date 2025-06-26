import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const data = {
  props: {},
};

const routes = constructRoutes(microfrontendLayout, data);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    System.import("zone.js");
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
redirectToAuthIfNotLoggedIn();
redirectAfterLogin();
start();

function toggleSidebar() {
  const token = localStorage.getItem('token');
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
 sidebar.style.display = token ? 'block' : 'none';
}

toggleSidebar();

// Hide/ display side bar based on token -> if login is successfully then only show side bar and micro apps else redirect to auth login micro app
window.addEventListener('storage', (event) => { //listen browser application storage change
  if (event.key === 'token') {
    toggleSidebar();
    redirectToAuthIfNotLoggedIn();
    redirectAfterLogin();
  }
});

window.addEventListener('auth-success', () => {
  toggleSidebarVisibility();
  const currentPath = window.location.pathname;
  if (currentPath === '/auth') {
    window.history.replaceState(null, '', '/settings');
    // notify single spa router to load settings micro app
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
});

//  redirect to login micro app if not logged in yet
function redirectToAuthIfNotLoggedIn() {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  if (!token && currentPath !== '/auth') {
    window.history.pushState(null, '', '/auth');
    // notify single spa router to load auth micro app
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// After user login successfull redirect to settings page
function redirectAfterLogin() {
  const token = localStorage.getItem('token');
  const currentPath = window.location.pathname;

  if (token && currentPath === '/auth') {
    window.history.replaceState(null, '', '/settings');
     // notify single spa router to load settings micro app
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}