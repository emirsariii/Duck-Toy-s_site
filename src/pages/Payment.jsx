import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

export default function Payment() {
  const navigate = useNavigate();
  const { sepet, sepetiBosalt, user, indirimOrani } = useContext(MainContext);

  const [kartAd, setKartAd] = useState("");

  // Sadece sayı girilmesini sağlayan fonksiyon
  const onlyNumbers = (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  // Son kullanma tarihi için (AA/YY formatı için '/' işaretine izin verelim)
  const dateInput = (e) => {
      e.target.value = e.target.value.replace(/[^0-9/]/g, '');
  };

  const handlePayment = (e) => {
      e.preventDefault();

      const hamFiyat = sepet.reduce((total, urun) => total + parseFloat(urun.fiyat), 0);
      const indirimTutari = (hamFiyat * indirimOrani) / 100;
      const genelToplam = hamFiyat - indirimTutari;

      const yeniSiparis = {
          id: Math.floor(Math.random() * 90000) + 10000,
          // ÖNEMLİ: Eğer giriş yapılmışsa user.ad (Gerçek İsim), yoksa kart üzerindeki isim
          musteri: user ? user.ad : kartAd || "Misafir Müşteri",
          tutar: genelToplam.toFixed(2),
          tarih: new Date().toLocaleDateString('tr-TR'),
          durum: "Hazırlanıyor",
          urunler: sepet.map(u => u.ad).join(", ")
      };

      const eskiSiparisler = JSON.parse(localStorage.getItem('siparisler') || "[]");
      const guncelSiparisler = [yeniSiparis, ...eskiSiparisler];
      
      localStorage.setItem('siparisler', JSON.stringify(guncelSiparisler));

      setTimeout(() => {
          sepetiBosalt(); 
          navigate('/order-success');
      }, 1500);
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container" style={{maxWidth:'500px'}}>
            <div className="auth-icon" style={{fontSize:'2.5rem'}}>💳</div>
            <h2 className="auth-title">Kart Bilgileri</h2>
            
            <div className="credit-card-mockup">
                <div className="card-chip"></div>
                <div className="card-number">**** **** **** ****</div>
            </div>

            <form onSubmit={handlePayment} className="sweet-form" style={{marginTop:'20px'}}>
                <div>
                    <label className="sweet-label">Kart Üzerindeki İsim</label>
                    <input 
                        type="text" className="sweet-input" placeholder="AD SOYAD" required 
                        value={kartAd} onChange={(e)=>setKartAd(e.target.value)}
                    />
                </div>

                <div>
                    <label className="sweet-label">Kart Numarası</label>
                    <input 
                        type="text" className="sweet-input" 
                        placeholder="0000 0000 0000 0000" 
                        maxLength="19" 
                        onInput={onlyNumbers} // Sadece sayı
                        required 
                    />
                </div>

                <div style={{display:'flex', gap:'15px'}}>
                    <div style={{flex:1}}>
                        <label className="sweet-label">Son Kullanma</label>
                        <input 
                            type="text" className="sweet-input" 
                            placeholder="AA/YY" 
                            maxLength="5" 
                            onInput={dateInput} // Sayı ve / işareti
                            required 
                        />
                    </div>
                    <div style={{flex:1}}>
                        <label className="sweet-label">CVC</label>
                        <input 
                            type="text" className="sweet-input" 
                            placeholder="123" 
                            maxLength="3" 
                            onInput={onlyNumbers} // Sadece sayı
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className="btn-full" style={{background:'#27ae60'}}>
                    {sepet.length > 0 ? 'Ödemeyi Onayla ✅' : 'Sepet Boş ⚠️'}
                </button>
            </form>
        </div>
    </div>
  );
}