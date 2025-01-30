const express = require('express');
const router = express.Router();

const ThoughtsController = require('../controllers/ThoughtsController');

const checkAuth = require('../helpers/auth').checkAuth;

router.get('/dashboard', checkAuth, ThoughtsController.dashboard);
router.post('/remove', checkAuth, ThoughtsController.removeThought);
router.get('/edit/:id', checkAuth, ThoughtsController.updateThought);
router.post('/edit', checkAuth, ThoughtsController.updateThoughtPost);
router.get('/add', checkAuth, ThoughtsController.createThought);
router.post('/add', checkAuth, ThoughtsController.createThoughtPost);
router.get('/', ThoughtsController.showThoughts);

module.exports = router;