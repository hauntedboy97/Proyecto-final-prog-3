// App.js
import React from 'react';
import './App.css';
import TodoList from './components/common/List';

function App() {
  return (
    <div
      className="App"
      style={{
        background: 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <header className="App-header">
        <h1>Bienvenido a tu lista de Gastos</h1>
        <p>Controla tus gastos de manera sencilla y eficiente.</p>
        <p>
          ¡Esperamos que te ayude a llevar un mejor control de tus gastos y a
          tomar decisiones financieras más informadas!
        </p>
      </header>

      <TodoList />
    </div>
  );
}

export default App;
