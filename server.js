const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint de sincronización en tiempo real
app.get('/api/products', async (req, res) => {
  try {
    // Consulta directa a la API JSON pública de armamipedido.mx
    const targetUrl = 'https://armamipedido.mx/cone-shop/products.json?limit=250';
    
    const response = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.products && response.data.products.length > 0) {
      const liveProducts = response.data.products.map((p, index) => {
        const variant = p.variants && p.variants[0] ? p.variants[0] : {};
        const costPrice = parseFloat(variant.price) || 0;
        
        // Obtener la URL de imagen original de armamipedido.mx CDN
        let rawImage = '';
        if (p.images && p.images.length > 0) {
          rawImage = p.images[0].src;
        } else if (p.image && p.image.src) {
          rawImage = p.image.src;
        }

        // Determinar categoría por tipo o etiquetas
        let category = 'Cocina';
        const titleLower = p.title.toLowerCase();
        if (titleLower.includes('baño') || titleLower.includes('tapete') || titleLower.includes('jabón')) {
          category = 'Baño';
        } else if (titleLower.includes('aromatizante') || titleLower.includes('foco') || titleLower.includes('lámpara') || titleLower.includes('reloj')) {
          category = 'Hogar';
        }

        return {
          sku: variant.sku || `SKU-${p.id || index + 100}`,
          title: p.title,
          costPrice: costPrice,
          sellPrice: costPrice > 0 ? costPrice * 1.30 : 0, // Margen por defecto del 30%
          image: rawImage,
          category: category,
          available: variant.available !== false
        };
      });

      return res.json(liveProducts);
    }

    throw new Error('No se encontraron productos en la respuesta JSON');

  } catch (error) {
    console.log('Fallo la consulta en vivo, utilizando backup sincronizado:', error.message);
    
    // Backup del catálogo exacto de armamipedido.mx
    res.json([
      { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 32.00, sellPrice: 36.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53531.jpg", available: true },
      { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29.00, sellPrice: 38.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53530.jpg", available: true },
      { sku: "53529", title: "Recipiente Hermético Transparente 500 ml", costPrice: 33.00, sellPrice: 42.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53529.jpg", available: true },
      { sku: "51459", title: "Set de Recipientes de Cerámica", costPrice: 141.00, sellPrice: 180.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/51459.jpg", available: true },
      { sku: "53598", title: "Brocha con Recipiente gris claro", costPrice: 25.00, sellPrice: 35.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53598.jpg", available: true },
      { sku: "52704", title: "Recipientes de Cerámica con Tapa Plástica", costPrice: 160.00, sellPrice: 200.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/52704.jpg", available: true },
      { sku: "53149", title: "Set de Recipientes de Acero de colores con Tapas Herméticas", costPrice: 99.00, sellPrice: 130.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53149.jpg", available: true },
      { sku: "53484", title: "Set de Recipientes Herméticos Redondos (3 Piezas, Blanco)", costPrice: 89.00, sellPrice: 115.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/53484.jpg", available: true },
      { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69.00, sellPrice: 89.00, category: "Baño", image: "https://armamipedido.mx/cdn/shop/files/50477.jpg", available: true },
      { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39.00, sellPrice: 50.00, category: "Cocina", image: "https://armamipedido.mx/cdn/shop/files/47664.jpg", available: true }
    ]);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de sincronización en tiempo real escuchando en puerto ${PORT}`);
});
