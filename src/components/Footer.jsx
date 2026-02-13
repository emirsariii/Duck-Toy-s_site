import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
        <div className="footer-container">
            
            {/* Marka */}
            <div className="footer-col brand-col">
                <div className="footer-logo">
                    <span style={{fontSize:'1.8rem'}}>🦆</span> 
                    <span style={{fontWeight:'bold', fontSize:'1.2rem', color:'#FF8E8E'}}>Duck Toy's</span>
                </div>
                <p>
                    Çocukların hayal dünyasını geliştiren, güvenli ve eğitici oyuncakların tek adresi.
                </p>
            </div>

            {/* Linkler */}
            <div className="footer-col">
                <h3>Kurumsal</h3>
                <ul>
                    <li><Link to="/">Ana Sayfa</Link></li>
                    <li><Link to="/">Hakkımızda</Link></li>
                    {/* YÖNETİCİ PANELİ LİNKİ BURAYA EKLENDİ 👇 */}
                    <li><Link to="/admin">⚙️ Yönetici Paneli</Link></li>
                    <li><Link to="/contact">İletişim</Link></li>
                </ul>
            </div>

            {/* İletişim */}
            <div className="footer-col">
                <h3>Bize Ulaşın</h3>
                <ul className="contact-list">
                    <li>📍 İstanbul, Türkiye</li>
                    <li>📧 bilgi@ducktoys.com</li>
                </ul>
            </div>
        </div>
        
        {/* En Alt Telif Kısmı */}
        <div className="footer-bottom">
            <div className="footer-bottom-content">
                <p>&copy; 2025 Duck Toy's. Tüm hakları saklıdır.</p>
                <div className="social-icons">
                    <span>📷</span> <span>📘</span> <span>🐦</span>
                </div>
            </div>
        </div>
    </footer>
  );
}