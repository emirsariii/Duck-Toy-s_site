import React, { useState } from 'react';

export default function OrderTracking() {
  const [siparisNo, setSiparisNo] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState("");

  const sorgula = (e) => {
      e.preventDefault();
      setHata("");
      setSonuc(null);

      // Sadece rakamları al
      const temizNo = siparisNo.replace(/[^0-9]/g, '');

      if(!temizNo) {
          setHata("Lütfen geçerli bir sipariş numarası girin.");
          return;
      }

      // LocalStorage'dan siparişleri çek
      const kayitliSiparisler = JSON.parse(localStorage.getItem('siparisler') || "[]");
      
      // Siparişi bul (ID number olduğu için parseInt yapıyoruz)
      const bulunan = kayitliSiparisler.find(s => s.id === parseInt(temizNo));

      if(bulunan) {
          setSonuc(bulunan);
      } else {
          setHata("Bu numaraya ait bir sipariş bulunamadı. 😔");
      }
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container" style={{maxWidth:'600px'}}>
            <div className="auth-icon" style={{fontSize:'3rem'}}>🚚</div>
            <h2 className="auth-title">Sipariş Takibi</h2>
            <p className="auth-desc">Sipariş numaranızı girerek durumunu öğrenebilirsiniz.</p>

            <form onSubmit={sorgula} className="sweet-form">
                <input 
                    type="text" 
                    className="sweet-input" 
                    placeholder="Sipariş No (Örn: 10234)" 
                    value={siparisNo}
                    onChange={(e) => setSiparisNo(e.target.value)}
                />
                <button type="submit" className="btn-full" style={{background:'#2d3436'}}>Sorgula 🔍</button>
            </form>

            {/* HATA MESAJI */}
            {hata && (
                <div style={{marginTop:'20px', color:'#e74c3c', fontWeight:'bold', background:'#ffeaa7', padding:'10px', borderRadius:'10px'}}>
                    {hata}
                </div>
            )}

            {/* SONUÇ KARTI */}
            {sonuc && (
                <div className="sweet-box" style={{marginTop:'30px', textAlign:'left', border:'2px solid var(--primary)', animation:'fadeIn 0.5s'}}>
                    <div style={{borderBottom:'1px dashed #ccc', paddingBottom:'10px', marginBottom:'10px'}}>
                        <h3 style={{margin:0, color:'var(--primary)'}}>Sipariş #{sonuc.id}</h3>
                        <small>{sonuc.tarih}</small>
                    </div>
                    
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <strong>Müşteri:</strong>
                        <span>{sonuc.musteri}</span>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                        <strong>Tutar:</strong>
                        <span>{sonuc.tutar} TL</span>
                    </div>
                    
                    <div style={{background:'#f9f9f9', padding:'10px', borderRadius:'8px', fontSize:'0.9rem', color:'#636e72', marginBottom:'15px'}}>
                        📦 {sonuc.urunler}
                    </div>

                    <div style={{textAlign:'center'}}>
                        <span className={`badge ${
                            sonuc.durum === 'Hazırlanıyor' ? 'badge-yellow' : 
                            sonuc.durum === 'Kargolandı' ? 'badge-blue' : 
                            'badge-green'
                        }`} style={{fontSize:'1rem', padding:'10px 20px'}}>
                            {sonuc.durum}
                        </span>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}