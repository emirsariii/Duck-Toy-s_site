import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isLogged, setIsLogged] = useState(localStorage.getItem('adminGiris') === '1');
  const [activeTab, setActiveTab] = useState('dash'); 
  
  // İstatistikler
  const [stats, setStats] = useState({ urun:0, kat:0, user:0, yorum:0, siparis: 0 });
  
  // Veri State'leri
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]); // Kullanıcılar artık LocalStorage'dan gelecek
  const [yorumlar, setYorumlar] = useState([]);

  // SİPARİŞLER (LocalStorage'dan çekiliyor)
  const [siparisler, setSiparisler] = useState(() => {
      const kayitli = localStorage.getItem('siparisler');
      return kayitli ? JSON.parse(kayitli) : [];
  });
  
  // Form ve Giriş State'leri
  const [kadi, setKadi] = useState('');
  const [sifre, setSifre] = useState('');
  const [yeniKat, setYeniKat] = useState('');
  const [ara, setAra] = useState('');

  // Düzenleme Modu
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [duzenlenecekId, setDuzenlenecekId] = useState(null);
  
  const [yeniUrun, setYeniUrun] = useState({
      ad:'', kategori:'', yas_grubu:'', etiket:'Normal', resim_url:'', 
      fiyat:'', stok:'', aciklama:''
  });

  // --- VERİLERİ ÇEKME FONKSİYONU ---
  const veriGetir = async () => {
      try {
        // 1. Ürünleri API'den çek
        const resU = await fetch('http://127.0.0.1:5000/api/urunler');
        const dataU = await resU.json();
        setUrunler(dataU);

        // 2. Kategorileri API'den çek
        const resK = await fetch('http://127.0.0.1:5000/api/kategoriler');
        const dataK = await resK.json();
        setKategoriler(dataK);
        
        // 3. Yorumları API'den çek
        const resY = await fetch('http://127.0.0.1:5000/api/admin/yorumlar');
        const dataY = await resY.json();
        setYorumlar(dataY);

        // 4. KULLANICILARI LOCALSTORAGE'DAN ÇEK (DÜZELTİLEN KISIM)
        // Artık API yerine 'usersDB' anahtarına bakıyoruz
        const kayitliKullanicilar = JSON.parse(localStorage.getItem('usersDB') || "[]");
        setKullanicilar(kayitliKullanicilar);

        // İstatistikleri Güncelle
        setStats({ 
            urun: dataU.length, 
            kat: dataK.length, 
            user: kayitliKullanicilar.length, // LocalStorage sayısı
            yorum: dataY.length,
            siparis: siparisler.length 
        });

      } catch (err) { console.error(err); }
  };

  useEffect(() => { if(isLogged) veriGetir(); }, [isLogged]);

  // --- SİPARİŞ YÖNETİMİ ---
  const siparisDurumDegistir = (id) => {
      const yeniSiparisler = siparisler.map(s => {
          if(s.id === id) {
              if(s.durum === "Hazırlanıyor") return { ...s, durum: "Kargolandı" };
              if(s.durum === "Kargolandı") return { ...s, durum: "Teslim Edildi" };
              return s;
          }
          return s;
      });
      setSiparisler(yeniSiparisler);
      localStorage.setItem('siparisler', JSON.stringify(yeniSiparisler)); 
      alert(`Sipariş #${id} durumu güncellendi! ✅`);
  };

  // --- ADMIN GİRİŞİ ---
  const adminLogin = async () => {
      try {
          const response = await fetch('http://127.0.0.1:5000/api/admin/login', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ kadi, sifre }) 
          });
          const data = await response.json();
          if (data.durum === 'basarili') {
              localStorage.setItem('adminGiris', '1');
              setIsLogged(true);
          } else { alert(data.mesaj); }
      } catch (error) { alert("Sunucu hatası"); }
  };

  // --- SİLME İŞLEMLERİ ---
  const urunSil = async (id) => {
      if(window.confirm("Ürün silinsin mi?")) {
          await fetch(`http://127.0.0.1:5000/api/admin/sil/${id}`, {method:'DELETE'});
          veriGetir();
      }
  };
  const katSil = async (id) => {
      if(window.confirm("Kategori silinsin mi?")) {
          await fetch(`http://127.0.0.1:5000/api/admin/kategori-sil/${id}`, {method:'DELETE'});
          veriGetir();
      }
  };
  
  // KULLANICI SİLME (LOCALSTORAGE GÜNCELLEME)
  const kullaniciSil = (id) => {
      if(window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
          // Listeden çıkar
          const yeniKullanicilar = kullanicilar.filter(u => u.id !== id);
          // State güncelle
          setKullanicilar(yeniKullanicilar);
          // Hafızayı güncelle
          localStorage.setItem('usersDB', JSON.stringify(yeniKullanicilar));
          // İstatistiği güncelle
          setStats(prev => ({ ...prev, user: yeniKullanicilar.length }));
      }
  };

  const yorumSil = async (id) => {
      if(window.confirm("Bu yorum kaldırılsın mı?")) {
          await fetch(`http://127.0.0.1:5000/api/admin/yorum-sil/${id}`, {method:'DELETE'});
          veriGetir();
      }
  };

  // --- EKLEME / GÜNCELLEME ---
  const urunIslemi = async () => {
      if(!yeniUrun.ad || !yeniUrun.kategori || !yeniUrun.fiyat || !yeniUrun.yas_grubu) return alert("Eksik bilgi!");
      const endpoint = duzenlemeModu ? `http://127.0.0.1:5000/api/admin/guncelle/${duzenlenecekId}` : 'http://127.0.0.1:5000/api/admin/ekle';
      const method = duzenlemeModu ? 'PUT' : 'POST';
      await fetch(endpoint, { method: method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(yeniUrun) });
      alert(duzenlemeModu ? "Güncellendi!" : "Eklendi!");
      setYeniUrun({ad:'', kategori:'', yas_grubu:'', etiket:'Normal', resim_url:'', fiyat:'', stok:'', aciklama:''});
      setDuzenlemeModu(false);
      veriGetir();
  };
  const urunDuzenle = (urun) => {
      setYeniUrun({ ...urun, etiket: urun.etiket || 'Normal' });
      setDuzenlemeModu(true);
      setDuzenlenecekId(urun.id);
      window.scrollTo(0, 0);
  };
  const katEkle = async () => {
      if(!yeniKat) return alert("Kategori adı girin.");
      await fetch('http://127.0.0.1:5000/api/admin/kategori-ekle', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ad: yeniKat }) });
      setYeniKat('');
      veriGetir();
  };

  // --- GİRİŞ EKRANI ---
  if(!isLogged) {
      return (
          <div className="page-wrapper" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'70vh'}}>
              <div className="auth-container">
                  <div style={{fontSize:'3rem', marginBottom:'10px'}}>🔐</div>
                  <h2 className="auth-title">Yönetici Girişi</h2>
                  <div className="sweet-form">
                      <input className="sweet-input" placeholder="Kullanıcı Adı" onChange={e=>setKadi(e.target.value)}/>
                      <input className="sweet-input" type="password" placeholder="Şifre" onChange={e=>setSifre(e.target.value)}/>
                      <button className="btn-full" onClick={adminLogin}>Panele Gir 🚀</button>
                  </div>
              </div>
          </div>
      );
  }

  // --- PANEL ---
  return (
    <div className="page-wrapper" style={{display:'flex', gap:'30px', alignItems:'start'}}>
        
        {/* SIDEBAR (SOL MENÜ) */}
        <div className="admin-sidebar sweet-box">
            <h3 style={{textAlign:'center', borderBottom:'2px solid #FFFDE7', paddingBottom:'15px', marginTop:0, color:'var(--primary)', fontFamily:'Fredoka'}}>🛠️ Admin Paneli</h3>
            
            <ul style={{listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:'10px'}}>
                <li onClick={()=>setActiveTab('dash')} className={`sidebar-item ${activeTab==='dash'?'active':''}`}>📊 İstatistikler</li>
                <li onClick={()=>setActiveTab('siparis')} className={`sidebar-item ${activeTab==='siparis'?'active':''}`}>🛒 Siparişler</li>
                <li onClick={()=>setActiveTab('urun')} className={`sidebar-item ${activeTab==='urun'?'active':''}`}>📦 Ürün Yönetimi</li>
                <li onClick={()=>setActiveTab('kat')} className={`sidebar-item ${activeTab==='kat'?'active':''}`}>📂 Kategoriler</li>
                <li onClick={()=>setActiveTab('yorum')} className={`sidebar-item ${activeTab==='yorum'?'active':''}`}>💬 Yorumlar</li>
                <li onClick={()=>setActiveTab('user')} className={`sidebar-item ${activeTab==='user'?'active':''}`}>👥 Kullanıcılar</li>
            </ul>

            <div style={{marginTop:'auto', paddingTop:'30px', display:'flex', flexDirection:'column', gap:'10px'}}>
                <Link to="/" className="btn-sidebar-link">🏠 Siteye Dön</Link>
                <button onClick={()=>{localStorage.removeItem('adminGiris'); setIsLogged(false);}} className="btn-sidebar-logout">Çıkış Yap 🚪</button>
            </div>
        </div>

        {/* CONTENT (SAĞ İÇERİK) */}
        <div style={{flex:1, width:'100%'}}>
            
            {/* --- DASHBOARD --- */}
            {activeTab === 'dash' && (
                <div>
                    <h2 style={{marginTop:0, color:'var(--dark)', fontFamily:'Fredoka'}}>Hoşgeldin, Admin 👋</h2>
                    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'20px', marginTop:'30px'}}>
                        <div className="stat-card" style={{borderLeftColor:'#e17055'}}><h1 style={{color:'#e17055'}}>{siparisler.length}</h1><p>Sipariş</p></div>
                        <div className="stat-card" style={{borderLeftColor:'#6c5ce7'}}><h1 style={{color:'#6c5ce7'}}>{stats.urun}</h1><p>Ürün</p></div>
                        <div className="stat-card" style={{borderLeftColor:'#00b894'}}><h1 style={{color:'#00b894'}}>{stats.kat}</h1><p>Kategori</p></div>
                        <div className="stat-card" style={{borderLeftColor:'#0984e3'}}><h1 style={{color:'#0984e3'}}>{stats.user}</h1><p>Üye</p></div>
                    </div>
                </div>
            )}

            {/* --- SİPARİŞ YÖNETİMİ --- */}
            {activeTab === 'siparis' && (
                <div className="sweet-box">
                    <h3 style={{marginTop:0, fontFamily:'Fredoka', color:'#e17055'}}>🛒 Gelen Siparişler</h3>
                    {siparisler.length === 0 ? (
                        <p style={{color:'#999', padding:'20px', textAlign:'center'}}>Henüz sipariş yok.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="sweet-table">
                                <thead><tr><th>No</th><th>Müşteri</th><th>Ürünler</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th>İşlem</th></tr></thead>
                                <tbody>
                                    {siparisler.map(s => (
                                        <tr key={s.id}>
                                            <td style={{fontWeight:'bold'}}>#{s.id}</td>
                                            <td>{s.musteri}</td>
                                            <td style={{fontSize:'0.9rem', color:'#636e72', maxWidth:'200px'}}>{s.urunler}</td>
                                            <td style={{fontWeight:'bold', color:'var(--primary)'}}>{s.tutar} TL</td>
                                            <td>
                                                <span className={`badge ${
                                                    s.durum === 'Hazırlanıyor' ? 'badge-yellow' : 
                                                    s.durum === 'Kargolandı' ? 'badge-blue' : 
                                                    'badge-green'
                                                }`}>
                                                    {s.durum}
                                                </span>
                                            </td>
                                            <td style={{fontSize:'0.8rem'}}>{s.tarih}</td>
                                            <td>
                                                <button 
                                                    onClick={() => siparisDurumDegistir(s.id)}
                                                    className="btn" 
                                                    style={{background:'#f1f2f6', border:'1px solid #ccc', padding:'5px 10px', fontSize:'0.8rem', cursor:'pointer', borderRadius:'8px'}}
                                                >
                                                    Durum Değiştir 🔄
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* --- ÜRÜN YÖNETİMİ --- */}
            {activeTab === 'urun' && (
                <div>
                    <h2 style={{marginTop:0, color:'var(--dark)', fontFamily:'Fredoka'}}>Ürün Yönetimi</h2>
                    
                    {/* Ürün Ekleme Formu */}
                    <div className="sweet-box" style={{marginBottom:'30px', border: duzenlemeModu ? '3px solid #FFD700' : 'none'}}>
                        <h3 style={{marginTop:0, color: duzenlemeModu ? '#FBC02D' : 'var(--primary)', fontFamily:'Fredoka'}}>
                            {duzenlemeModu ? '✏️ Ürünü Düzenle' : '➕ Yeni Ürün Ekle'}
                        </h3>
                        <div className="form-grid">
                            <input className="sweet-input" placeholder="Ürün Adı" value={yeniUrun.ad} onChange={e=>setYeniUrun({...yeniUrun, ad:e.target.value})}/>
                            <select className="sweet-input" value={yeniUrun.kategori} onChange={e=>setYeniUrun({...yeniUrun, kategori:e.target.value})}><option value="">Kategori Seç...</option>{kategoriler.map(k => <option key={k.id} value={k.ad}>{k.ad}</option>)}</select>
                            
                            <select className="sweet-input" value={yeniUrun.yas_grubu} onChange={e=>setYeniUrun({...yeniUrun, yas_grubu:e.target.value})}><option value="">Yaş Grubu...</option><option value="0-7 Yaş">👶 0-7 Yaş</option><option value="7-14 Yaş">👦 7-14 Yaş</option><option value="Özel Bireyler">♿ Özel Eğitim</option><option value="Yetişkin">👨‍👩‍👧‍👦 Yetişkin</option></select>
                            <select className="sweet-input" value={yeniUrun.etiket} onChange={e=>setYeniUrun({...yeniUrun, etiket:e.target.value})}><option value="Normal">Etiket: Normal</option><option value="cok-satan">🔥 Çok Satan</option><option value="cok-yorum">💬 Popüler</option></select>
                            
                            <input type="number" className="sweet-input" placeholder="Fiyat (TL)" value={yeniUrun.fiyat} onChange={e=>setYeniUrun({...yeniUrun, fiyat:e.target.value})}/>
                            <input type="number" className="sweet-input" placeholder="Stok" value={yeniUrun.stok} onChange={e=>setYeniUrun({...yeniUrun, stok:e.target.value})}/>
                        </div>
                        
                        <input className="sweet-input" placeholder="Resim URL" value={yeniUrun.resim_url} onChange={e=>setYeniUrun({...yeniUrun, resim_url:e.target.value})} style={{marginTop:'15px'}}/>
                        <textarea className="sweet-input" rows="3" placeholder="Açıklama..." value={yeniUrun.aciklama} onChange={e=>setYeniUrun({...yeniUrun, aciklama:e.target.value})} style={{marginTop:'15px', resize:'vertical'}} />
                        
                        <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
                            <button className="btn-full" onClick={urunIslemi} style={{background: duzenlemeModu ? '#FBC02D' : 'var(--primary)'}}>
                                {duzenlemeModu ? 'Değişiklikleri Kaydet ✅' : 'Ürünü Ekle ✨'}
                            </button>
                            {duzenlemeModu && <button className="btn-full" onClick={()=>{setDuzenlemeModu(false); setYeniUrun({ad:'', kategori:'', yas_grubu:'', etiket:'Normal', resim_url:'', fiyat:'', stok:'', aciklama:''});}} style={{background:'#b2bec3'}}>İptal</button>}
                        </div>
                    </div>

                    <h3 style={{fontFamily:'Fredoka', color:'var(--dark)'}}>Mevcut Ürünler</h3>
                    <input className="sweet-input" placeholder="🔍 Ürünlerde Ara..." onChange={e=>setAra(e.target.value)} style={{marginBottom:'20px', maxWidth:'400px'}}/>
                    
                    <div className="sweet-box table-wrapper">
                        <table className="sweet-table">
                            <thead><tr><th>Görsel</th><th>Ürün</th><th>Etiket</th><th>Fiyat</th><th style={{textAlign:'right'}}>İşlemler</th></tr></thead>
                            <tbody>
                                {urunler.filter(u => u.ad.toLowerCase().includes(ara.toLowerCase())).map(u => (
                                    <tr key={u.id}>
                                        <td><img src={u.resim_url} width="50" height="50" style={{objectFit:'contain', borderRadius:'10px', border:'1px solid #eee'}} alt=""/></td>
                                        <td><strong>{u.ad}</strong><br/><span style={{fontSize:'0.8rem', color:'#636e72'}}>{u.kategori}</span></td>
                                        <td>
                                            <span className={`badge ${u.etiket==='cok-satan' ? 'badge-fire' : u.etiket==='cok-yorum' ? 'badge-pop' : 'badge-gray'}`}>
                                                {u.etiket === 'cok-satan' ? '🔥 Çok Satan' : u.etiket === 'cok-yorum' ? '💬 Popüler' : 'Normal'}
                                            </span>
                                        </td>
                                        <td style={{color:'var(--primary)', fontWeight:'bold'}}>{u.fiyat} TL</td>
                                        <td style={{textAlign:'right'}}>
                                            <button className="action-btn edit-btn" onClick={()=>urunDuzenle(u)}>✏️</button>
                                            <button className="action-btn delete-btn" onClick={()=>urunSil(u.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- YORUM YÖNETİMİ --- */}
            {activeTab === 'yorum' && (
                <div className="sweet-box">
                    <h3 style={{marginTop:0, fontFamily:'Fredoka', color:'#FBC02D'}}>💬 Tüm Yorumlar</h3>
                    <div className="table-wrapper">
                        <table className="sweet-table">
                            <thead><tr><th>Kullanıcı</th><th>Ürün</th><th>Yorum</th><th>Puan</th><th>Tarih</th><th style={{textAlign:'right'}}>İşlem</th></tr></thead>
                            <tbody>
                                {yorumlar.map(y => (
                                    <tr key={y.id}>
                                        <td style={{fontWeight:'bold'}}>{y.user_ad}</td>
                                        <td style={{color:'var(--primary)'}}>{y.urun_adi}</td>
                                        <td style={{maxWidth:'300px', fontSize:'0.9rem'}}>{y.yorum}</td>
                                        <td style={{color:'#FBC02D'}}>{'★'.repeat(y.puan)}</td>
                                        <td style={{fontSize:'0.8rem', color:'#b2bec3'}}>{y.tarih}</td>
                                        <td style={{textAlign:'right'}}><button onClick={()=>yorumSil(y.id)} className="action-btn delete-btn">Sil</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- KATEGORİ YÖNETİMİ --- */}
            {activeTab === 'kat' && (
                <div style={{display:'flex', gap:'30px', flexWrap:'wrap'}}>
                    <div className="sweet-box" style={{flex:1}}>
                        <h3 style={{marginTop:0, fontFamily:'Fredoka'}}>📂 Kategori Ekle</h3>
                        <input className="sweet-input" placeholder="Kategori Adı" value={yeniKat} onChange={e=>setYeniKat(e.target.value)} style={{marginBottom:'15px'}}/>
                        <button className="btn-full" onClick={katEkle}>Ekle ✨</button>
                    </div>
                    <div className="sweet-box" style={{flex:1.5}}>
                        <h3 style={{marginTop:0, fontFamily:'Fredoka'}}>Mevcut Kategoriler</h3>
                        <ul style={{listStyle:'none', padding:0}}>
                            {kategoriler.map(k => (
                                <li key={k.id} style={{display:'flex', justifyContent:'space-between', padding:'15px', borderBottom:'1px solid #f0f0f0', alignItems:'center'}}>
                                    <span style={{fontWeight:'bold'}}>{k.ad}</span>
                                    <button onClick={()=>katSil(k.id)} className="action-btn delete-btn" style={{fontSize:'0.8rem', padding:'5px 10px'}}>Sil</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* --- KULLANICI YÖNETİMİ (LOCALSTORAGE UYUMLU) --- */}
            {activeTab === 'user' && (
                <div className="sweet-box">
                    <h3 style={{marginTop:0, fontFamily:'Fredoka'}}>👥 Kullanıcılar</h3>
                    <div className="table-wrapper">
                        <table className="sweet-table">
                            <thead><tr><th>ID</th><th>Ad Soyad</th><th>Email</th><th style={{textAlign:'right'}}>İşlem</th></tr></thead>
                            <tbody>
                                {kullanicilar.length === 0 ? (
                                    <tr><td colSpan="4" style={{textAlign:'center', color:'#999'}}>Kayıtlı kullanıcı yok.</td></tr>
                                ) : (
                                    kullanicilar.map(uk => (
                                        <tr key={uk.id}>
                                            <td>{uk.id}</td>
                                            <td style={{fontWeight:'bold'}}>{uk.ad}</td>
                                            <td>{uk.email}</td>
                                            <td style={{textAlign:'right'}}>
                                                <button onClick={()=>kullaniciSil(uk.id)} className="action-btn delete-btn">Üyeyi Sil</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}