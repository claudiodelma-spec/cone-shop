const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint interno en Render para consultar la API oficial sin bloqueo CORS
app.get('/api/live-products', async (req, res) => {
  try {
    const targetUrl = 'https://armamipedido.mx/cone-shop/products.json?limit=250';
    
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000
    });

    if (response.data && response.data.products && response.data.products.length > 0) {
      const liveProducts = response.data.products.map((p, idx) => {
        const variant = p.variants && p.variants[0] ? p.variants[0] : {};
        const costPrice = parseFloat(variant.price) || 0;
        
        let rawImg = p.images && p.images[0] ? p.images[0].src : (p.image ? p.image.src : '');
        if (rawImg.startsWith('//')) rawImg = 'https:' + rawImg;

        // Bypass de bloqueo de hotlinking usando proxy CDN de imágenes
        const cleanImg = rawImg ? `https://wsrv.nl/?url=${encodeURIComponent(rawImg)}&w=400&output=jpg` : 'https://via.placeholder.com/300?text=Sin+Imagen';

        let category = 'Cocina';
        const titleLower = p.title.toLowerCase();
        if (titleLower.includes('baño') || titleLower.includes('tapete') || titleLower.includes('ducha')) category = 'Baño';
        else if (titleLower.includes('aromatizante') || titleLower.includes('foco') || titleLower.includes('lámpara') || titleLower.includes('digital')) category = 'Hogar';

        return {
          sku: variant.sku || `SKU-${p.id || idx + 100}`,
          title: p.title,
          costPrice: costPrice,
          sellPrice: costPrice,
          image: cleanImg,
          category: category
        };
      });

      return res.json({ success: true, products: liveProducts });
    }
  } catch (error) {
    console.error("Error obteniendo datos en vivo:", error.message);
  }

  // Si el servidor origen responde con bloqueo temporal, se entrega la lista base completa con imágenes activas
  res.json({
    success: false,
    products: [
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
    ]
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
