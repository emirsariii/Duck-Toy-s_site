import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const { girisYap } = useContext(MainContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
      e.preventDefault();
      
      // Kayıtlı kullanıcıları getir
      const usersDB = JSON.parse(localStorage.getItem('usersDB') || "[]");

      // Eşleşen kullanıcıyı bul
      const kullanici = usersDB.find(u => u.email === email && u.sifre === sifre);

      if(kullanici) {
          // Sisteme GERÇEK İSİMLE giriş yap
          girisYap({
              id: kullanici.id,
              ad: kullanici.ad, // Artık "Misafir" değil, gerçek isim!
              email: kullanici.email
          });
          
          navigate('/');
      } else {
          alert("E-posta veya şifre hatalı! 🦆");
      }
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container">
            <div className="auth-icon">👋</div>
            <h2 className="auth-title">Tekrar Hoş Geldin!</h2>
            <p className="auth-desc">Hesabına giriş yap ve eğlenceye devam et.</p>
            
            <form onSubmit={handleLogin} className="sweet-form">
                <div className="input-group">
                    <label className="sweet-label">E-Posta Adresi</label>
                    <input 
                        type="email" className="sweet-input" placeholder="ornek@site.com" 
                        value={email} onChange={(e)=>setEmail(e.target.value)} 
                    />
                </div>
                
                <div className="input-group">
                    <label className="sweet-label">Şifre</label>
                    <input 
                        type="password" className="sweet-input" placeholder="******" 
                        value={sifre} onChange={(e)=>setSifre(e.target.value)} 
                    />
                </div>

                <button type="submit" className="btn-full">Giriş Yap 🚀</button>
            </form>

            <div className="auth-footer">
                Hesabın yok mu? <Link to="/register">Hemen Kayıt Ol</Link>
            </div>
        </div>
    </div>
  );
}