const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Productos extraídos con imágenes y precios originales de armamipedido.mx/cone-shop
const catalogProducts = [
  {
    sku: "53531",
    title: "Recipiente Hermético Transparente 900 ml",
    costPrice: 32.00,
    sellPrice: 36.00,
    image: "https://armamipedido.mx/cdn/shop/files/53531_300x300.jpg",
    available: true
  },
  {
    sku: "50477",
    title: "Tapete Antideslizante de Baño 40 x 60 cm",
    costPrice: 69.00,
    sellPrice: 89.00,
    image: "https://armamipedido.mx/cdn/shop/files/50477_300x300.jpg",
    available: true
  },
  {
    sku: "53530",
    title: "Recipiente Hermético Transparente 700 ml",
    costPrice: 29.00,
    sellPrice: 38.00,
    image: "https://armamipedido.mx/cdn/shop/files/53530_300x300.jpg",
    available: true
  },
  {
    sku: "47664",
    title: "Delantal de Cocina Verde",
    costPrice: 39.00,
    sellPrice: 50.00,
    image: "https://armamipedido.mx/cdn/shop/files/47664_300x300.jpg",
    available: true
  },
  {
    sku: "47663",
    title: "Delantal de Cocina Rojo",
    costPrice: 39.00,
    sellPrice: 50.00,
    image: "https://armamipedido.mx/cdn/shop/files/47663_300x300.jpg",
    available: true
  },
  {
    sku: "51457",
    title: "Set de Utensilios de Cocina de Silicón con Mango de Madera",
    costPrice: 170.00,
    sellPrice: 220.00,
    image: "https://armamipedido.mx/cdn/shop/files/51457_300x300.jpg",
    available: true
  },
  {
    sku: "53709",
    title: "Aromatizante con Varillas (Lavanda)",
    costPrice: 45.00,
    sellPrice: 60.00,
    image: "https://armamipedido.mx/cdn/shop/files/53709_300x300.jpg",
    available: true
  },
  {
    sku: "47738",
    title: "Termómetro Digital",
    costPrice: 33.00,
    sellPrice: 45.00,
    image: "https://armamipedido.mx/cdn/shop/files/47738_300x300.jpg",
    available: true
  }
];

app.get('/api/products', (req, res) => {
  res.json(catalogProducts);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de réplica activo en puerto ${PORT}`);
});
