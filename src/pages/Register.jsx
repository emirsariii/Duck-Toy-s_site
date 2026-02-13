import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  
  // Form State'leri
  const [adSoyad, setAdSoyad] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  const handleRegister = (e) => {
      e.preventDefault();

      if(!adSoyad || !email || !sifre) {
          alert("Lütfen tüm alanları doldurun!");
          return;
      }

      // Mevcut kullanıcıları çek
      const mevcutKullanicilar = JSON.parse(localStorage.getItem('usersDB') || "[]");

      // Aynı e-posta var mı kontrol et
      const varMi = mevcutKullanicilar.find(u => u.email === email);
      if(varMi) {
          alert("Bu e-posta adresi zaten kayıtlı!");
          return;
      }

      // Yeni kullanıcıyı ekle
      const yeniKullanici = { id: Date.now(), ad: adSoyad, email, sifre };
      mevcutKullanicilar.push(yeniKullanici);

      // Veritabanına (LocalStorage) kaydet
      localStorage.setItem('usersDB', JSON.stringify(mevcutKullanicilar));

      alert("Kayıt Başarılı! 🎉 Şimdi giriş yapabilirsin.");
      navigate('/login');
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container">
            <div className="auth-icon">📝</div>
            <h2 className="auth-title">Aramıza Katıl</h2>
            <p className="auth-desc">İndirimlerden ve kampanyalardan haberdar ol.</p>
            
            <form onSubmit={handleRegister} className="sweet-form">
                <div className="input-group">
                    <label className="sweet-label">Adın Soyadın</label>
                    <input 
                        type="text" className="sweet-input" placeholder="Örn: Ali Yılmaz" 
                        value={adSoyad} onChange={e=>setAdSoyad(e.target.value)} required 
                    />
                </div>

                <div className="input-group">
                    <label className="sweet-label">E-Posta Adresi</label>
                    <input 
                        type="email" className="sweet-input" placeholder="ornek@site.com" 
                        value={email} onChange={e=>setEmail(e.target.value)} required 
                    />
                </div>
                
                <div className="input-group">
                    <label className="sweet-label">Şifre Belirle</label>
                    <input 
                        type="password" className="sweet-input" placeholder="******" 
                        value={sifre} onChange={e=>setSifre(e.target.value)} required 
                    />
                </div>

                <button type="submit" className="btn-full">Kayıt Ol ✨</button>
            </form>

            <div className="auth-footer">
                Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
            </div>
        </div>
    </div>
  );
}