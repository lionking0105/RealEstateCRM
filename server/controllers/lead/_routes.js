const express = require('express');
const lead = require('./lead');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, lead.index)
router.post('/add', auth, lead.add)
router.get('/view/:id', auth, lead.view)
router.put('/edit/:id', auth, lead.edit)
router.delete('/delete/:id', auth, lead.deleteData)
router.post('/deleteMany', auth, lead.deleteMany)


module.exports = router