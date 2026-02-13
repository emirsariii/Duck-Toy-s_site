import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

export default function BestSellers() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sepeteEkle, favoriler = [] } = useContext(MainContext); 

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/urunler')
      .then(res => res.json())
      .then(data => {
          // --- KRİTİK NOKTA ---
          // Ana sayfadaki "Filtre > Çok Satanlar" mantığının aynısı:
          const cokSatanlar = data.filter(u => u.etiket === 'cok-satan');
          setUrunler(cokSatanlar);
          setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-wrapper">
        {/* Başlık ve Geri Dön Butonu */}
        <div style={{textAlign:'center', marginBottom:'40px', position:'relative'}}>
            <Link to="/" className="btn btn-outline" style={{position:'absolute', left:0, top:0}}>❮ Ana Sayfa</Link>
            
            <h1 style={{color:'#FF6B6B', fontFamily:'Fredoka', fontSize:'2.5rem', marginBottom:'10px'}}>
                🔥 En Çok Satanlar
            </h1>
            <p style={{color:'#636e72', fontSize:'1.1rem'}}>
                Anne ve babaların 1 numaralı tercihleri burada listeleniyor.
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
                        {/* Kalp Butonu (Favoriler Context'ten gelmeli) */}
                        {/* Not: Favori fonksiyonu burada prop olarak gelmediği için basit tuttum, istenirse eklenebilir */}
                        
                        <div className="card-image-box sweet-img-box">
                            {/* Özel Etiket */}
                            <span style={{position:'absolute', top:10, left:10, background:'#FF6B6B', color:'white', fontSize:'0.8rem', padding:'5px 12px', borderRadius:15, fontWeight:'bold', zIndex:2, boxShadow:'0 3px 0 #D32F2F'}}>
                                🏆 1 NUMARA
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