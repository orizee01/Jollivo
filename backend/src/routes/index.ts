import express from 'express';

export const ROUTE_BASE = {
  V1_PATH: '/api/v1'
};

const Router = express.Router();

// Lets you (and uptime monitors) confirm the API is running.
Router.get('/health', (_req, res) => {
  res.json({ status: 'success', message: 'Jollivo API is running' });
});

// Feature routes are mounted here as modules are added, e.g.
// Router.use('/auth', authenticationRoutes);

export { Router };
