import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.static('public'))

// Sample product data
const products = [
  { id: 1, name: 'Kemeja Casual Putih', price: 150000, category: 'kemeja', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', description: 'Kemeja casual berbahan katun premium' },
  { id: 2, name: 'Kaos Polo Navy', price: 120000, category: 'kaos', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400', description: 'Kaos polo stylish untuk penampilan santai' },
  { id: 3, name: 'Jaket Denim Classic', price: 350000, category: 'jaket', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', description: 'Jaket denim klasik tahan lama' },
  { id: 4, name: 'Kemeja Flannel Merah', price: 180000, category: 'kemeja', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', description: 'Kemeja flannel nyaman untuk segala cuaca' },
  { id: 5, name: 'Kaos Oblong Hitam', price: 85000, category: 'kaos', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', description: 'Kaos oblong basic wajib punya' },
  { id: 6, name: 'Hoodie Grey Premium', price: 280000, category: 'hoodie', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', description: 'Hoodie premium dengan bahan tebal' },
  { id: 7, name: 'Kemeja Linen Biru', price: 200000, category: 'kemeja', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', description: 'Kemeja linen adem untuk musim panas' },
  { id: 8, name: 'Sweater Crewneck', price: 220000, category: 'sweater', image: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=400', description: 'Sweater hangat dengan desain minimalis' },
]

let cart = []
let orders = []

// Home route - Main store page
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>FashionStore - Toko Baju Online</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/" class="active">Beranda</a>
              <a href="/products">Produk</a>
              <a href="/about">Tentang</a>
              <a href="/cart" class="cart-link">🛒 Keranjang (<span id="cart-count">0</span>)</a>
            </nav>
          </div>
        </header>

        <section class="hero">
          <div class="container">
            <h2>Gaya Terbaik untuk Anda</h2>
            <p>Temukan koleksi baju terbaru dengan kualitas premium dan harga terjangkau</p>
            <a href="/products" class="btn-primary">Belanja Sekarang</a>
          </div>
        </section>

        <section class="featured">
          <div class="container">
            <h3>Produk Unggulan</h3>
            <div class="product-grid">
              ${products.slice(0, 4).map(product => `
                <div class="product-card">
                  <img src="${product.image}" alt="${product.name}" loading="lazy"/>
                  <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button class="btn-add" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="view-all">
              <a href="/products" class="btn-secondary">Lihat Semua Produk</a>
            </div>
          </div>
        </section>

        <section class="features">
          <div class="container">
            <div class="feature-item">
              <span class="icon">🚚</span>
              <h4>Pengiriman Cepat</h4>
              <p>Gratis ongkir untuk pembelian diatas Rp 500.000</p>
            </div>
            <div class="feature-item">
              <span class="icon">💳</span>
              <h4>Pembayaran Aman</h4>
              <p>Berbagai metode pembayaran tersedia</p>
            </div>
            <div class="feature-item">
              <span class="icon">↩️</span>
              <h4>Garansi Retur</h4>
              <p>Retur gratis dalam 7 hari</p>
            </div>
            <div class="feature-item">
              <span class="icon">💬</span>
              <h4>Layanan 24/7</h4>
              <p>Customer service siap membantu</p>
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
            <p>Jl. Fashion No. 123, Jakarta, Indonesia | WA: 0812-3456-7890</p>
          </div>
        </footer>

        <script>
          fetch('/api/cart/count')
            .then(r => r.json())
            .then(data => document.getElementById('cart-count').textContent = data.count);
          
          function addToCart(productId) {
            fetch('/api/cart/add', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({productId, quantity: 1})
            })
            .then(r => r.json())
            .then(data => {
              document.getElementById('cart-count').textContent = data.count;
              alert('Produk berhasil ditambahkan ke keranjang!');
            });
          }
        </script>
      </body>
    </html>
  `)
})

// Products page
app.get('/products', (req, res) => {
  const categories = ['all', ...new Set(products.map(p => p.category))]
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Produk - FashionStore</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/">Beranda</a>
              <a href="/products" class="active">Produk</a>
              <a href="/about">Tentang</a>
              <a href="/cart" class="cart-link">🛒 Keranjang (<span id="cart-count">0</span>)</a>
            </nav>
          </div>
        </header>

        <section class="page-header">
          <div class="container">
            <h1>Semua Produk</h1>
            <p>${products.length} produk tersedia</p>
          </div>
        </section>

        <section class="products-page">
          <div class="container">
            <div class="filters">
              <span>Filter:</span>
              ${categories.map(cat => `
                <button class="filter-btn ${cat === 'all' ? 'active' : ''}" 
                        onclick="filterProducts('${cat}')">${cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
              `).join('')}
            </div>
            <div class="product-grid" id="product-grid">
              ${products.map(product => `
                <div class="product-card" data-category="${product.category}">
                  <img src="${product.image}" alt="${product.name}" loading="lazy"/>
                  <div class="product-info">
                    <span class="category">${product.category}</span>
                    <h4>${product.name}</h4>
                    <p class="description">${product.description}</p>
                    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button class="btn-add" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
          </div>
        </footer>

        <script>
          fetch('/api/cart/count')
            .then(r => r.json())
            .then(data => document.getElementById('cart-count').textContent = data.count);
          
          function addToCart(productId) {
            fetch('/api/cart/add', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({productId, quantity: 1})
            })
            .then(r => r.json())
            .then(data => {
              document.getElementById('cart-count').textContent = data.count;
              alert('Produk berhasil ditambahkan ke keranjang!');
            });
          }
          
          function filterProducts(category) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            document.querySelectorAll('.product-card').forEach(card => {
              if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            });
          }
        </script>
      </body>
    </html>
  `)
})

// Cart page
app.get('/cart', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Keranjang - FashionStore</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/">Beranda</a>
              <a href="/products">Produk</a>
              <a href="/about">Tentang</a>
              <a href="/cart" class="active cart-link">🛒 Keranjang (<span id="cart-count">0</span>)</a>
            </nav>
          </div>
        </header>

        <section class="page-header">
          <div class="container">
            <h1>Keranjang Belanja</h1>
          </div>
        </section>

        <section class="cart-page">
          <div class="container">
            <div id="cart-content">Loading...</div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
          </div>
        </footer>

        <script>
          loadCart();
          
          function loadCart() {
            fetch('/api/cart')
              .then(r => r.json())
              .then(data => {
                document.getElementById('cart-count').textContent = data.totalItems;
                renderCart(data);
              });
          }
          
          function renderCart(data) {
            const container = document.getElementById('cart-content');
            if (data.items.length === 0) {
              container.innerHTML = \`
                <div class="empty-cart">
                  <p>🛒 Keranjang Anda masih kosong</p>
                  <a href="/products" class="btn-primary">Mulai Belanja</a>
                </div>
              \`;
              return;
            }
            
            container.innerHTML = \`
              <div class="cart-items">
                \${data.items.map(item => \`
                  <div class="cart-item">
                    <img src="\${item.product.image}" alt="\${item.product.name}"/>
                    <div class="item-details">
                      <h4>\${item.product.name}</h4>
                      <p class="price">Rp \${item.product.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div class="quantity-control">
                      <button onclick="updateQuantity(\${item.product.id}, \${item.quantity - 1})">-</button>
                      <span>\${item.quantity}</span>
                      <button onclick="updateQuantity(\${item.product.id}, \${item.quantity + 1})">+</button>
                    </div>
                    <p class="subtotal">Rp \${(item.product.price * item.quantity).toLocaleString('id-ID')}</p>
                    <button class="remove-btn" onclick="removeFromCart(\${item.product.id})">🗑️</button>
                  </div>
                \`).join('')}
              </div>
              <div class="cart-summary">
                <h3>Ringkasan Pesanan</h3>
                <div class="summary-row"><span>Subtotal</span><span>Rp \${data.subtotal.toLocaleString('id-ID')}</span></div>
                <div class="summary-row"><span>Ongkir</span><span>\${data.subtotal >= 500000 ? 'Gratis' : 'Rp 25.000'}</span></div>
                <div class="summary-row total"><span>Total</span><span>Rp \${data.total.toLocaleString('id-ID')}</span></div>
                <a href="/checkout" class="btn-primary checkout-btn">Lanjut ke Checkout</a>
              </div>
            \`;
          }
          
          function updateQuantity(productId, quantity) {
            if (quantity < 1) {
              removeFromCart(productId);
              return;
            }
            fetch('/api/cart/update', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({productId, quantity})
            }).then(() => loadCart());
          }
          
          function removeFromCart(productId) {
            fetch('/api/cart/remove', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({productId})
            }).then(() => loadCart());
          }
        </script>
      </body>
    </html>
  `)
})

// Checkout page
app.get('/checkout', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Checkout - FashionStore</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/">Beranda</a>
              <a href="/products">Produk</a>
              <a href="/about">Tentang</a>
              <a href="/cart" class="cart-link">🛒 Keranjang (<span id="cart-count">0</span>)</a>
            </nav>
          </div>
        </header>

        <section class="page-header">
          <div class="container">
            <h1>Checkout</h1>
          </div>
        </section>

        <section class="checkout-page">
          <div class="container">
            <div class="checkout-form">
              <h3>Informasi Pengiriman</h3>
              <form id="checkout-form">
                <div class="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" id="name" required/>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" id="email" required/>
                </div>
                <div class="form-group">
                  <label>Nomor WhatsApp</label>
                  <input type="tel" id="phone" required/>
                </div>
                <div class="form-group">
                  <label>Alamat Lengkap</label>
                  <textarea id="address" rows="3" required></textarea>
                </div>
                <div class="form-group">
                  <label>Kota</label>
                  <input type="text" id="city" required/>
                </div>
                <div class="form-group">
                  <label>Metode Pembayaran</label>
                  <select id="payment">
                    <option value="transfer">Transfer Bank</option>
                    <option value="ewallet">E-Wallet (GoPay/OVO/Dana)</option>
                    <option value="cod">COD (Bayar di Tempat)</option>
                  </select>
                </div>
                <button type="submit" class="btn-primary">Buat Pesanan</button>
              </form>
            </div>
            <div class="order-summary">
              <h3>Ringkasan Pesanan</h3>
              <div id="order-items"></div>
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
          </div>
        </footer>

        <script>
          let cartData = null;
          
          fetch('/api/cart/count')
            .then(r => r.json())
            .then(data => document.getElementById('cart-count').textContent = data.count);
          
          fetch('/api/cart')
            .then(r => r.json())
            .then(data => {
              cartData = data;
              if (data.items.length === 0) {
                window.location.href = '/products';
                return;
              }
              document.getElementById('order-items').innerHTML = \`
                \${data.items.map(item => \`
                  <div class="order-item">
                    <span>\${item.product.name} x\${item.quantity}</span>
                    <span>Rp \${(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                \`).join('')}
                <hr/>
                <div class="order-item total">
                  <span>Total</span>
                  <span>Rp \${data.total.toLocaleString('id-ID')}</span>
                </div>
              \`;
            });
          
          document.getElementById('checkout-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const orderData = {
              customer: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                payment: document.getElementById('payment').value
              },
              items: cartData.items
            };
            
            fetch('/api/orders', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(orderData)
            })
            .then(r => r.json())
            .then(data => {
              alert('Pesanan berhasil dibuat! Nomor pesanan: ' + data.orderId);
              window.location.href = '/orders/' + data.orderId;
            });
          });
        </script>
      </body>
    </html>
  `)
})

// Order confirmation page
app.get('/orders/:id', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Konfirmasi Pesanan - FashionStore</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/">Beranda</a>
              <a href="/products">Produk</a>
            </nav>
          </div>
        </header>

        <section class="order-success">
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Pesanan Berhasil!</h1>
            <p>Nomor Pesanan: <strong>#${req.params.id}</strong></p>
            <p>Terima kasih telah berbelanja di FashionStore. Kami akan segera memproses pesanan Anda.</p>
            <div class="success-actions">
              <a href="/products" class="btn-primary">Lanjutkan Belanja</a>
              <a href="/" class="btn-secondary">Kembali ke Beranda</a>
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  `)
})

// About page
app.get('/about', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Tentang Kami - FashionStore</title>
        <link rel="stylesheet" href="/style.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <header>
          <div class="container">
            <div class="logo">
              <h1>🛍️ FashionStore</h1>
            </div>
            <nav>
              <a href="/">Beranda</a>
              <a href="/products">Produk</a>
              <a href="/about" class="active">Tentang</a>
              <a href="/cart" class="cart-link">🛒 Keranjang (<span id="cart-count">0</span>)</a>
            </nav>
          </div>
        </header>

        <section class="page-header">
          <div class="container">
            <h1>Tentang FashionStore</h1>
          </div>
        </section>

        <section class="about-content">
          <div class="container">
            <div class="about-text">
              <h2>Cerita Kami</h2>
              <p>FashionStore didirikan pada tahun 2025 dengan misi menyediakan pakaian berkualitas tinggi dengan harga terjangkau untuk semua kalangan. Kami percaya bahwa setiap orang berhak tampil gaya dan percaya diri.</p>
              
              <h2>Visi Kami</h2>
              <p>Menjadi toko online fashion terpercaya nomor 1 di Indonesia yang mengutamakan kualitas produk dan kepuasan pelanggan.</p>
              
              <h2>Mengapa Memilih Kami?</h2>
              <ul>
                <li>✅ Produk berkualitas premium dengan harga terjangkau</li>
                <li>✅ Pengiriman cepat ke seluruh Indonesia</li>
                <li>✅ Garansi retur 7 hari tanpa ribet</li>
                <li>✅ Customer service responsif 24/7</li>
                <li>✅ Berbagai metode pembayaran tersedia</li>
              </ul>
              
              <h2>Hubungi Kami</h2>
              <p>📍 Alamat: Jl. Fashion No. 123, Jakarta, Indonesia</p>
              <p>📱 WhatsApp: 0812-3456-7890</p>
              <p>📧 Email: hello@fashionstore.com</p>
              <p>🕐 Jam Operasional: Senin - Minggu, 08:00 - 22:00 WIB</p>
            </div>
          </div>
        </section>

        <footer>
          <div class="container">
            <p>&copy; 2025 FashionStore. All rights reserved.</p>
          </div>
        </footer>

        <script>
          fetch('/api/cart/count')
            .then(r => r.json())
            .then(data => document.getElementById('cart-count').textContent = data.count);
        </script>
      </body>
    </html>
  `)
})

// API: Get cart
app.get('/api/cart', (req, res) => {
  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)
    return {
      product,
      quantity: item.quantity
    }
  })
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal >= 500000 ? 0 : 25000
  const total = subtotal + shipping
  
  res.json({
    items: cartItems,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    total
  })
})

// API: Get cart count
app.get('/api/cart/count', (req, res) => {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  res.json({ count })
})

// API: Add to cart
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body
  const existingItem = cart.find(item => item.productId === productId)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }
  
  const count = cart.reduce((sum, item) => sum + item.quantity, 0)
  res.json({ success: true, count })
})

// API: Update cart quantity
app.post('/api/cart/update', (req, res) => {
  const { productId, quantity } = req.body
  const item = cart.find(item => item.productId === productId)
  
  if (item) {
    item.quantity = quantity
  }
  
  res.json({ success: true })
})

// API: Remove from cart
app.post('/api/cart/remove', (req, res) => {
  const { productId } = req.body
  cart = cart.filter(item => item.productId !== productId)
  res.json({ success: true })
})

// API: Create order
app.post('/api/orders', (req, res) => {
  const { customer, items } = req.body
  const orderId = 'ORD-' + Date.now()
  
  orders.push({
    orderId,
    customer,
    items,
    status: 'pending',
    createdAt: new Date().toISOString()
  })
  
  // Clear cart after order
  cart = []
  
  res.json({ success: true, orderId })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
