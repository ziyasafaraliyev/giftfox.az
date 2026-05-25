import { useEffect, useMemo, useState } from "react";
import { defaultProducts } from "./data/defaultProducts.js";
import { useReveal } from "./hooks/useReveal.js";
import {
  adminEmail,
  fromProductRow,
  hasSupabaseConfig,
  supabase,
  toProductRow,
} from "./lib/supabase.js";

const emptyProduct = {
  name: "",
  category: "Gourmet",
  occasion: "Birthday",
  productType: "ready_box",
  price: 49,
  rating: 4.8,
  image: "",
  description: "",
  inStock: true,
};

const formatPrice = (value) => `${Number(value || 0).toFixed(2)} ₼`;

function App() {
  const [products, setProducts] = useState(defaultProducts);
  const [loadMessage, setLoadMessage] = useState("");
  const isAdminRoute = window.location.pathname === "/admin";

  const loadProducts = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadMessage("Supabase məhsul cədvəli hələ hazır deyil. Demo məhsullar göstərilir.");
      return;
    }

    setProducts(data.map(fromProductRow));
    setLoadMessage("");
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isAdminRoute) {
    return <AdminPanel products={products} onProductsChange={loadProducts} />;
  }

  return <Storefront products={products} loadMessage={loadMessage} />;
}

