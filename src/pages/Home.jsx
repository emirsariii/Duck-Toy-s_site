import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';
import DuckGame from '../components/DuckGame';

export default function Home() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Context Bağlantısı
  const { sepeteEkle, aramaMetni, favoriler, toggleFavori } = useContext(MainContext);
  
  const navigate = useNavigate();

  // Filtre State'leri
  const [secilenKategori, setSecilenKategori] = useState("Tümü");
  const [secilenYas, setSecilenYas] = useState("Tümü");
  const [siralama, setSiralama] = useState("varsayilan");
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- SLIDER AYARLARI (DÜZELTİLEN KISIM) ---
  const slides = [
      {
          id: 1, 
          title: "Zeka Geliştiren Eğlence", 
          desc: "Çocuklarınızın hayal dünyasını genişletin!", 
          img: "/src/images/satranc.jpeg", 
          badge: "🧠 EĞİTİCİ & ÖĞRETİCİ", 
          btnText: "Koleksiyonu Keşfet 🎈",
          // Tıklayınca filtre alanına kaydırır
          action: () => { 
              document.getElementById('filter-area')?.scrollIntoView({ behavior: 'smooth' }); 
          }
      },
      {
          id: 2, 
          title: "Bu Ayın En Çok Satanları", 
          desc: "Anne ve babaların en çok tercih ettiği ürünler.", 
          img: "/src/images/ordekler.jpeg", 
          badge: "🔥 ÇOK SATANLAR", 
          btnText: "Çok Satanları Listele 🚀", 
          // Tıklayınca filtreyi 'Çok Satan' yapar ve aşağı kaydırır
          action: () => { 
              setSiralama('cok-satan'); 
              document.getElementById('filter-area')?.scrollIntoView({ behavior: 'smooth' }); 
          }
      },
      {
          id: 3, 
          title: "Müşterilerimiz Ne Diyor?", 
          desc: "Kullanıcılarımızdan tam not almış ürünler.", 
          img: "/src/images/büyükkk.jpeg", 
          badge: "💬 MÜŞTERİ FAVORİLERİ", 
          btnText: "Popüler Ürünleri Gör ⭐", 
          // Tıklayınca filtreyi 'Çok Yorum' yapar ve aşağı kaydırır
          action: () => { 
              setSiralama('cok-yorum'); 
              document.getElementById('filter-area')?.scrollIntoView({ behavior: 'smooth' }); 
          }
      }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => { const slideInterval = setInterval(nextSlide, 6000); return () => clearInterval(slideInterval); }, []);

  // Ürünleri Çek
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/urunler')
      .then(res => res.json())
      .then(data => { setUrunler(data); setLoading(false); })
      .catch(err => console.error(err));
  }, []);

  // --- FİLTRELEME MANTIĞI ---
  const filtrelenmisUrunler = urunler
    .filter(u => u.ad.toLowerCase().includes(aramaMetni.toLowerCase()))
    .filter(u => secilenKategori === "Tümü" || u.kategori === secilenKategori)
    .filter(u => secilenYas === "Tümü" || u.yas_grubu === secilenYas)
    
    // Etiket Filtreleme
    .filter(u => {
        if (siralama === "cok-satan") return u.etiket === "cok-satan";
        if (siralama === "cok-yorum") return u.etiket === "cok-yorum";
        return true;
    })

    .sort((a, b) => {
        if (siralama === "artan") return parseFloat(a.fiyat) - parseFloat(b.fiyat);
        if (siralama === "azalan") return parseFloat(b.fiyat) - parseFloat(a.fiyat);
        return 0;
    });

  const kategoriListesi = ["Tümü", ...new Set(urunler.map(u => u.kategori))];

  // Yüzen Ördekler
  const yuzenOrdekler = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
        id: i, side: i % 2 === 0 ? 'left' : 'right', top: ((Math.floor(i/2) * 15) + 5) + '%', horizontalPos: Math.random() * 30 + '%', size: Math.random() * 30 + 50 + 'px', rotation: Math.random() * 30 - 15 + 'deg', delay: Math.random() * 5 + 's'
    }));
  }, []);

  return (
    <div style={{position:'relative', overflow:'hidden'}}>
      {/* Dekoratif Ördekler */}
      <div className="side-ducks-container left-ducks">{yuzenOrdekler.filter(d => d.side === 'left').map(duck => (<img key={duck.id} src="/src/images/emoji.png" alt="" className="floating-duck" style={{ top: duck.top, left: duck.horizontalPos, width: duck.size, transform: `rotate(${duck.rotation})`, animationDelay: duck.delay }} />))}</div>
      <div className="side-ducks-container right-ducks">{yuzenOrdekler.filter(d => d.side === 'right').map(duck => (<img key={duck.id} src="/src/images/emoji.png" alt="" className="floating-duck" style={{ top: duck.top, right: duck.horizontalPos, width: duck.size, transform: `rotate(${duck.rotation})`, animationDelay: duck.delay }} />))}</div>

      <div className="page-wrapper" style={{position:'relative', zIndex:2}}>
        
        {/* SLIDER */}
        <div className="sweet-slider-container">
            {slides.map((slide, index) => (
                <div key={slide.id} className={`sweet-slide ${index === currentSlide ? 'active' : ''}`} style={{backgroundImage: `url(${slide.img})`}}>
                    <div className="slide-content blur-box">
                        <span className="slide-badge">{slide.badge}</span>
                        <h1>{slide.title}</h1>
                        <p>{slide.desc}</p>
                        {/* BUTON: slide.action fonksiyonunu çalıştırır */}
                        <button className="btn-slide" onClick={slide.action}>{slide.btnText}</button>
                    </div>
                </div>
            ))}
            <button className="slider-arrow arrow-left" onClick={prevSlide}>❮</button>
            <button className="slider-arrow arrow-right" onClick={nextSlide}>❯</button>
            <div className="slider-dots">{slides.map((_, index) => (<span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></span>))}</div>
        </div>

        {/* ÖZELLİKLER */}
        <div className="features-strip-sweet">
            <div className="feature-box fb-blue"><span className="icon">🚚</span><div><strong>Hızlı Kargo</strong><p>Aynı gün yola çıkar.</p></div></div>
            <div className="feature-box fb-yellow"><span className="icon">🛡️</span><div><strong>Güvenli Ödeme</strong><p>256-bit SSL koruması.</p></div></div>
            <div className="feature-box fb-pink"><span className="icon">↩️</span><div><strong>Kolay İade</strong><p>Mutlu müşteri garantisi.</p></div></div>
        </div>

        {/* FİLTRE ÇUBUĞU (ID: filter-area burasıdır, kaydırma buraya yapılır) */}
        <div id="filter-area" className="filter-bar sweet-filter">
            <div style={{fontWeight:'bold', fontSize:'1.2rem', color:'var(--primary)', display:'flex', alignItems:'center', gap:'10px'}}>🎁 <span style={{fontFamily:'Fredoka'}}>Oyuncakları Keşfet</span> ({filtrelenmisUrunler.length})</div>
            <div className="filter-group">
                <select className="custom-select sweet-select" value={secilenKategori} onChange={(e) => setSecilenKategori(e.target.value)}>{kategoriListesi.map((kat, i) => <option key={i} value={kat}>{kat}</option>)}</select>
                
                <select className="custom-select sweet-select" value={secilenYas} onChange={(e) => setSecilenYas(e.target.value)}>
                    <option value="Tümü">Yaş Grubu</option>
                    <option value="0-7 Yaş">0-7 Yaş</option>
                    <option value="7-14 Yaş">7-14 Yaş</option>
                    <option value="Engelli Bireyler">Özel Eğitim</option>
                    <option value="Yetişkin">👨‍👩‍👧‍👦 Yetişkin</option>
                </select>
                
                <select className="custom-select sweet-select" value={siralama} onChange={(e) => setSiralama(e.target.value)}>
                    <option value="varsayilan">Sıralama / Filtre</option>
                    <option value="artan">Fiyat: Düşükten Yükseğe</option>
                    <option value="azalan">Fiyat: Yüksekten Düşüğe</option>
                    <option value="cok-satan">🔥 Sadece Çok Satanlar</option>
                    <option value="cok-yorum">💬 Sadece Popüler Olanlar</option>
                </select>
            </div>
        </div>

        {/* ÜRÜN LİSTESİ */}
        {loading ? <div style={{textAlign:'center', padding:'50px'}}>Yükleniyor...</div> : (
            <div className="product-grid">
              {filtrelenmisUrunler.length === 0 ? (
                  <div style={{gridColumn:'span 3', textAlign:'center', padding:'40px', color:'#999'}}>
                      Seçtiğiniz kriterlere uygun ürün bulunamadı. 🦆
                  </div>
              ) : (
                  filtrelenmisUrunler.map(u => (
                      <div className="product-card sweet-card" key={u.id}>
                          
                          <button 
                              className={`fav-btn ${favoriler.some(f => f.id === u.id) ? 'active' : ''}`} 
                              onClick={(e) => {
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  toggleFavori(u); 
                              }}
                          >
                              {favoriler.some(f => f.id === u.id) ? '❤️' : '🤍'}
                          </button>
                          
                          <Link to={`/product/${u.id}`} style={{textDecoration:'none', color:'inherit'}}>
                              <div className="card-image-box sweet-img-box">
                                  {u.etiket && u.etiket !== 'Normal' && (<span style={{position:'absolute', top:10, left:10, background:'#FF8E8E', color:'white', fontSize:'0.7rem', padding:'4px 8px', borderRadius:10, fontWeight:'bold', zIndex:2}}>{u.etiket === 'cok-satan' ? '🔥 Çok Satan' : '💬 Popüler'}</span>)}
                                  <img src={u.resim_url} alt={u.ad} />
                              </div>
                          </Link>

                          <div className="product-info">
                              <span className="card-category sweet-cat">{u.kategori.toUpperCase()}</span>
                              <Link to={`/product/${u.id}`} style={{textDecoration:'none', color:'var(--dark)'}}><h3 className="card-title">{u.ad}</h3></Link>
                              <div className="card-bottom">
                                  <div className="price-box"><span className="price">{u.fiyat}</span><span className="currency">TL</span></div>
                                  <button onClick={() => sepeteEkle(u)} className="btn-add-cart sweet-add-btn">Sepete Ekle 🎁</button>
                              </div>
                          </div>
                      </div>
                  ))
              )}
            </div>
        )}
      </div>
      <DuckGame />
    </div>
  );
}