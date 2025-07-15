import { Router } from 'express';
import {
    findMatches,
    sendMatchRequest,
    respondToMatch,
    getMyMatches
} from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';
import { validateMatchRequest } from '../middleware/validation';

const router = Router();

// All match routes require authentication
router.use(authenticateToken);

// Match routes
router.get('/find', findMatches);
router.post('/request', validateMatchRequest, sendMatchRequest);
router.put('/respond/:matchId', respondToMatch);
router.get('/my-matches', getMyMatches);

export default router; 