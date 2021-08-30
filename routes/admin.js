const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// middleware
const { upload, uploadMultiple } = require('../middlewares/mutler');

// dashboard
router.get('/dashboard', adminController.viewDashboard);

// home
router.get('/home', adminController.viewHome);
router.post('/home', adminController.addHome);
router.put('/home', adminController.editHome);
router.delete('/home/:id', adminController.deleteHome);

// items
router.get('/items', adminController.viewItems);
router.post('/items', uploadMultiple, adminController.addItems);
router.get('/items/:id', adminController.viewDetailItems);

// feature
router.get('/feature', adminController.viewFeature);

module.exports = router;
