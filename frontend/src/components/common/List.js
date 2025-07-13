// List.js
import React, { useState, useEffect } from 'react';
import './List.css';

const API_URL = 'http://localhost:3001/api/transacciones';

function TodoList() {
  const [transacciones, setTransacciones] = useState([]);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [balance, setBalance] = useState({ ingreso: 0, gasto: 0, balance: 0 });

  useEffect(() => {
    fetchTransaccionesAndBalance();
  }, []);

  const fetchTransaccionesAndBalance = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTransacciones(data.transacciones || []))
      .catch(err => console.error('Error al cargar transacciones:', err));

    fetch(`${API_URL}/balance`)
      .then(res => res.json())
      .then(data => {
        setBalance({
          ingreso: typeof data.ingreso === 'number' ? data.ingreso : 0,
          gasto: typeof data.gasto === 'number' ? data.gasto : 0,
          balance: typeof data.balance === 'number' ? data.balance : 0
        });
      })
      .catch(err => console.error('Error al cargar el balance:', err));
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toISOString().split('T')[0];
  };

  const addTransaccion = () => {
    if (!monto || !fecha || !tipo || !categoria) {
      alert('Todos los campos excepto la descripción son obligatorios.');
      return;
    }

    const tipoValido = tipo.toLowerCase();
    if (tipoValido !== 'ingreso' && tipoValido !== 'gasto') {
      alert('El tipo debe ser "ingreso" o "gasto".');
      return;
    }

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      alert('La fecha debe tener el formato YYYY-MM-DD.');
      return;
    }

    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (isNaN(fechaIngresada.getTime())) {
      alert('La fecha no es válida.');
      return;
    }

    if (fechaIngresada > hoy) {
      alert('La fecha no puede ser posterior a hoy.');
      return;
    }

    const newTransaccion = {
      monto: parseFloat(monto),
      fecha,
      tipo: tipoValido,
      categoria,
      descripcion: descripcion || ''
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaccion),
    })
      .then(res => res.json())
      .then(() => {
        fetchTransaccionesAndBalance();
        setMonto('');
        setFecha('');
        setTipo('');
        setCategoria('');
        setDescripcion('');
      })
      .catch(err => console.error('Error al crear transaccion:', err));
  };

  const deleteTransaccion = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchTransaccionesAndBalance();
      })
      .catch(err => console.error('Error al eliminar la transaccion:', err));
  };

  const transaccionesFiltradas = transacciones.filter((t) =>
    (t.fecha || '').startsWith(filtroFecha) &&
    (t.categoria || '').toLowerCase().startsWith(filtroCategoria)
  );

  return (
    <div className="container">
      <div className="layout">
        <div className="panel-form">
          <h2>Agregar una transaccion</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <input
              type="number"
              placeholder="Agregar monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tipo (ingreso/gasto)"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            <textarea
              placeholder="No más de 50 caracteres"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button onClick={addTransaccion}>Agregar transacción</button>
          </div>
          <div className="balance-info">
            <h3>Balance Total: ${balance.balance !== undefined ? balance.balance.toFixed(2) : '0.00'}</h3>
            <p>Ingresos: ${balance.ingreso !== undefined ? balance.ingreso.toFixed(2) : '0.00'}</p>
            <p>Gastos: ${balance.gasto !== undefined ? balance.gasto.toFixed(2) : '0.00'}</p>
          </div>
        </div>

        <div className="panel-lista">
          <div className="filtros">
            <input
              type="text"
              placeholder="Filtrar por fecha (YYYY-MM-DD)"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por categoría"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value.toLowerCase())}
            />
          </div>

          <h2>Lista de transacciones</h2>
          <ul className="transaccion-lista">
            {transaccionesFiltradas.map((transaccion) => (
              <li key={transaccion.id} className="transaccion-item">
                <h3>{transaccion.tipo}</h3>
                <p>Monto: ${transaccion.monto}</p>
                <p>Fecha: {formatearFecha(transaccion.fecha)}</p>
                <p>Categoria: {transaccion.categoria}</p>
                {transaccion.descripcion && (
                  <p>Descripcion: {transaccion.descripcion}</p>
                )}
                <button onClick={() => deleteTransaccion(transaccion.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TodoList;