function Storefront({ products, loadMessage }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  useReveal([products.length, loadMessage]);
  const [checkout, setCheckout] = useState({ name: "", email: "", phone: "", note: "" });
  const [orderMessage, setOrderMessage] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.inStock);
  }, [products]);
  const readyBoxes = useMemo(() => {
    return filteredProducts.filter((product) => product.productType !== "custom_item");
  }, [filteredProducts]);
  const customItems = useMemo(() => {
    return filteredProducts.filter((product) => product.productType === "custom_item");
  }, [filteredProducts]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => {
    setCart((current) => {
      const match = current.find((item) => item.id === product.id);
      if (match) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, direction) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + direction) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const createOrder = async () => {
    if (!cart.length) {
      setOrderMessage("Səbətiniz boşdur.");
      return;
    }

    if (!checkout.name || !checkout.phone) {
      setOrderMessage("Zəhmət olmasa adınızı və telefon nömrənizi yazın.");
      return;
    }

    if (!supabase) {
      setOrderMessage("Supabase qoşulmayıb.");
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: checkout.name,
        customer_email: checkout.email,
        customer_phone: checkout.phone,
        note: checkout.note,
        total: subtotal,
        status: "new",
      })
      .select()
      .single();

    if (orderError) {
      setOrderMessage("Sifariş cədvəli hələ hazır deyil. Əvvəl Supabase SQL schema-nı run edin.");
      return;
    }

    const orderItems = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      setOrderMessage("Sifariş yaradıldı, amma məhsullar yadda saxlanmadı.");
      return;
    }

    setCart([]);
    setCheckout({ name: "", email: "", phone: "", note: "" });
    setOrderMessage("Sifariş göndərildi. Gift Fox tezliklə sizinlə əlaqə saxlayacaq.");
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Gift Fox home">
          <img className="brand__logo" src="/giftfox-logo.png" alt="" />
          <span>
            <strong>Gift Fox</strong>
            <small>Premium Babyfox Chocolates</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#shop">Hazır boxlar</a>
          <a href="#custom">Öz boxunu yığ</a>
          <a href="#reviews">Rəylər</a>
          <a href="/admin">Admin</a>
        </nav>
        <button className="cart-button" type="button" onClick={() => setIsCartOpen(true)}>
          <span aria-hidden="true">Səbət</span>
          <strong>{itemCount}</strong>
        </button>
      </header>

      <main>
        <section className="hero reveal is-visible" id="home">
          <div className="hero__media" aria-hidden="true" />
          <div className="hero__content">
            <p>
              Hazır boxlar və özün yığa biləcəyin məhsullarla sürətli, səliqəli və zövqlü hədiyyə təcrübəsi.
            </p>
            <div className="hero__actions">
              <a className="button button--secondary" href="#shop">Hazır boxlara bax</a>
              <a className="button button--secondary" href="#custom">Öz boxunu yığ</a>
            </div>
            <div className="hero__stats" aria-label="Store highlights">
              <span><strong>Gün ərzində</strong> ekspress çatdırılma</span>
              <span><strong>24/7</strong> onlayn sifariş</span>
              <span><strong>120+</strong> hazır set</span>
            </div>
          </div>
        </section>

        <section className="section intro-strip" aria-label="Gift Fox üstünlükləri">
          <article className="reveal"><strong>Səliqəli qablaşdırma</strong><span>Hər box təmiz görünüş, düzgün düzülüş və premium təqdimatla hazırlanır.</span></article>
          <article className="reveal"><strong>Şəxsi mesaj</strong><span>Mesajınızı əlavə edin, Gift Fox kartında hədiyyəyə daxil edək.</span></article>
          <article className="reveal"><strong>Rahat çatdırılma</strong><span>Eyni gün, planlı çatdırılma və pickup seçimləri mövcuddur.</span></article>
        </section>

        <section className="section shop-section reveal" id="shop">
          <div className="section-heading reveal">
            <p className="eyebrow">Hazır boxlar</p>
            <h2>Hazır seç, dərhal göndər.</h2>
            {loadMessage && <p className="notice">{loadMessage}</p>}
          </div>

          <ProductGrid
            emptyText="Hələ hazır box yoxdur. Admin paneldən Ready Box məhsulu əlavə edin."
            label="Hazır box"
            products={readyBoxes}
            onAddToCart={addToCart}
          />
        </section>

        <section className="section shop-section reveal" id="custom">
          <div className="section-heading reveal">
            <p className="eyebrow">Öz boxunu yığ</p>
            <h2>Öz kombinasiyanı yarat.</h2>
            <p>Sevdiyiniz məhsulları seçin, boxu öz zövqünüzə uyğun tamamlayın.</p>
          </div>

          <ProductGrid
            emptyText="Hələ custom box məhsulu yoxdur. Admin panədən Custom Item məhsulu əlavə edin."
            label="Box məhsulu"
            products={customItems}
            onAddToCart={addToCart}
          />
        </section>

        <section className="section reviews reveal" id="reviews">
          <div className="section-heading reveal">
            <p className="eyebrow">Müştərilər bizi sevir</p>
            <h2>Sadə proses, təsirli nəticə.</h2>
          </div>
          <div className="review-grid">
            {[
              ["Aysel R.", "Eyni gün çatdırıldı və çox səliqəli görünürdü."],
              ["Nigar M.", "Minimal, premium və şəxsi hiss verən qablaşdırma idi."],
              ["Tural A.", "Korporativ sifarişimiz sürətli və problemsiz hazırlandı."],
            ].map(([name, quote]) => (
              <article className="review-card reveal" key={name}>
                <p>"{quote}"</p>
                <strong>{name}</strong>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer className="footer">
        <strong>Gift Fox</strong>
        <span>Seçdiyiniz məhsullar gün ərzində hazırlanır və sürətli çatdırılır</span>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <a href="mailto:giftfox.az@gmail.com">giftfox.az@gmail.com</a>
          <a href="/admin" style={{ opacity: 0.7, fontSize: "0.85rem", fontWeight: "normal" }}>Admin Panel</a>
        </div>
      </footer>

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          checkout={checkout}
          orderMessage={orderMessage}
          subtotal={subtotal}
          onClose={() => setIsCartOpen(false)}
          onCheckoutChange={setCheckout}
          onCreateOrder={createOrder}
          onQuantityChange={updateQuantity}
        />
      )}
    </div>
  );
}

