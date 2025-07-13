const { Sequelize } = require('sequelize')
const { Transacciones } = require('../models');

const getAllTransacciones = async (req, res) => {
    try {
        
        const { monto, page = 1, limit = 10, fecha, categoria } = req.query;
        const where = {};
        if (monto) where.monto = monto;
        if (fecha) { 
            where.fecha = {
                [Sequelize.Op.eq]: fecha 
            };
        }
        if (categoria) { 
            where.categoria = {
                [Sequelize.Op.eq]: categoria
            };
        }

        const offset = (page - 1) * limit;
        const { count, rows: transacciones } = await Transacciones.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });
        res.json({
            transacciones,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las transacciones', message: error.message });
    }
}

const getTransaccionesById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccion = await Transacciones.findByPk(id);
        if (!transaccion) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        res.json(transaccion);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la transacción', message: error.message });
    }
}

const getTransaccionesByFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        if (!fecha) {
            return res.status(404).json({ error: 'Fecha incorrecta o sin transacciones' });
        }

        const transacciones = await Transacciones.findAll({
            where: {
                fecha: {
                    [Sequelize.Op.eq]: fecha
                }
            }
        });

        res.json(transacciones)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener transacciones', messaje: error.message });
    }
};

const getTransaccionesByCategoria = async (req, res) => {
    try {
        const { categoria } = req.query;
        if (!categoria) {
            return res.status(404).json({ error: 'No se encontró la categoria' })
        }
        const transacciones = await Transacciones.findAll({
            where: {
                categoria: {
                    [Sequelize.Op.eq]: categoria
                }
            }
        });
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener transacciones', message: error.message })
    }
};

const createTransaccion = async (req, res) => {
    const { monto, fecha, tipo, categoria, descripcion } = req.body;
        if (!monto || isNaN(monto) || monto <= 0)
            return res.status(400).json({ error: 'Monto inválido' });
        if (!categoria)
            return res.status(400).json({ error: 'Categoría requerida' });
        if (!fecha || isNaN(Date.parse(fecha)))
            return res.status(400).json({ error: 'Fecha inválida' });
    try {
        
        const Transaccion = await Transacciones.create({
            monto,
            fecha: new Date(fecha),
            tipo,
            categoria,
            descripcion
        });
        res.status(201).json({
            message: 'Transacción creada exitosamente',
            Transaccion
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la transacción', message: error.message });
    }
}

const updateTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, fecha, tipo, categoria, descripcion } = req.body;
        const transaccion = await Transacciones.findByPk(id);
        if (!transaccion) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        const updatedTransaccion = await transaccion.update({
            monto: monto || transaccion.monto,
            fecha: fecha || transaccion.fecha,
            tipo,
            categoria: categoria || transaccion.categoria,
            descripcion: descripcion || transaccion.descripcion
        });
        res.json({
            message: 'Transacción actualizada exitosamente',
            updatedTransaccion
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la transacción', message: error.message });
    }
}

const deleteTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccion = await Transacciones.findByPk(id);
        if (!transaccion) {
            return res.status(404).json({ error: 'Transacción no encontrada' });
        }
        await transaccion.destroy();
        res.json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la transacción', message: error.message });
    }
}

const getBalance = async (req, res) => {
    try {
        const resultados = await Transacciones.findAll({
            attributes: [
                'tipo',
                [Sequelize.fn('SUM', Sequelize.col('monto')), 'total']
            ],
            group: ['tipo']
        });
        let ingresos = 0;
        let gastos = 0;
        resultados.forEach(item => {
            const tipo = item.getDataValue('tipo');
            let total = parseFloat(item.getDataValue('total'));
            if (isNaN(total)) {
                total = 0;
            }
            if (tipo == 'ingreso') ingresos = total;
            if (tipo == 'gasto') gastos = total;
        });

        const balance = ingresos - gastos;
        res.json({
            ingreso: ingresos,
            gasto: gastos,
            balance
        });
    } catch (error) {
        console.error('Error en getBalance:', error); // Para depuración
        res.status(500).json({ error: 'Error al obtener el balance', message: error.message });
    }
};

module.exports = {
    getAllTransacciones,
    getTransaccionesById,
    getTransaccionesByFecha,
    getTransaccionesByCategoria,
    createTransaccion,
    updateTransaccion,
    deleteTransaccion,
    getBalance
};