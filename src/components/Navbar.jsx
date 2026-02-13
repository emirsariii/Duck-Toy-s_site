import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../context/MainContext';

const Logo = () => (
  <img src="/src/images/logo.png" alt="Duck Toy's" className="site-logo" />
);

export default function Navbar() {
  const { user, sepet, favoriler, toggleFavori, cikisYap, aramaMetni, setAramaMetni } = useContext(MainContext);

  return (
    <header>
      <div className="top-header">
        <div className="page-wrapper" style={{padding: '0 20px', display:'flex', margin:'0 auto', maxWidth:'1200px'}}>
            <div style={{flex:1}}></div>
            <div className="top-links">
                <Link to="/about">ℹ️ Hakkımızda</Link>
                <Link to="/help">❓ Yardım</Link>
                <Link to="/track-order">📦 Sipariş Takibi</Link>
            </div>
        </div>
      </div>

      <div className="main-navbar-wrapper">
        <div className="navbar">
            <Link to="/" className="logo-link">
                <Logo />
                <div className="brand-container"> 
                    <span className="brand-name">Duck Toy's</span>
                    <span className="brand-slogan">Zeka Geliştiren Eğlence 🧠</span>
                </div>
            </Link>

            <div className="search-container">
                <input 
                    type="text" className="search-input" placeholder="Oyuncak ara..." 
                    value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)}
                />
            </div>

            <nav className="nav-links">
                <Link to="/cart" className="btn-cart">
                    🛒 Sepetim <span className="cart-badge">{sepet.length}</span>
                </Link>

                {user ? (
                    <div className="user-menu-container">
                        {/* İsim Alanı (Admin linki yok) */}
                        <div className="user-name-box">
                            👋 {user.ad.split(' ')[0]} ▾
                        </div>

                        {/* Açılır Favori Menüsü */}
                        <div className="hover-dropdown">
                            <div className="dropdown-header">Favorilerim ({favoriler.length})</div>
                            
                            <div className="fav-list-mini">
                                {favoriler.length === 0 ? (
                                    <p style={{fontSize:'0.8rem', color:'#999', padding:'10px', textAlign:'center'}}>Henüz favorin yok.</p>
                                ) : (
                                    favoriler.map(fav => (
                                        <div key={fav.id} className="fav-item-mini">
                                            <img src={fav.resim_url} alt="" />
                                            <div className="fav-info">
                                                <span>{fav.ad}</span>
                                                <small>{fav.fiyat} TL</small>
                                            </div>
                                            <button onClick={() => toggleFavori(fav)} className="btn-remove-fav">✕</button>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button onClick={cikisYap} className="dropdown-logout">Çıkış Yap 🚪</button>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="btn-login">Giriş Yap</Link>
                )}
            </nav>
        </div>
      </div>
    </header>
  );
}