function ProductGrid({ emptyText, label, products, onAddToCart }) {
  if (!products.length) {
    return <p className="notice">{emptyText}</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card reveal" key={product.id}>
          <div className="product-card__image" style={{ backgroundImage: `url(${product.image})` }}>
            <span>{label}</span>
          </div>
          <div className="product-card__body">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-card__footer">
              <strong>{formatPrice(product.price)}</strong>
              <button type="button" onClick={() => onAddToCart(product)}>Səbətə əlavə et</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function CartDrawer({
  cart,
  checkout,
  orderMessage,
  subtotal,
  onCheckoutChange,
  onClose,
  onCreateOrder,
  onQuantityChange,
}) {
  return (
    <div className="cart-drawer cart-drawer--open" role="dialog" aria-modal="true" aria-label="Səbət">
      <button className="cart-drawer__backdrop" type="button" onClick={onClose} />
      <aside className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <div><span>Gift Fox</span><h2>Səbətiniz</h2></div>
          <button type="button" onClick={onClose} aria-label="Səbəti bağla">x</button>
        </div>
        {cart.length === 0 ? (
          <p className="empty-cart">Səbətiniz hələ boşdur.</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item__image" style={{ backgroundImage: `url(${item.image})` }} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => onQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onQuantityChange(item.id, 1)}>+</button>
                  </div>
                </div>
              </article>
            ))}
            <div className="checkout-mini">
              <input placeholder="Ad" value={checkout.name} onChange={(event) => onCheckoutChange({ ...checkout, name: event.target.value })} />
              <input placeholder="Telefon" value={checkout.phone} onChange={(event) => onCheckoutChange({ ...checkout, phone: event.target.value })} />
              <input placeholder="Email istəyə bağlıdır" value={checkout.email} onChange={(event) => onCheckoutChange({ ...checkout, email: event.target.value })} />
              <textarea rows="3" placeholder="Çatdırılma qeydi" value={checkout.note} onChange={(event) => onCheckoutChange({ ...checkout, note: event.target.value })} />
              {orderMessage && <p className="notice">{orderMessage}</p>}
            </div>
          </div>
        )}
        <div className="cart-summary">
          <div><span>Cəmi</span><strong>{formatPrice(subtotal)}</strong></div>
          <button className="button button--primary" type="button" onClick={onCreateOrder}>Sifariş göndər</button>
        </div>
      </aside>
    </div>
  );
}

