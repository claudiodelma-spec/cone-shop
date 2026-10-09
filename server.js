const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/products', async (req, res) => {
  try {
    // Consulta directa al endpoint JSON completo de armamipedido.mx
    const response = await axios.get('https://armamipedido.mx/cone-shop/products.json?limit=250', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.products) {
      const fullProducts = response.data.products.map(p => {
        const variant = p.variants && p.variants[0] ? p.variants[0] : {};
        const costPrice = parseFloat(variant.price) || 0;
        
        let rawImg = p.images && p.images[0] ? p.images[0].src : (p.image ? p.image.src : '');
        if (rawImg.startsWith('//')) rawImg = 'https:' + rawImg;

        // Formato para asegurar carga directa de imágenes CDN
        const cleanImg = rawImg ? `${rawImg}${rawImg.includes('?') ? '&' : '?'}format=jpg` : '';

        let category = 'Cocina';
        const titleLower = p.title.toLowerCase();
        if (titleLower.includes('baño') || titleLower.includes('tapete') || titleLower.includes('ducha')) category = 'Baño';
        else if (titleLower.includes('aromatizante') || titleLower.includes('lámpara') || titleLower.includes('reloj') || titleLower.includes('digital')) category = 'Hogar';

        return {
          sku: variant.sku || `SKU-${p.id}`,
          title: p.title,
          costPrice: costPrice,
          sellPrice: costPrice,
          image: cleanImg,
          category: category,
          available: variant.available !== false
        };
      });

      return res.json(fullProducts);
    }
  } catch (error) {
    console.error('Error sincronizando con armamipedido.mx:', error.message);
  }

  // Respaldo de seguridad en caso de desconexión del servidor origen
  res.json([]);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
