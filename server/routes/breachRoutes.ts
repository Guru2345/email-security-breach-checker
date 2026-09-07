import { Router } from 'express';
import {
  handleCheckEmail,
  handleCheckProfile,
  handleGetConfig,
  handleCheckPasswordPwned,
  handleSearchBreaches,
  handleValidateKey,
  handleAnalyzeUpiSms,
  handleGet30BreachReport,
  handleImportHibpBreaches,
} from '../controllers/breachController.js';

const router = Router();

router.get('/check-email', handleCheckEmail);
router.post('/check-email', handleCheckEmail);
router.get('/check-profile', handleCheckProfile);
router.post('/check-profile', handleCheckProfile);
router.get('/config', handleGetConfig);
router.get('/check-password-pwned', handleCheckPasswordPwned);
router.post('/check-password-pwned', handleCheckPasswordPwned);
router.get('/search-breaches', handleSearchBreaches);
router.post('/validate-key', handleValidateKey);
router.post('/analyze-upi-sms', handleAnalyzeUpiSms);
router.get('/get-30-breaches', handleGet30BreachReport);
router.post('/get-30-breaches', handleGet30BreachReport);
router.post('/import-hibp-breaches', handleImportHibpBreaches);

export default router;

