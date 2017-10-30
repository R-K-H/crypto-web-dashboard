import express, { Router } from 'express';
// Import index action from  controller
import { index } from './controllers/market';

// Initialize the router
const router = Router();

// Handle route with index action from  controller
router.route('/market.json')
  .get(index);

export default router;