import React, { useState, useEffect } from 'react';

export default function DuckGame() {
  const [isOpen, setIsOpen] = useState(false); // Oyun açık mı?
  const [score, setScore] = useState(0); // Kaç kere tıkladın?
  const [position, setPosition] = useState({ top: '50%', left: '50%' }); // Ördeğin konumu
  const [gameOver, setGameOver] = useState(false); // Kazandı mı?
  const [gameTime, setGameTime] = useState(10); // 10 Saniye süre

  // Ördeği rastgele bir yere taşı
  const moveDuck = () => {
    const randomTop = Math.floor(Math.random() * 80) + 10; // %10 ile %90 arası
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  // Ördeğe tıklayınca
  const handleClick = () => {
    if (score + 1 >= 5) {
        setGameOver(true); // 5 kere tıklarsa kazanır
    } else {
        setScore(score + 1);
        moveDuck(); // Kaçsın
    }
  };

  // Oyunu Başlat
  const startGame = () => {
      setIsOpen(true);
      setScore(0);
      setGameOver(false);
      setGameTime(15);
      moveDuck();
  };

  // Süre Sayacı
  useEffect(() => {
      let interval;
      if (isOpen && !gameOver && gameTime > 0) {
          interval = setInterval(() => {
              setGameTime((prev) => prev - 1);
          }, 1000);
      } else if (gameTime === 0) {
          // Süre bitti, kaybettin
          setIsOpen(false); 
          alert("Süre doldu! Ördek kaçtı :( Tekrar dene.");
      }
      return () => clearInterval(interval);
  }, [isOpen, gameOver, gameTime]);

  return (
    <>
      {/* 1. SAĞ ALTTAKİ SABİT BUTON */}
      {!isOpen && (
          <div 
            onClick={startGame}
            style={{
                position: 'fixed', bottom: '20px', right: '20px', 
                zIndex: 9999, cursor: 'pointer',
                animation: 'bounce 2s infinite'
            }}
          >
              <div style={{
                  background:'#FFD700', padding:'10px', borderRadius:'50px', 
                  boxShadow:'0 5px 15px rgba(0,0,0,0.2)', border:'3px solid white',
                  display:'flex', alignItems:'center', gap:'10px'
              }}>
                  <span style={{fontSize:'2rem'}}>🦆</span>
                  <div style={{display:'flex', flexDirection:'column'}}>
                      <span style={{fontWeight:'bold', fontSize:'0.8rem', color:'#5D4037'}}>Beni Yakala!</span>
                      <span style={{fontSize:'0.7rem', color:'#E65100'}}>%10 İndirim Kazan</span>
                  </div>
              </div>
          </div>
      )}

      {/* 2. OYUN ALANI (MODAL) */}
      {isOpen && (
          <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.8)', zIndex: 10000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
              
              {/* KAZANMA EKRANI */}
              {gameOver ? (
                  <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', border:'5px solid #FFD700'}}>
                      <h1>🎉 TEBRİKLER! 🎉</h1>
                      <p>Ördeği yakaladın!</p>
                      <div style={{background:'#FFFDE7', padding:'15px', border:'2px dashed #FBC02D', margin:'20px 0', fontSize:'1.5rem', fontWeight:'bold', color:'#E65100'}}>
                          ORDEK10
                      </div>
                      <p style={{fontSize:'0.9rem', color:'#888'}}>Bu kodu sepette kullanabilirsin.</p>
                      <button onClick={() => setIsOpen(false)} style={{padding:'10px 20px', background:'#FF6B6B', color:'white', border:'none', borderRadius:'20px', cursor:'pointer', fontWeight:'bold'}}>Kapat ve Alışverişe Dön</button>
                  </div>
              ) : (
                  /* OYUN SAHNESİ */
                  <div style={{width:'80%', height:'80%', position:'relative', background:'white', borderRadius:'20px', overflow:'hidden', border:'5px solid #4ECDC4'}}>
                      <button 
                        onClick={() => setIsOpen(false)}
                        style={{position:'absolute', top:10, right:10, background:'red', color:'white', border:'none', padding:'5px 10px', cursor:'pointer', borderRadius:'5px'}}
                      >X</button>
                      
                      <div style={{position:'absolute', top:10, left:20, fontSize:'1.5rem', fontWeight:'bold'}}>
                          Skor: {score} / 5 🎯 | Süre: {gameTime}s ⏳
                      </div>

                      {/* KAÇAN ÖRDEK */}
                      <img 
                          src="/src/images/emoji.png" 
                          alt="Duck" 
                          onClick={handleClick}
                          style={{
                              position: 'absolute',
                              top: position.top,
                              left: position.left,
                              width: '80px',
                              cursor: 'pointer',
                              transition: 'top 0.3s, left 0.3s', // Kayarak kaçsın
                              userSelect: 'none'
                          }}
                      />
                  </div>
              )}
          </div>
      )}
      
      <style>{`
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}