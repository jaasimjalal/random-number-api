import { Router } from 'express';
import randomRoutes from './random.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/random', randomRoutes);
router.use('/health', healthRoutes);

export default router;