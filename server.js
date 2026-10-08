const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get('https://armamipedido.mx/cone-shop', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const scrapedProducts = [];

    $('.product-card, [class*="product"]').each((index, element) => {
      const title = $(element).find('h3, .title, [class*="title"]').text().trim();
      const rawPrice = $(element).find('.price, [class*="price"]').text().replace(/[^0-9.]/g, '');
      const costPrice = parseFloat(rawPrice) || 0;
      const img = $(element).find('img').attr('src') \vert{}\vert{}$(element).find('img').attr('data-src') || '';
      const skuText = $(element).find('[class*="sku"]').text().replace(/[^0-9]/g, '');

      if (title && costPrice > 0) {
        scrapedProducts.push({
          sku: skuText || `SKU-${index + 100}`,
          title: title,
          costPrice: costPrice,
          sellPrice: costPrice * 1.30,
          image: img.startsWith('//') ? 'https:' + img : img,
          available: true
        });
      }
    });

    if (scrapedProducts.length > 0) {
      res.json(scrapedProducts);
    } else {
      res.json([
        { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 28, sellPrice: 36, image: "https://armamipedido.mx/cdn/shop/files/53531.jpg", available: true },
        { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69, sellPrice: 89, image: "https://armamipedido.mx/cdn/shop/files/50477.jpg", available: true },
        { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29, sellPrice: 38, image: "https://armamipedido.mx/cdn/shop/files/53530.jpg", available: true },
        { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39, sellPrice: 50, image: "https://armamipedido.mx/cdn/shop/files/47664.jpg", available: true }
      ]);
    }
  } catch (error) {
    console.error('Error en scraping:', error.message);
    res.json([
      { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 28, sellPrice: 36, image: "https://armamipedido.mx/cdn/shop/files/53531.jpg", available: true },
      { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69, sellPrice: 89, image: "https://armamipedido.mx/cdn/shop/files/50477.jpg", available: true },
      { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29, sellPrice: 38, image: "https://armamipedido.mx/cdn/shop/files/53530.jpg", available: true },
      { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39, sellPrice: 50, image: "https://armamipedido.mx/cdn/shop/files/47664.jpg", available: true }
    ]);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
