const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Memoria caché para el catálogo completo
let storedProducts = [];
let lastSyncTime = null;

// Función para descargar TODO el catálogo desde la fuente
async function syncFullCatalog() {
  console.log("Iniciando sincronización programada del catálogo completo...");
  let allFetched = [];
  let page = 1;
  let hasMore = true;

  try {
    // Paginación automática para traer TODOS los productos existentes
    while (hasMore && page <= 10) {
      const targetUrl = `https://armamipedido.mx/cone-shop/products.json?limit=250&page=${page}`;
      
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: 12000
      });

      if (response.data && response.data.products && response.data.products.length > 0) {
        const pageProducts = response.data.products.map((p, idx) => {
          const variant = p.variants && p.variants[0] ? p.variants[0] : {};
          const costPrice = parseFloat(variant.price) || 0;
          
          let rawImg = p.images && p.images[0] ? p.images[0].src : (p.image ? p.image.src : '');
          if (rawImg.startsWith('//')) rawImg = 'https:' + rawImg;

          // Bypass de bloqueo hotlinking de imágenes
          const cleanImg = rawImg ? `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=500&output=jpg` : 'https://via.placeholder.com/300?text=Sin+Imagen';

          let category = 'Cocina';
          const titleLower = p.title.toLowerCase();
          if (titleLower.includes('baño') || titleLower.includes('tapete') || titleLower.includes('ducha')) category = 'Baño';
          else if (titleLower.includes('aromatizante') || titleLower.includes('lámpara') || titleLower.includes('foco') || titleLower.includes('digital') || titleLower.includes('reloj')) category = 'Hogar';

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

        allFetched = [...allFetched, ...pageProducts];
        
        if (response.data.products.length < 250) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }

    if (allFetched.length > 0) {
      storedProducts = allFetched;
      lastSyncTime = new Date().toLocaleString("es-MX");
      console.log(`Sincronización exitosa: ${storedProducts.length} productos cargados.`);
    }

  } catch (error) {
    console.error("Aviso en sincronización en segundo plano:", error.message);
  }

  // Backup completo con imágenes garantizadas si el servidor origen se encuentra bloqueado temporalmente
  if (storedProducts.length === 0) {
    storedProducts = [
      { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 32.00, sellPrice: 32.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53531.jpg" },
      { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69.00, sellPrice: 69.00, category: "Baño", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/50477.jpg" },
      { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29.00, sellPrice: 29.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53530.jpg" },
      { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39.00, sellPrice: 39.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47664.jpg" },
      { sku: "47663", title: "Delantal de Cocina Rojo", costPrice: 39.00, sellPrice: 39.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47663.jpg" },
      { sku: "51457", title: "Set de Utensilios de Cocina de Silicón con Mango de Madera", costPrice: 170.00, sellPrice: 170.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/51457.jpg" },
      { sku: "53709", title: "Aromatizante con Varillas (Lavanda)", costPrice: 45.00, sellPrice: 45.00, category: "Hogar", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53709.jpg" },
      { sku: "47738", title: "Termómetro Digital", costPrice: 33.00, sellPrice: 33.00, category: "Hogar", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/47738.jpg" },
      { sku: "53529", title: "Recipiente Hermético Transparente 500 ml", costPrice: 33.00, sellPrice: 33.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53529.jpg" },
      { sku: "51459", title: "Set de Recipientes de Cerámica", costPrice: 141.00, sellPrice: 141.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/51459.jpg" },
      { sku: "53598", title: "Brocha con Recipiente gris claro", costPrice: 25.00, sellPrice: 25.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53598.jpg" },
      { sku: "52704", title: "Recipientes de Cerámica con Tapa Plástica", costPrice: 160.00, sellPrice: 160.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/52704.jpg" },
      { sku: "53149", title: "Set de Recipientes de Acero de colores con Tapas Herméticas", costPrice: 99.00, sellPrice: 99.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53149.jpg" },
      { sku: "53484", title: "Set de Recipientes Herméticos Redondos (3 Piezas, Blanco)", costPrice: 89.00, sellPrice: 89.00, category: "Cocina", image: "https://wsrv.nl/?url=https://armamipedido.mx/cdn/shop/files/53484.jpg" }
    ];
    lastSyncTime = "Inicializado";
  }
}

// Ejecutar sincronización al iniciar el servidor
syncFullCatalog();

// Programar sincronización automática CADA 3 HORAS (3 * 60 * 60 * 1000 ms)
const THREE_HOURS = 3 * 60 * 60 * 1000;
setInterval(() => {
  syncFullCatalog();
}, THREE_HOURS);

// Endpoint API que entrega los productos acumulados
app.get('/api/products', (req, res) => {
  res.json({
    lastSync: lastSyncTime,
    total: storedProducts.length,
    products: storedProducts
  });
});

// Endpoint para forzar sincronización manual si lo requieres
app.post('/api/force-sync', async (req, res) => {
  await syncFullCatalog();
  res.json({ success: true, total: storedProducts.length, lastSync: lastSyncTime });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo con sincronización cada 3 horas escuchando en puerto ${PORT}`);
});
