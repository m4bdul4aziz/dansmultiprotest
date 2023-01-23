var express = require('express');

var connection = require('../config/database');
var authenticateJWT = require('../middleware/auth');

var router = express.Router();

const {login} = require('../controllers/loginControllers');
const {recruitment,detailRecruitment} = require('../controllers/recruitmentControllers');

/* login page */
router.post('/login',login)

router.get('/api/recruitment/position',authenticateJWT,recruitment)
router.get('/api/recruitment/position/:id',authenticateJWT,detailRecruitment)

module.exports = router;