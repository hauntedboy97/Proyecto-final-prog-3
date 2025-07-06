'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Transacciones', [
  {
    monto: 9850.75,
    fecha: "2025-07-02",
    tipo: "Gasto",
    categoria: "Servicios",
    descripcion: "Factura de electricidad del mes",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    monto: 30000.00,
    fecha: "2025-07-05",
    tipo: "Ingreso",
    categoria: "Inversiones",
    descripcion: "Ganancia por venta de acciones",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    monto: 1800.00,
    fecha: "2025-07-06",
    tipo: "Gasto",
    categoria: "Transporte",
    descripcion: "Recarga de SUBE",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    monto: 6500.00,
    fecha: "2025-07-01",
    tipo: "Gasto",
    categoria: "Entretenimiento",
    descripcion: "Entradas para concierto",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    monto: 7000.00,
    fecha: "2025-06-30",
    tipo: "Ingreso",
    categoria: "Otros Ingresos",
    descripcion: "Reintegro de compra online",
    createdAt: new Date(),
    updatedAt: new Date()
  }
], {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
