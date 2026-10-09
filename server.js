const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Memoria caché local para no saturar al servidor origen
let cachedProducts = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Refrescar cada 5 minutos

// Función para obtener productos desde la API JSON nativa
async function fetchProductsFromSource() {
  const now = Date.now();
  if (cachedProducts.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    // 1. Consultar la API interna JSON de Shopify / Tiendanube que consume la página
    const response = await axios.get('https://armamipedido.mx/cone-shop/products.json?limit=250', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 8000
    });

    if (response.data && response.data.products && response.data.products.length > 0) {
      cachedProducts = response.data.products.map((p, idx) => {
        const variant = p.variants && p.variants[0] ? p.variants[0] : {};
        const costPrice = parseFloat(variant.price) || 0;
        
        let rawImg = '';
        if (p.images && p.images[0]) rawImg = p.images[0].src;
        else if (p.image && p.image.src) rawImg = p.image.src;

        if (rawImg.startsWith('//')) rawImg = 'https:' + rawImg;

        // Bypassear el bloqueo de hotlinking usando proxy CDN de imágenes
        const cleanImg = rawImg ? `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=400&output=jpg` : 'https://via.placeholder.com/300?text=Sin+Imagen';

        let category = 'Cocina';
        const titleLower = p.title.toLowerCase();
        if (titleLower.includes('baño') || titleLower.includes('tapete')) category = 'Baño';
        else if (titleLower.includes('aromatizante') || titleLower.includes('lámpara') || titleLower.includes('hogar')) category = 'Hogar';

        return {
          sku: variant.sku || `SKU-${p.id || idx + 100}`,
          title: p.title,
          costPrice: costPrice,
          sellPrice: costPrice > 0 ? costPrice * 1.30 : 0, // 30% margen inicial
          image: cleanImg,
          category: category,
          available: variant.available !== false
        };
      });

      lastFetchTime = now;
      return cachedProducts;
    }
  } catch (error) {
    console.log("Error consultando API remota, usando catálogo respaldo:", error.message);
  }

  // Backup estático en caso de desconexión momentánea de la fuente
  if (cachedProducts.length === 0) {
    const backupList = [
      { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 32.00, rawImg: "https://armamipedido.mx/cdn/shop/files/53531.jpg", category: "Cocina" },
      { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69.00, rawImg: "https://armamipedido.mx/cdn/shop/files/50477.jpg", category: "Baño" },
      { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29.00, rawImg: "https://armamipedido.mx/cdn/shop/files/53530.jpg", category: "Cocina" },
      { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39.00, rawImg: "https://armamipedido.mx/cdn/shop/files/47664.jpg", category: "Cocina" },
      { sku: "47663", title: "Delantal de Cocina Rojo", costPrice: 39.00, rawImg: "https://armamipedido.mx/cdn/shop/files/47663.jpg", category: "Cocina" },
      { sku: "51457", title: "Set de Utensilios de Cocina de Silicón", costPrice: 170.00, rawImg: "https://armamipedido.mx/cdn/shop/files/51457.jpg", category: "Cocina" },
      { sku: "53709", title: "Aromatizante con Varillas (Lavanda)", costPrice: 45.00, rawImg: "https://armamipedido.mx/cdn/shop/files/53709.jpg", category: "Hogar" },
      { sku: "47738", title: "Termómetro Digital", costPrice: 33.00, rawImg: "https://armamipedido.mx/cdn/shop/files/47738.jpg", category: "Hogar" }
    ];

    cachedProducts = backupList.map(item => ({
      sku: item.sku,
      title: item.title,
      costPrice: item.costPrice,
      sellPrice: item.costPrice * 1.30,
      image: `https://wsrv.nl/?url=${encodeURIComponent(item.rawImg)}&w=400&output=jpg`,
      category: item.category,
      available: true
    }));
  }

  return cachedProducts;
}

app.get('/api/products', async (req, res) => {
  const products = await fetchProductsFromSource();
  res.json(products);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo y escuchando en el puerto ${PORT}`);
});
