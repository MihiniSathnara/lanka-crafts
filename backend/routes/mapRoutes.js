import express from 'express';
import { getArtistLocations } from '../controllers/mapController.js';

const router = express.Router();

router.get('/artists', getArtistLocations);

export default router;
