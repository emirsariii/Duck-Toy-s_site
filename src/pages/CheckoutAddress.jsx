import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const handleAddressSubmit = (e) => {
      e.preventDefault();
      // Adres doğrulama vs. burada yapılır
      navigate('/payment');
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container" style={{maxWidth:'600px'}}>
            <div className="auth-icon" style={{fontSize:'2.5rem'}}>🏠</div>
            <h2 className="auth-title">Teslimat Adresi</h2>
            
            <form onSubmit={handleAddressSubmit} className="sweet-form">
                <div style={{display:'flex', gap:'15px'}}>
                    <div style={{flex:1}}>
                        <label className="sweet-label">Ad</label>
                        <input type="text" className="sweet-input" required />
                    </div>
                    <div style={{flex:1}}>
                        <label className="sweet-label">Soyad</label>
                        <input type="text" className="sweet-input" required />
                    </div>
                </div>

                <div>
                    <label className="sweet-label">Telefon</label>
                    <input type="tel" className="sweet-input" placeholder="05XX XXX XX XX" required />
                </div>

                <div>
                    <label className="sweet-label">Şehir</label>
                    <select className="sweet-input">
                        <option>İstanbul</option>
                        <option>Ankara</option>
                        <option>İzmir</option>
                        <option>Diğer</option>
                    </select>
                </div>

                <div>
                    <label className="sweet-label">Açık Adres</label>
                    <textarea className="sweet-input" rows="3" placeholder="Mahalle, Sokak, No..." required></textarea>
                </div>

                <button type="submit" className="btn-full">Ödemeye Geç 💳</button>
            </form>
        </div>
    </div>
  );
}