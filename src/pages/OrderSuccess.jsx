import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="page-wrapper">
        <div className="success-container">
            <span className="success-icon">🎉</span>
            <h1 className="auth-title" style={{color:'#4CAF50'}}>Siparişin Alındı!</h1>
            <p style={{fontSize:'1.1rem', color:'#555', lineHeight:'1.6'}}>
                Harika seçim! Siparişin başarıyla oluşturuldu ve en kısa sürede 
                minik sahibine ulaşmak üzere yola çıkacak. 🚚
            </p>
            
            <div style={{marginTop:'30px', background:'#E8F5E9', padding:'20px', borderRadius:'15px', display:'inline-block'}}>
                <strong>Sipariş No:</strong> #TR-{Math.floor(Math.random()*100000)}
            </div>

            <div style={{marginTop:'40px'}}>
                <Link to="/" className="btn-full" style={{display:'inline-block', width:'auto', padding:'15px 40px', textDecoration:'none'}}>
                    Alışverişe Devam Et 🏠
                </Link>
            </div>
        </div>
    </div>
  );
}