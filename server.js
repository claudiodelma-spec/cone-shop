const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Catálogo espejo sincronizado de armamipedido.mx con URLs de imágenes procesadas por servidor
const catalogProducts = [
  {
    sku: "53531",
    title: "Recipiente Hermético Transparente 900 ml",
    costPrice: 32.00,
    sellPrice: 32.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53531.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "50477",
    title: "Tapete Antideslizante de Baño 40 x 60 cm",
    costPrice: 69.00,
    sellPrice: 69.00,
    category: "Baño",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/50477.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "53530",
    title: "Recipiente Hermético Transparente 700 ml",
    costPrice: 29.00,
    sellPrice: 29.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53530.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "47664",
    title: "Delantal de Cocina Verde",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47664.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "47663",
    title: "Delantal de Cocina Rojo",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47663.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "51457",
    title: "Set de Utensilios de Cocina de Silicón con Mango de Madera",
    costPrice: 170.00,
    sellPrice: 170.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/51457.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "53709",
    title: "Aromatizante con Varillas (Lavanda)",
    costPrice: 45.00,
    sellPrice: 45.00,
    category: "Hogar",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53709.jpg&w=400&output=jpg",
    available: true
  },
  {
    sku: "47738",
    title: "Termómetro Digital",
    costPrice: 33.00,
    sellPrice: 33.00,
    category: "Hogar",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47738.jpg&w=400&output=jpg",
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
  console.log(`Servidor activo en el puerto ${PORT}`);
});
