const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Crear/Conectar base de datos
const db = new sqlite3.Database('./hotel.db');

// Crear tabla de habitaciones si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS habitaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    tipo TEXT,
    precio REAL,
    disponible INTEGER
  )`);

  // Insertar datos de ejemplo solo si está vacía
  db.get("SELECT COUNT(*) as count FROM habitaciones", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO habitaciones (numero, tipo, precio, disponible) VALUES 
        ('101', 'Simple', 50, 1),
        ('102', 'Doble', 80, 1),
        ('201', 'Suite', 150, 0)`);
    }
  });
});

app.use(express.json());
app.use(express.static('public'));

// Ruta principal: mostrar habitaciones
app.get('/', (req, res) => {
  db.all("SELECT * FROM habitaciones", (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    let html = <h1>Hotel App - Habitaciones</h1><ul>;
    rows.forEach(hab => {
      html += <li>Habitación ${hab.numero} - ${hab.tipo} - $${hab.precio} - ${hab.disponible ? 'Disponible' : 'Ocupada'}</li>;
    });
    html += </ul>;
    res.send(html);
  });
});

app.listen(PORT, () => {
  console.log(Servidor corriendo en http://localhost:${PORT});
});