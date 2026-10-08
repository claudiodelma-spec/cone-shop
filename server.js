const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Productos extraídos del catálogo de Cone Shop
const initialProducts = [
  { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 28, sellPrice: 36, image: "https://armamipedido.mx/cdn/shop/files/53531.jpg", available: true },
  { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69, sellPrice: 89, image: "https://armamipedido.mx/cdn/shop/files/50477.jpg", available: true },
  { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29, sellPrice: 38, image: "https://armamipedido.mx/cdn/shop/files/53530.jpg", available: true },
  { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39, sellPrice: 50, image: "https://armamipedido.mx/cdn/shop/files/47664.jpg", available: true },
  { sku: "47663", title: "Delantal de Cocina Rojo", costPrice: 39, sellPrice: 50, image: "https://armamipedido.mx/cdn/shop/files/47663.jpg", available: true },
  { sku: "51457", title: "Set de Utensilios de Cocina de Silicón con Mango de Madera", costPrice: 170, sellPrice: 220, image: "https://armamipedido.mx/cdn/shop/files/51457.jpg", available: true },
  { sku: "53709", title: "Aromatizante con Varillas (Lavanda)", costPrice: 45, sellPrice: 60, image: "https://armamipedido.mx/cdn/shop/files/53709.jpg", available: true },
  { sku: "47738", title: "Termómetro Digital", costPrice: 33, sellPrice: 45, image: "https://armamipedido.mx/cdn/shop/files/47738.jpg", available: true }
];

app.get('/api/products', (req, res) => {
  res.json(initialProducts);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo y listo en el puerto ${PORT}`);
});
