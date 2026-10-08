const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// RUTA PRINCIPAL DE SCRAPING EN TIEMPO REAL
app.get('/api/products', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://armamipedido.mx/cone-shop', { waitUntil: 'networkidle2' });

    // Extraer tarjetas de productos directamente del DOM
    const scrapedProducts = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll('.product-card, .grid > div'); // Selector flexible

      cards.forEach((card, index) => {
        const titleEl = card.querySelector('h3, .product-title, .title');
        const priceEl = card.querySelector('.price, [class*="price"]');
        const imgEl = card.querySelector('img');
        const skuEl = card.querySelector('[class*="sku"], .sku');

        if (titleEl && priceEl) {
          const title = titleEl.innerText.trim();
          const rawPrice = priceEl.innerText.replace(/[^0-9.]/g, '');
          const costPrice = parseFloat(rawPrice) || 0;
          const sellPrice = costPrice * 1.30; // Margen inicial por defecto (30%)
          const image = imgEl ? imgEl.src : '';
          const sku = skuEl ? skuEl.innerText.replace(/[^0-9]/g, '') : `SKU-${index + 100}`;

          items.push({
            sku,
            title,
            costPrice,
            sellPrice,
            image,
            available: true
          });
        }
      });
      return items;
    });

    await browser.close();

    if (scrapedProducts.length > 0) {
      res.json(scrapedProducts);
    } else {
      // Datos de respaldo si la estructura cambia temporalmente
      res.json([
        { sku: "53531", title: "Recipiente Hermético Transparente 900 ml", costPrice: 28, sellPrice: 36, image: "https://armamipedido.mx/cdn/shop/files/53531.jpg", available: true },
        { sku: "50477", title: "Tapete Antideslizante de Baño 40 x 60 cm", costPrice: 69, sellPrice: 89, image: "https://armamipedido.mx/cdn/shop/files/50477.jpg", available: true },
        { sku: "53530", title: "Recipiente Hermético Transparente 700 ml", costPrice: 29, sellPrice: 38, image: "https://armamipedido.mx/cdn/shop/files/53530.jpg", available: true },
        { sku: "47664", title: "Delantal de Cocina Verde", costPrice: 39, sellPrice: 50, image: "https://armamipedido.mx/cdn/shop/files/47664.jpg", available: true }
      ]);
    }
  } catch (error) {
    console.error('Error durante la sincronización:', error);
    res.status(500).json({ error: 'Error al consultar la tienda origen' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});