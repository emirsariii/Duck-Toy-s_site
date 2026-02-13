import React, { useContext, useState } from 'react';
import { MainContext } from '../context/MainContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  // Context'ten verileri çekiyoruz
  const { sepet, sepettenCikar, indirimOrani, kuponUygula } = useContext(MainContext);
  
  const [girilenKod, setGirilenKod] = useState("");
  const [mesaj, setMesaj] = useState("");

  // --- FİYAT HESAPLAMALARI ---
  // Tüm ürünlerin fiyatlarını topla
  const hamFiyat = sepet.reduce((total, urun) => total + parseFloat(urun.fiyat), 0);
  
  // İndirim tutarını hesapla
  const indirimTutari = (hamFiyat * indirimOrani) / 100;
  
  // Genel toplam
  const genelToplam = hamFiyat - indirimTutari;

  // Butona basınca çalışacak fonksiyon
  const handleKupon = () => {
      if(!kuponUygula) {
          console.error("Hata: kuponUygula fonksiyonu bulunamadı!");
          return;
      }
      const sonuc = kuponUygula(girilenKod);
      setMesaj(sonuc.mesaj);
  };

  if (sepet.length === 0) {
      return (
          <div className="page-wrapper" style={{textAlign:'center', padding:'100px'}}>
              <div style={{fontSize:'4rem'}}>🛒</div>
              <h2>Sepetin Boş 😔</h2>
              <p>Hadi minik dostlarımız için bir şeyler seçelim!</p>
              <Link to="/" className="btn-add-cart sweet-add-btn" style={{display:'inline-block', marginTop:'20px'}}>Alışverişe Başla</Link>
          </div>
      );
  }

  return (
    <div className="page-wrapper">
      <h1 style={{fontFamily:'Fredoka', color:'var(--primary)', marginBottom:'30px'}}>🛒 Sepetim ({sepet.length} Ürün)</h1>
      
      <div className="cart-container" style={{display:'flex', gap:'30px', alignItems:'flex-start', flexWrap:'wrap'}}>
          
          {/* SOL: Ürün Listesi */}
          <div className="cart-items" style={{flex:2, minWidth:'300px'}}>
              {sepet.map((urun, index) => (
                  <div key={index} className="cart-item sweet-box" style={{display:'flex', gap:'20px', padding:'15px', marginBottom:'15px', background:'white', borderRadius:'15px', border:'2px solid #eee', alignItems:'center'}}>
                      <div style={{width:'80px', height:'80px', background:'#f9f9f9', borderRadius:'10px', padding:'5px'}}>
                          <img src={urun.resim_url} alt={urun.ad} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                      </div>
                      <div style={{flex:1}}>
                          <h3 style={{margin:'0 0 5px 0', fontSize:'1.1rem'}}>{urun.ad}</h3>
                          <span style={{color:'var(--primary)', fontWeight:'bold', fontSize:'1.1rem'}}>{urun.fiyat} TL</span>
                      </div>
                      <button onClick={() => sepettenCikar(urun.id)} style={{background:'#ff7675', color:'white', border:'none', width:'35px', height:'35px', borderRadius:'50%', cursor:'pointer', fontSize:'1rem', fontWeight:'bold'}}>✕</button>
                  </div>
              ))}
          </div>

          {/* SAĞ: Özet ve Kupon */}
          <div className="cart-summary sweet-box" style={{flex:1, minWidth:'300px', background:'white', padding:'25px', borderRadius:'20px', border:'3px solid var(--duck-yellow)', position:'sticky', top:'20px'}}>
              <h3 style={{fontFamily:'Fredoka', marginTop:0}}>Sipariş Özeti</h3>
              
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#636e72'}}>
                  <span>Ara Toplam:</span>
                  <strong>{hamFiyat.toFixed(2)} TL</strong>
              </div>

              {/* İndirim Varsa Göster */}
              {indirimOrani > 0 && (
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#27ae60', background:'#E8F5E9', padding:'10px', borderRadius:'10px'}}>
                      <span>🎉 İndirim (%{indirimOrani}):</span>
                      <strong>- {indirimTutari.toFixed(2)} TL</strong>
                  </div>
              )}

              <hr style={{border:'1px dashed #ccc', margin:'15px 0'}} />
              
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', fontSize:'1.4rem'}}>
                  <span>Toplam:</span>
                  <strong style={{color:'var(--primary)'}}>{genelToplam.toFixed(2)} TL</strong>
              </div>

              {/* KUPON ALANI */}
              <div className="coupon-area" style={{marginBottom:'20px', background:'#f9f9f9', padding:'15px', borderRadius:'15px'}}>
                  <p style={{fontSize:'0.9rem', marginBottom:'8px', fontWeight:'bold', color:'#555'}}>🏷️ İndirim Kuponu:</p>
                  <div style={{display:'flex', gap:'10px'}}>
                      <input 
                        type="text" 
                        placeholder="Kod (Örn: ORDEK10)" 
                        value={girilenKod}
                        onChange={(e) => setGirilenKod(e.target.value)}
                        style={{flex:1, padding:'10px', borderRadius:'8px', border:'2px solid #ddd', outline:'none'}}
                      />
                      <button onClick={handleKupon} style={{background:'var(--dark)', color:'white', border:'none', borderRadius:'8px', padding:'0 15px', cursor:'pointer', fontWeight:'bold'}}>Uygula</button>
                  </div>
                  {/* Mesaj Gösterimi */}
                  {mesaj && (
                      <p style={{
                          fontSize:'0.85rem', 
                          color: mesaj.includes('Tebrikler') ? '#27ae60' : '#e74c3c', 
                          marginTop:'10px', 
                          fontWeight:'bold'
                      }}>
                          {mesaj}
                      </p>
                  )}
              </div>

              <Link to="/checkout" className="btn-add-cart sweet-add-btn" style={{display:'block', textAlign:'center', width:'100%', padding:'15px'}}>Ödemeye Geç 💳</Link>
          </div>
      </div>
    </div>
  );
}