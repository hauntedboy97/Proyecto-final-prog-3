const express = require('express');
const router = express.Router();
const {
    getAllTransacciones,
    getTransaccionesById,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    getBalance,
    getTransaccionesByFecha,
    getTransaccionesByCategoria
  } = require('../controllers/transaccionesController');
  
router.get('/', getAllTransacciones);
router.get('/:id', getTransaccionesById);
router.get('/:fecha', getTransaccionesByFecha);
router.get('/:categoria', getTransaccionesByCategoria);
router.get('/balance', getBalance);
router.post('/', createTransaccion);
router.put('/:id', updateTransaccion);
router.delete('/:id', deleteTransaccion);

module.exports = router;