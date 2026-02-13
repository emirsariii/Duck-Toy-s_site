import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

export default function MostCommented() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sepeteEkle } = useContext(MainContext);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/urunler')
      .then(res => res.json())
      .then(data => {
          // --- KRİTİK NOKTA ---
          // Ana sayfadaki "Filtre > Çok Yorum Alanlar" mantığının aynısı:
          const populerler = data.filter(u => u.etiket === 'cok-yorum');
          setUrunler(populerler);
          setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-wrapper">
        {/* Başlık ve Geri Dön */}
        <div style={{textAlign:'center', marginBottom:'40px', position:'relative'}}>
            <Link to="/" className="btn btn-outline" style={{position:'absolute', left:0, top:0}}>❮ Ana Sayfa</Link>
            
            <h1 style={{color:'#6c5ce7', fontFamily:'Fredoka', fontSize:'2.5rem', marginBottom:'10px'}}>
                💬 Müşteri Favorileri
            </h1>
            <p style={{color:'#636e72', fontSize:'1.1rem'}}>
                En çok konuşulan, en yüksek puanlı ve bol yorumlu ürünler.
            </p>
        </div>

        {loading ? (
            <div style={{textAlign:'center', padding:'50px', color:'#b2bec3'}}>Yükleniyor...</div>
        ) : urunler.length === 0 ? (
            <div className="empty-state sweet-empty">
                <h3>Şu an bu kategoride ürün bulunamadı.</h3>
            </div>
        ) : (
            <div className="product-grid">
                {urunler.map(u => (
                    <div className="product-card sweet-card" key={u.id}>
                        <div className="card-image-box sweet-img-box">
                            <span style={{position:'absolute', top:10, left:10, background:'#6c5ce7', color:'white', fontSize:'0.8rem', padding:'5px 12px', borderRadius:15, fontWeight:'bold', zIndex:2, boxShadow:'0 3px 0 #4834d4'}}>
                                ⭐ YILDIZ ÜRÜN
                            </span>
                            <img src={u.resim_url} alt={u.ad} />
                        </div>

                        <div className="product-info">
                            <span className="card-category sweet-cat">{u.kategori}</span>
                            <h3 className="card-title">{u.ad}</h3>
                            
                            <div className="card-bottom">
                                <div className="price-box">
                                    <span className="price">{u.fiyat}</span>
                                    <span className="currency">TL</span>
                                </div>
                                <button onClick={() => sepeteEkle(u)} className="btn-add-cart sweet-add-btn">
                                    Sepete Ekle
                                </button>
                            </div>
                        </div>
                        <Link to={`/product/${u.id}`} style={{position:'absolute', top:0, left:0, width:'100%', height:'70%', zIndex:1}}></Link>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}