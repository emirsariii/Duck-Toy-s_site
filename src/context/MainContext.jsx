import React, { createContext, useState, useEffect } from 'react';

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  // --- STATE'LER ---
  const [sepet, setSepet] = useState([]);
  const [favoriler, setFavoriler] = useState([]); // Favoriler Listesi
  const [user, setUser] = useState(null);
  const [aramaMetni, setAramaMetni] = useState("");
  const [indirimOrani, setIndirimOrani] = useState(0);

  // --- VERİLERİ YÜKLE ---
  useEffect(() => {
    try {
      const kayitliSepet = localStorage.getItem('sepet');
      if (kayitliSepet) setSepet(JSON.parse(kayitliSepet));

      const kayitliFav = localStorage.getItem('favoriler');
      if (kayitliFav) setFavoriler(JSON.parse(kayitliFav));
      
      const kayitliUser = localStorage.getItem('user');
      if (kayitliUser) setUser(JSON.parse(kayitliUser));
    } catch (error) { console.error("Veri okuma hatası:", error); }
  }, []);

  // --- OTOMATİK KAYIT ---
  useEffect(() => { localStorage.setItem('sepet', JSON.stringify(sepet)); }, [sepet]);
  useEffect(() => { localStorage.setItem('favoriler', JSON.stringify(favoriler)); }, [favoriler]);

  // --- FONKSİYONLAR ---

  // Favori Ekle/Çıkar (BU KISIM ÖNEMLİ)
  const toggleFavori = (urun) => {
      // Ürün zaten favoride mi? (ID kontrolü)
      const varMi = favoriler.find(f => f.id === urun.id);
      
      if (varMi) {
          // Varsa listeden çıkar
          const yeniFavoriler = favoriler.filter(f => f.id !== urun.id);
          setFavoriler(yeniFavoriler);
      } else {
          // Yoksa listeye ekle
          setFavoriler([...favoriler, urun]);
      }
  };

  const sepeteEkle = (urun) => { setSepet(prev => [...prev, urun]); };
  const sepettenCikar = (id) => { setSepet(prev => prev.filter(item => item.id !== id)); };
  const sepetiBosalt = () => { setSepet([]); setIndirimOrani(0); };

  const girisYap = (kullanici) => { setUser(kullanici); localStorage.setItem('user', JSON.stringify(kullanici)); };
  const cikisYap = () => { setUser(null); localStorage.removeItem('user'); window.location.href = '/'; };

  const kuponUygula = (kod) => {
    if (!kod) return { basarili: false, mesaj: "Kod girmediniz." };
    if(kod.trim().toUpperCase() === "ORDEK10") {
        setIndirimOrani(10);
        return { basarili: true, mesaj: "Tebrikler! %10 İndirim Uygulandı 🦆" };
    } else {
        setIndirimOrani(0);
        return { basarili: false, mesaj: "Geçersiz kod." };
    }
  };

  // --- DATA PAKETİ (Burada toggleFavori mutlaka olmalı) ---
  const data = {
    sepet, sepeteEkle, sepettenCikar, sepetiBosalt,
    favoriler, toggleFavori, // <-- BURASI EKSİKSE ÇALIŞMAZ
    user, girisYap, cikisYap,
    aramaMetni, setAramaMetni,
    indirimOrani, kuponUygula
  };

  return (
    <MainContext.Provider value={data}>
      {children}
    </MainContext.Provider>
  );
};