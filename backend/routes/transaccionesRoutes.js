const express = require('express');
const router = express.Router();
const {
    getAllTransacciones,
    getTransaccionesById,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    getBalance,
  } = require('../controllers/transaccionesController');
  
router.get('/', getAllTransacciones);
router.get('/balance', getBalance);
router.post('/', createTransaccion);
router.put('/:id', updateTransaccion);
router.delete('/:id', deleteTransaccion);
router.get('/:id', getTransaccionesById);

module.exports = router;