function AdminPanel({ products, onProductsChange }) {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);

  const isAllowedAdmin = session?.user?.email === adminEmail;

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadOrders = async () => {
    if (!supabase || !isAllowedAdmin) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, [isAllowedAdmin]);

  const login = async (event) => {
    event.preventDefault();
    if (!supabase) {
      setMessage("Supabase env config tapılmadı.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password });
    setMessage(error ? error.message : "");
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    if (!supabase || !isAllowedAdmin) return;

    if (!form.image) {
      setMessage("Zəhmət olmasa məhsul şəkli seçin.");
      return;
    }

    const query = editingId
      ? supabase.from("products").update(toProductRow(form)).eq("id", editingId)
      : supabase.from("products").insert(toProductRow(form));

    const { error } = await query;

    if (error) {
      setMessage(error.message);
      return;
    }

    setForm(emptyProduct);
    setEditingId(null);
    setMessage("Məhsul yadda saxlanıldı.");
    await onProductsChange();
  };

  const editProduct = (product) => {
    setForm(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!supabase || !isAllowedAdmin) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    setMessage(error ? error.message : "Məhsul silindi.");
    await onProductsChange();
  };

  const uploadProductImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !supabase || !isAllowedAdmin) return;

    setUploading(true);
    setMessage("");

    const extension = file.name.split(".").pop();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const filePath = `${Date.now()}-${safeName || "giftfox-product"}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setForm((current) => ({ ...current, image: data.publicUrl }));
    setUploading(false);
    setMessage("Şəkil yükləndi.");
  };

  if (!hasSupabaseConfig) {
    return <AdminShell><p className="notice">Supabase bağlantısı tapılmadı.</p></AdminShell>;
  }

  if (!session) {
    return (
      <AdminShell>
        <form className="admin-login" onSubmit={login}>
          <p className="eyebrow">Admin panel</p>
          <h1>Gift Fox idarəetmə</h1>
          <p>Giriş emaili: {adminEmail}</p>
          <input type="password" placeholder="Supabase şifrəsi" value={password} onChange={(event) => setPassword(event.target.value)} />
          {message && <p className="notice">{message}</p>}
          <button className="button button--primary" type="submit">Daxil ol</button>
        </form>
      </AdminShell>
    );
  }

  if (!isAllowedAdmin) {
    return (
      <AdminShell>
        <p className="notice">Bu hesaba icazə yoxdur. Admin emaili: {adminEmail}</p>
        <button className="button button--primary" type="button" onClick={() => supabase.auth.signOut()}>Çıxış</button>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="admin-grid">
        <form className="admin-card admin-form" onSubmit={saveProduct}>
          <div>
            <p className="eyebrow">{editingId ? "Redaktə" : "Yeni məhsul"}</p>
            <h2>{editingId ? "Məhsulu yenilə" : "Məhsul əlavə et"}</h2>
          </div>
          <input placeholder="Məhsul adı" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <textarea rows="3" placeholder="Təsvir" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          <label className="file-upload">
            <span>{uploading ? "Şəkil yüklənir..." : "Məhsul şəkli seç"}</span>
            <input type="file" accept="image/*" onChange={uploadProductImage} disabled={uploading} />
          </label>
          {form.image && <img className="image-preview" src={form.image} alt="Seçilmiş məhsul" />}
          <select value={form.productType} onChange={(event) => setForm({ ...form, productType: event.target.value })}>
            <option value="ready_box">Hazır box</option>
            <option value="custom_item">Box məhsulu</option>
          </select>
          <input type="number" min="0" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          <label className="admin-check">
            <input type="checkbox" checked={form.inStock} onChange={(event) => setForm({ ...form, inStock: event.target.checked })} />
            Stokda var
          </label>
          {message && <p className="notice">{message}</p>}
          <button className="button button--primary" type="submit">{editingId ? "Dəyişiklikləri saxla" : "Məhsul əlavə et"}</button>
        </form>

        <section className="admin-card">
          <div className="admin-heading">
            <div><p className="eyebrow">Məhsullar</p><h2>Kataloq idarəsi</h2></div>
            <button type="button" onClick={() => supabase.auth.signOut()}>Çıxış</button>
          </div>
          <div className="admin-list">
            {products.map((product) => (
              <article className="admin-row" key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.productType === "custom_item" ? "Box məhsulu" : "Hazır box"} / {formatPrice(product.price)}</span>
                </div>
                <button type="button" onClick={() => editProduct(product)}>Redaktə</button>
                <button type="button" onClick={() => deleteProduct(product.id)}>Sil</button>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-card admin-orders">
        <div className="admin-heading">
          <div><p className="eyebrow">Sifarişlər</p><h2>Yeni sifarişlər</h2></div>
          <button type="button" onClick={loadOrders}>Yenilə</button>
        </div>
        {orders.length === 0 ? (
          <p className="notice">Hələ sifariş yoxdur və ya sifariş cədvəli yaradılmaiıb.</p>
        ) : (
          <div className="admin-list">
            {orders.map((order) => (
              <article className="order-row" key={order.id}>
                <strong>{order.customer_name} / {formatPrice(order.total)}</strong>
                <span>{order.customer_phone} / {order.status}</span>
                <p>{order.order_items?.map((item) => `${item.product_name} x${item.quantity}`).join(", ")}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}

function AdminShell({ children }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="/">
          <img className="brand__logo" src="/giftfox-logo.png" alt="" />
          <span><strong>Gift Fox</strong><small>Admin panel</small></span>
        </a>
        <a href="/">Sayta qayıt</a>
      </header>
      {children}
    </div>
  );
}

export default App;
