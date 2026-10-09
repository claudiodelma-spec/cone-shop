const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Catálogo con imágenes servidas desde un repositorio CDN optimizado e inmune a bloqueos
const catalogProducts = [
  {
    sku: "53531",
    title: "Recipiente Hermético Transparente 900 ml",
    costPrice: 32.00,
    sellPrice: 32.00,
    category: "Cocina",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "50477",
    title: "Tapete Antideslizante de Baño 40 x 60 cm",
    costPrice: 69.00,
    sellPrice: 69.00,
    category: "Baño",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "53530",
    title: "Recipiente Hermético Transparente 700 ml",
    costPrice: 29.00,
    sellPrice: 29.00,
    category: "Cocina",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "47664",
    title: "Delantal de Cocina Verde",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "47663",
    title: "Delantal de Cocina Rojo",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "51457",
    title: "Set de Utensilios de Cocina de Silicón con Mango de Madera",
    costPrice: 170.00,
    sellPrice: 170.00,
    category: "Cocina",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "53709",
    title: "Aromatizante con Varillas (Lavanda)",
    costPrice: 45.00,
    sellPrice: 45.00,
    category: "Hogar",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=80",
    available: true
  },
  {
    sku: "47738",
    title: "Termómetro Digital",
    costPrice: 33.00,
    sellPrice: 33.00,
    category: "Hogar",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
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
  console.log(`Servidor de catálogo activo en el puerto ${PORT}`);
});
