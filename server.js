const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Catálogo completo espejo de Cone Shop con imágenes reales optimizadas
const fullCatalog = [
  {
    sku: "53531",
    title: "Recipiente Hermético Transparente 900 ml",
    costPrice: 32.00,
    sellPrice: 32.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53531.jpg",
    available: true
  },
  {
    sku: "50477",
    title: "Tapete Antideslizante de Baño 40 x 60 cm",
    costPrice: 69.00,
    sellPrice: 69.00,
    category: "Baño",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/50477.jpg",
    available: true
  },
  {
    sku: "53530",
    title: "Recipiente Hermético Transparente 700 ml",
    costPrice: 29.00,
    sellPrice: 29.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53530.jpg",
    available: true
  },
  {
    sku: "47664",
    title: "Delantal de Cocina Verde",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47664.jpg",
    available: true
  },
  {
    sku: "47663",
    title: "Delantal de Cocina Rojo",
    costPrice: 39.00,
    sellPrice: 39.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47663.jpg",
    available: true
  },
  {
    sku: "51457",
    title: "Set de Utensilios de Cocina de Silicón con Mango de Madera",
    costPrice: 170.00,
    sellPrice: 170.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/51457.jpg",
    available: true
  },
  {
    sku: "53709",
    title: "Aromatizante con Varillas (Lavanda)",
    costPrice: 45.00,
    sellPrice: 45.00,
    category: "Hogar",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53709.jpg",
    available: true
  },
  {
    sku: "47738",
    title: "Termómetro Digital",
    costPrice: 33.00,
    sellPrice: 33.00,
    category: "Hogar",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47738.jpg",
    available: true
  },
  {
    sku: "53529",
    title: "Recipiente Hermético Transparente 500 ml",
    costPrice: 33.00,
    sellPrice: 33.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53529.jpg",
    available: true
  },
  {
    sku: "51459",
    title: "Set de Recipientes de Cerámica",
    costPrice: 141.00,
    sellPrice: 141.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/51459.jpg",
    available: true
  },
  {
    sku: "53598",
    title: "Brocha con Recipiente gris claro",
    costPrice: 25.00,
    sellPrice: 25.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53598.jpg",
    available: true
  },
  {
    sku: "52704",
    title: "Recipientes de Cerámica con Tapa Plástica",
    costPrice: 160.00,
    sellPrice: 160.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/52704.jpg",
    available: true
  },
  {
    sku: "53149",
    title: "Set de Recipientes de Acero de colores con Tapas Herméticas",
    costPrice: 99.00,
    sellPrice: 99.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53149.jpg",
    available: true
  },
  {
    sku: "53484",
    title: "Set de Recipientes Herméticos Redondos (3 Piezas, Blanco)",
    costPrice: 89.00,
    sellPrice: 89.00,
    category: "Cocina",
    image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53484.jpg",
    available: true
  }
];

app.get('/api/products', (req, res) => {
  res.json(fullCatalog);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de catálogo activo en el puerto ${PORT}`);
});
