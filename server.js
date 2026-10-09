const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let storedProducts = [];
let lastSyncTime = null;

// Función para descargar los 500+ productos recorriendo todas las páginas
async function syncFullCatalog() {
  console.log("Iniciando sincronización de catálogo completo (500+ productos)...");
  let allProducts = [];
  let page = 1;
  let keepFetching = true;

  try {
    while (keepFetching && page <= 15) {
      const url = `https://armamipedido.mx/cone-shop/products.json?limit=250&page=${page}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      if (response.data && response.data.products && response.data.products.length > 0) {
        const fetched = response.data.products.map((p, idx) => {
          const variant = p.variants && p.variants[0] ? p.variants[0] : {};
          const costPrice = parseFloat(variant.price) || 0;
          
          let rawImg = p.images && p.images[0] ? p.images[0].src : (p.image ? p.image.src : '');
          if (rawImg.startsWith('//')) rawImg = 'https:' + rawImg;

          // Conversión de URL de imagen para evitar el bloqueo de hotlinking
          const cleanImg = rawImg 
            ? `https://images.weserv.nl/?url=${encodeURIComponent(rawImg)}&w=400&output=jpg` 
            : 'https://via.placeholder.com/300?text=Sin+Imagen';

          let category = 'Cocina';
          const t = p.title.toLowerCase();
          if (t.includes('baño') || t.includes('tapete') || t.includes('jabón') || t.includes('ducha')) category = 'Baño';
          else if (t.includes('aromatizante') || t.includes('lámpara') || t.includes('reloj') || t.includes('digital') || t.includes('foco')) category = 'Hogar';

          return {
            sku: variant.sku || `SKU-${p.id || idx + 100}`,
            title: p.title,
            costPrice: costPrice,
            sellPrice: costPrice,
            image: cleanImg,
            category: category,
            available: variant.available !== false
          };
        });

        allProducts = [...allProducts, ...fetched];

        if (response.data.products.length < 250) {
          keepFetching = false;
        } else {
          page++;
        }
      } else {
        keepFetching = false;
      }
    }

    if (allProducts.length > 0) {
      storedProducts = allProducts;
      lastSyncTime = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
      console.log(`Éxito: Se obtuvieron ${storedProducts.length} productos en total.`);
    }
  } catch (err) {
    console.error("Error durante la sincronización programada:", err.message);
  }

  // Respaldo preventivo con imágenes procesadas por CDN si falla la primera conexión
  if (storedProducts.length === 0) {
    storedProducts = [
      { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 32.00, sellPrice: 32.00, category: "Cocina", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/53531.jpg&w=400" },
      { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69.00, sellPrice: 69.00, category: "Baño", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/50477.jpg&w=400" },
      { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29.00, sellPrice: 29.00, category: "Cocina", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/53530.jpg&w=400" },
      { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39.00, sellPrice: 39.00, category: "Cocina", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/47664.jpg&w=400" },
      { sku: "47663", title: "Delantal de Cocina Rojo", costPrice: 39.00, sellPrice: 39.00, category: "Cocina", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/47663.jpg&w=400" },
      { sku: "51457", title: "Set de Utensilios de Cocina de Silicón con Mango de Madera", costPrice: 170.00, sellPrice: 170.00, category: "Cocina", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/51457.jpg&w=400" },
      { sku: "53709", title: "Aromatizante con Varillas (Lavanda)", costPrice: 45.00, sellPrice: 45.00, category: "Hogar", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/53709.jpg&w=400" },
      { sku: "47738", title: "Termómetro Digital", costPrice: 33.00, sellPrice: 33.00, category: "Hogar", image: "https://images.weserv.nl/?url=https://armamipedido.mx/cdn/shop/files/47738.jpg&w=400" }
    ];
    lastSyncTime = "Inicializando catálogo...";
  }
}

// Ejecutar sincronización inicial
syncFullCatalog();

// Programar actualización automática 2 VECES AL DÍA (Cada 12 Horas)
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
setInterval(syncFullCatalog, TWELVE_HOURS);

app.get('/api/products', (req, res) => {
  res.json({
    lastSync: lastSyncTime,
    total: storedProducts.length,
    products: storedProducts
  });
});

app.post('/api/force-sync', async (req, res) => {
  await syncFullCatalog();
  res.json({ success: true, total: storedProducts.length, lastSync: lastSyncTime });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo con actualización 2 veces al día en puerto ${PORT}`);
});
