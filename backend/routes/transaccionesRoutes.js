const express = require('express');
const router = express.Router();
const {
    getAllTransacciones,
    getTransaccionesById,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion
  } = require('../controllers/transaccionesController');
  
router.get('/', getAllTransacciones);
router.get('/:id', getTransaccionesById);
router.post('/', createTransaccion);
router.put('/:id', updateTransaccion);
router.delete('/:id', deleteTransaccion);

module.exports = router;