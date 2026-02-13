import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // YENİ: Benzer ürünleri bulmak için tüm listeyi tutalım
  const [tumUrunler, setTumUrunler] = useState([]); 

  // Context'ten favorileri çek
  const { sepeteEkle, favoriler, toggleFavori } = useContext(MainContext);

  const [adet, setAdet] = useState(1);
  
  // TAB STATE'İ
  const [aktifTab, setAktifTab] = useState('aciklama');
  
  // Yorumlar State'i
  const [yorumlar, setYorumlar] = useState([
      { id: 1, ad: "Ayşe Y.", puan: 5, metin: "Harika ürün, çok beğendik!", tarih: "2 gün önce" }
  ]);
  const [yeniYorum, setYeniYorum] = useState({ ad: "", metin: "", puan: 5 });
  const [hoverPuan, setHoverPuan] = useState(0);

  // --- PUAN ETİKETLERİ ---
  const puanEtiketleri = {
      1: "Çok Kötü 😞",
      2: "Kötü 😕",
      3: "Orta 😐",
      4: "İyi 🙂",
      5: "Mükemmel 🤩"
  };
  // -----------------------

  // Ürün Verisini Çek
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://127.0.0.1:5000/api/urunler`)
      .then(res => res.json())
      .then(data => {
          const bulunan = data.find(u => u.id === parseInt(id));
          setUrun(bulunan);
          setTumUrunler(data); // YENİ: Tüm ürünleri kaydettik
          setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  // Yorum Gönderme Fonksiyonu
  const yorumGonder = (e) => {
      e.preventDefault();
      if(!yeniYorum.ad || !yeniYorum.metin) return;
      setYorumlar([{ id: Date.now(), ...yeniYorum, tarih: "Şimdi" }, ...yorumlar]);
      setYeniYorum({ ad: "", metin: "", puan: 5 });
      setHoverPuan(0);
  };

  // YENİ: Benzer Ürünleri Filtrele (Aynı kategori, ama kendisi hariç)
  const benzerUrunler = urun 
    ? tumUrunler.filter(u => u.kategori === urun.kategori && u.id !== urun.id).slice(0, 4) 
    : [];

  if (loading) return <div style={{textAlign:'center', padding:'100px'}}>Yükleniyor...</div>;
  if (!urun) return <div style={{textAlign:'center', padding:'100px'}}>Ürün bulunamadı.</div>;

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
          <Link to="/">Ana Sayfa</Link> <span>❯</span> <span className="current">{urun.kategori}</span>
      </div>

      <div className="detail-container">
          {/* SOL TARAF: Görsel */}
          <div className="detail-left">
              <div className="detail-image-box">
                  {urun.etiket && urun.etiket !== 'Normal' && (
                      <span className="detail-badge">
                          {urun.etiket === 'cok-satan' ? '🔥 Çok Satan' : '💬 Müşteri Favorisi'}
                      </span>
                  )}
                  <img src={urun.resim_url} alt={urun.ad} />
              </div>
          </div>

          {/* SAĞ TARAF: Bilgiler */}
          <div className="detail-right">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                  <h1 className="detail-title" style={{margin:0}}>{urun.ad}</h1>
                  <button 
                      onClick={() => toggleFavori(urun)}
                      style={{
                          background: 'none', border:'none', fontSize:'2rem', cursor:'pointer',
                          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
                      }}
                  >
                      {favoriler.some(f => f.id === urun.id) ? '❤️' : '🤍'}
                  </button>
              </div>
              
              <div className="detail-rating" style={{marginTop:'10px'}}>
                  <span style={{color:'#FFD700', fontSize:'1.2rem'}}>★★★★★</span>
                  <span style={{fontSize:'0.9rem', color:'#b2bec3'}}>({yorumlar.length} Değerlendirme)</span>
              </div>

              <div className="detail-price-box">
                  <span className="detail-price">{urun.fiyat} TL</span>
                  <span className="stock-status">✅ Stokta Var</span>
              </div>

              <p className="detail-desc-short">
                  Güvenli malzemeden üretilmiştir. Aynı gün kargo avantajıyla hemen sipariş verin.
                  Detaylı bilgi için aşağıya göz atabilirsiniz. 👇
              </p>

              <div className="action-area">
                  <div className="quantity-control">
                      <button onClick={()=>{if(adet>1)setAdet(adet-1)}}>-</button>
                      <span>{adet}</span>
                      <button onClick={()=>setAdet(adet+1)}>+</button>
                  </div>
                  <button onClick={() => sepeteEkle(urun)} className="btn-add-cart sweet-add-btn big-btn">Sepete Ekle 🛒</button>
              </div>

              {/* --- YENİ EKLENEN KISIM: GÜVEN İKONLARI --- */}
              <div style={{display:'flex', gap:'15px', marginTop:'20px', padding:'15px', background:'#f0fff4', borderRadius:'10px', fontSize:'0.85rem', color:'#27ae60'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'5px'}}>🚚 <strong>Hızlı Kargo</strong></div>
                  <div style={{display:'flex', alignItems:'center', gap:'5px'}}>🛡️ <strong>Güvenli Ödeme</strong></div>
                  <div style={{display:'flex', alignItems:'center', gap:'5px'}}>↩️ <strong>Kolay İade</strong></div>
              </div>
              {/* ----------------------------------------- */}
          </div>
      </div>
      
      {/* --- ALT KISIM: SEKMELER --- */}
      <div className="detail-tabs-wrapper">
          <div className="tabs-header">
              <button 
                  className={`tab-btn ${aktifTab === 'aciklama' ? 'active' : ''}`} 
                  onClick={() => setAktifTab('aciklama')}
              >
                  📄 Ürün Açıklaması
              </button>

              <button 
                  className={`tab-btn ${aktifTab === 'yorumlar' ? 'active' : ''}`} 
                  onClick={() => setAktifTab('yorumlar')}
              >
                  💬 Yorumlar ({yorumlar.length})
              </button>
          </div>
          
          <div className="tab-content sweet-box" style={{minHeight:'300px'}}>
               
               {/* AÇIKLAMA İÇERİĞİ */}
               {aktifTab === 'aciklama' && (
                   <div className="description-content" style={{padding:'20px', lineHeight:'1.8', color:'#555', animation:'fadeIn 0.5s'}}>
                       <h3 style={{marginTop:0, color:'var(--primary)', fontFamily:'Fredoka'}}>Ürün Detayları</h3>
                       <p style={{fontSize:'1.1rem'}}>
                           {urun.aciklama ? urun.aciklama : "Bu ürün için henüz detaylı açıklama girilmemiş. Ancak Duck Toy's güvencesiyle çocuklarınız için en kaliteli malzemelerden üretildiğine emin olabilirsiniz! 🦆"}
                       </p>
                       <div style={{marginTop:'20px', padding:'15px', background:'#f9f9f9', borderRadius:'10px'}}>
                           <strong>📦 Kargo Bilgisi:</strong> Saat 15:00'a kadar verilen siparişler aynı gün kargoda.
                           <br />
                           <strong>🛡️ Garanti:</strong> Ürünlerimiz 2 yıl distribütör garantilidir.
                       </div>
                   </div>
               )}

               {/* YORUMLAR İÇERİĞİ */}
               {aktifTab === 'yorumlar' && (
                   <div className="comments-section" style={{animation:'fadeIn 0.5s'}}>
                          <div className="add-comment-box">
                              <h3>Sen de Puan Ver! ⭐</h3>
                              <form onSubmit={yorumGonder}>
                                  
                                  {/* YILDIZ VE METİN ALANI */}
                                  <div className="rating-input-container" style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                      <div className="stars-wrapper">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                              <span 
                                                key={star} 
                                                className={`animated-star ${star <= (hoverPuan || yeniYorum.puan) ? 'filled' : ''}`} 
                                                onClick={() => setYeniYorum({ ...yeniYorum, puan: star })} 
                                                onMouseEnter={() => setHoverPuan(star)} 
                                                onMouseLeave={() => setHoverPuan(0)}
                                              >★</span>
                                          ))}
                                      </div>
                                      <span style={{fontWeight:'bold', color:'var(--primary)', animation:'fadeIn 0.3s'}}>
                                          {puanEtiketleri[hoverPuan || yeniYorum.puan]}
                                      </span>
                                  </div>

                                  <input type="text" placeholder="Adınız" value={yeniYorum.ad} onChange={(e)=> setYeniYorum({...yeniYorum, ad: e.target.value})} className="sweet-input" style={{marginBottom:'10px'}}/>
                                  <textarea placeholder="Yorumunuz..." rows="3" value={yeniYorum.metin} onChange={(e)=> setYeniYorum({...yeniYorum, metin: e.target.value})} className="sweet-textarea"></textarea>
                                  <button type="submit" className="btn-add-comment">Yorumu Gönder 🚀</button>
                              </form>
                          </div>

                          <div className="comments-list">
                              {yorumlar.length === 0 ? (
                                  <p style={{textAlign:'center', color:'#999', padding:'20px'}}>Henüz yorum yapılmamış. İlk yorumu sen yap! 👇</p>
                              ) : (
                                  yorumlar.map((yorum) => (
                                      <div className="comment-item" key={yorum.id}>
                                          <div className="avatar">{yorum.ad.charAt(0)}</div>
                                          <div className="comment-content">
                                              <div className="comment-header">
                                                  <strong>{yorum.ad}</strong>
                                                  <span className="comment-stars">{"⭐".repeat(yorum.puan)}</span>
                                                  <span className="comment-date">{yorum.tarih}</span>
                                              </div>
                                              <p>{yorum.metin}</p>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                   </div>
               )}
          </div>
      </div>

      {/* --- YENİ EKLENEN KISIM: BENZER ÜRÜNLER (CROSS-SELL) --- */}
      {benzerUrunler.length > 0 && (
          <div style={{marginTop:'50px'}}>
              <h2 style={{fontFamily:'Fredoka', color:'var(--dark)', marginBottom:'20px'}}>Bunları da Sevebilirsin 🎁</h2>
              <div className="product-grid">
                  {benzerUrunler.map(u => (
                      <div className="product-card sweet-card" key={u.id} onClick={() => window.scrollTo(0,0)}>
                          <Link to={`/product/${u.id}`} style={{textDecoration:'none', color:'inherit'}}>
                              <div className="card-image-box sweet-img-box" style={{height:'150px'}}>
                                  <img src={u.resim_url} alt={u.ad} />
                              </div>
                              <div className="product-info">
                                  <span className="card-category sweet-cat" style={{fontSize:'0.6rem'}}>{u.kategori}</span>
                                  <h4 className="card-title" style={{fontSize:'0.9rem'}}>{u.ad}</h4>
                                  <div className="price-box"><span className="price">{u.fiyat} TL</span></div>
                              </div>
                          </Link>
                      </div>
                  ))}
              </div>
          </div>
      )}
      {/* -------------------------------------------------------- */}
    </div>
  );
}