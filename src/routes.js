import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

const routes = [
    { exact: true, path: '/', exact: true, name: 'Home' },
    { exact: true, path: '/dashboard', name: 'Dashboard', component: Dashboard, paths: ['/dashboard'] }
];

export default routes;
