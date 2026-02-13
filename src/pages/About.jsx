import React from 'react';

export default function About() {
  return (
    <div className="page-wrapper">
        <div className="auth-container" style={{maxWidth:'800px', textAlign:'left'}}>
            <div style={{textAlign:'center', marginBottom:'30px'}}>
                <span style={{fontSize:'4rem'}}>🏰</span>
                <h1 className="auth-title">Bizim Hikayemiz</h1>
                <p style={{color:'#636e72'}}>Mutlu çocuklar, yaratıcı yarınlar...</p>
            </div>

            <div className="sweet-box" style={{marginBottom:'20px', lineHeight:'1.8', color:'#555'}}>
                <h3 style={{color:'var(--primary)', fontFamily:'Fredoka'}}>Duck Toy's Nasıl Doğdu? 🧸</h3>
                <p>
                    Her şey minik bir hayalle başladı! Çocukların sadece oynamasını değil, oynarken öğrenmesini, 
                    hayal kurmasını ve yeteneklerini keşfetmesini istedik. Sıradan plastik parçalar yerine; 
                    hikayesi olan, dokusuyla güven veren ve ebeveynlerin de içini rahat ettiren oyuncaklar seçtik.
                </p>
                <p>
                    Bugün Duck Toy's, binlerce minik kalbe dokunan kocaman bir aile. Amacımız sadece oyuncak satmak değil, 
                    evinize neşe kutuları göndermek! 📦✨
                </p>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
                <div className="stat-card" style={{borderLeftColor:'#FF6B6B'}}>
                    <h1>10K+</h1>
                    <p>Mutlu Müşteri</p>
                </div>
                <div className="stat-card" style={{borderLeftColor:'#FBC02D'}}>
                    <h1>500+</h1>
                    <p>Çeşit Oyuncak</p>
                </div>
                <div className="stat-card" style={{borderLeftColor:'#00b894'}}>
                    <h1>%100</h1>
                    <p>Güvenli Ödeme</p>
                </div>
            </div>
        </div>
    </div>
  );
}