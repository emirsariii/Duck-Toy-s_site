import React, { useState } from 'react';

export default function Help() {
  const [aktifSoru, setAktifSoru] = useState(null);

  const sorular = [
      { id: 1, soru: "📦 Kargom ne zaman ulaşır?", cevap: "Siparişleriniz aynı gün kargoya verilir ve genellikle 1-3 iş günü içinde adresinize teslim edilir." },
      { id: 2, soru: "💳 Hangi ödeme yöntemleri var?", cevap: "Kredi kartı, banka kartı ve güvenli 3D ödeme altyapımızla alışveriş yapabilirsiniz." },
      { id: 3, soru: "↩️ İade koşulları nelerdir?", cevap: "Ürünü teslim aldıktan sonra 14 gün içinde, paketi açılmamışsa koşulsuz iade edebilirsiniz." },
      { id: 4, soru: "🧩 Oyuncaklar güvenli mi?", cevap: "Tüm ürünlerimiz CE sertifikalıdır, çocuk sağlığına zararlı madde içermez ve testlerden geçmiştir." }
  ];

  const toggleSoru = (id) => {
      setAktifSoru(aktifSoru === id ? null : id);
  };

  return (
    <div className="page-wrapper">
        <div className="auth-container" style={{maxWidth:'800px'}}>
            <div style={{textAlign:'center', marginBottom:'30px'}}>
                <span style={{fontSize:'4rem'}}>🆘</span>
                <h1 className="auth-title">Size Nasıl Yardımcı Olabiliriz?</h1>
            </div>

            <div className="faq-container">
                {sorular.map((item) => (
                    <div key={item.id} className="faq-item sweet-box" onClick={() => toggleSoru(item.id)}>
                        <div className="faq-question">
                            <span>{item.soru}</span>
                            <span className="arrow">{aktifSoru === item.id ? '➖' : '➕'}</span>
                        </div>
                        {aktifSoru === item.id && (
                            <div className="faq-answer">
                                {item.cevap}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="sweet-box" style={{marginTop:'30px', textAlign:'center', background:'#E1F5FE'}}>
                <h3>Hala sorunuz mu var?</h3>
                <p>Bize dilediğiniz zaman ulaşabilirsiniz.</p>
                <button className="btn-full" style={{width:'auto', padding:'10px 30px', background:'#039BE5'}}>İletişime Geç 📞</button>
            </div>
        </div>
    </div>
  );
}