import { Router } from 'express';
import { generateRandomNumber } from '../controllers/random.controller';
import { validateRandomNumberParams } from '../middleware/validation';

const router = Router();

router.get('/', validateRandomNumberParams, generateRandomNumber);

export default router;