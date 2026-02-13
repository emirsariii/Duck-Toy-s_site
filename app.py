from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import datetime
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def baglanti_ac():
    conn = sqlite3.connect('oyuncak_v2.db')
    conn.row_factory = sqlite3.Row
    return conn

def tablolari_olustur():
    conn = baglanti_ac()
    cursor = conn.cursor()
    
    cursor.execute("CREATE TABLE IF NOT EXISTS kategoriler (id INTEGER PRIMARY KEY AUTOINCREMENT, ad TEXT NOT NULL UNIQUE)")
    
    # Ürünler Tablosu (Etiket, Yaş Grubu Dahil)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS urunler (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            ad TEXT, 
            kategori TEXT, 
            yas_grubu TEXT,
            etiket TEXT, 
            resim_url TEXT, 
            fiyat REAL, 
            stok INTEGER DEFAULT 0,
            aciklama TEXT,
            tiklama_sayisi INTEGER DEFAULT 0
        )
    """)
    
    cursor.execute("CREATE TABLE IF NOT EXISTS kullanicilar (id INTEGER PRIMARY KEY AUTOINCREMENT, ad_soyad TEXT, email TEXT UNIQUE, sifre TEXT)")
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS yorumlar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            urun_id INTEGER, user_ad TEXT, yorum TEXT, puan INTEGER, tarih TEXT
        )
    """)

    # YENİ: SİPARİŞLER TABLOSU
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS siparisler (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER, ad_soyad TEXT, adres TEXT, telefon TEXT,
            toplam_tutar REAL, urunler_ozet TEXT, tarih TEXT, durum TEXT
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Veritabanı ve Tablolar Hazır!")

tablolari_olustur()

@app.route('/')
def home(): return "Toyji Backend Final 🚀"

# --- SİPARİŞ OLUŞTURMA (YENİ) ---
@app.route('/api/siparis/olustur', methods=['POST'])
def siparis_olustur():
    data = request.get_json()
    conn = baglanti_ac()
    tarih = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")
    
    # Sepetteki ürünlerin özetini çıkar
    urunler_ozet = ", ".join([u['ad'] for u in data['sepet']])
    
    try:
        conn.execute("""
            INSERT INTO siparisler (user_id, ad_soyad, adres, telefon, toplam_tutar, urunler_ozet, tarih, durum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (data['user_id'], data['ad_soyad'], data['adres'], data['telefon'], data['toplam'], urunler_ozet, tarih, "Hazırlanıyor"))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except Exception as e: return jsonify({"durum": "hata", "mesaj": str(e)})
    finally: conn.close()

# --- ÜRÜN İŞLEMLERİ ---
@app.route('/api/urunler', methods=['GET'])
def urunleri_getir():
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT * FROM urunler ORDER BY id DESC")
    veriler = cur.fetchall()
    conn.close()
    
    liste = []
    for u in veriler:
        etiket = u["etiket"] if u["etiket"] else "Normal"
        liste.append({
            "id": u["id"], "ad": u["ad"], "kategori": u["kategori"], 
            "yas_grubu": u["yas_grubu"] or "Genel", "etiket": etiket,
            "resim_url": u["resim_url"], "fiyat": u["fiyat"],
            "stok": u["stok"], "aciklama": u["aciklama"]
        })
    return jsonify(liste)

@app.route('/api/detay/<int:id>', methods=['GET'])
def urun_detay(id):
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT * FROM urunler WHERE id = ?", (id,))
    u = cur.fetchone()
    if not u: return jsonify({"hata": "Bulunamadı"}), 404
    cur.execute("SELECT * FROM yorumlar WHERE urun_id = ? ORDER BY id DESC", (id,))
    yorumlar = [{"user": y["user_ad"], "yorum": y["yorum"], "puan": y["puan"], "tarih": y["tarih"]} for y in cur.fetchall()]
    conn.close()
    return jsonify({
        "urun": {
            "id": u["id"], "ad": u["ad"], "kategori": u["kategori"], 
            "yas_grubu": u["yas_grubu"], "etiket": u["etiket"],
            "resim_url": u["resim_url"], "fiyat": u["fiyat"], 
            "stok": u["stok"], "aciklama": u["aciklama"]
        }, "yorumlar": yorumlar
    })

# --- ADMİN İŞLEMLERİ ---
@app.route('/api/admin/ekle', methods=['POST'])
def urun_ekle_admin():
    data = request.get_json()
    conn = baglanti_ac()
    try:
        conn.execute("INSERT INTO urunler (ad, kategori, yas_grubu, etiket, resim_url, fiyat, stok, aciklama) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                     (data['ad'], data['kategori'], data['yas_grubu'], data['etiket'], data['resim_url'], data['fiyat'], data['stok'], data['aciklama']))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except Exception as e: return jsonify({"durum": "hata", "mesaj": str(e)})
    finally: conn.close()

@app.route('/api/admin/guncelle/<int:id>', methods=['PUT'])
def urun_guncelle(id):
    data = request.get_json()
    conn = baglanti_ac()
    try:
        conn.execute("UPDATE urunler SET ad=?, kategori=?, yas_grubu=?, etiket=?, resim_url=?, fiyat=?, stok=?, aciklama=? WHERE id=?", 
                     (data['ad'], data['kategori'], data['yas_grubu'], data['etiket'], data['resim_url'], data['fiyat'], data['stok'], data['aciklama'], id))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except Exception as e: return jsonify({"durum": "hata", "mesaj": str(e)})
    finally: conn.close()

@app.route('/api/admin/sil/<int:id>', methods=['DELETE'])
def urun_sil(id):
    conn = baglanti_ac()
    conn.execute("DELETE FROM urunler WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"durum": "basarili"})

@app.route('/api/admin/yorumlar', methods=['GET'])
def admin_yorumlari_getir():
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT y.id, y.user_ad, y.yorum, y.puan, y.tarih, u.ad as urun_adi FROM yorumlar y LEFT JOIN urunler u ON y.urun_id = u.id ORDER BY y.id DESC")
    veriler = cur.fetchall()
    conn.close()
    return jsonify([dict(row) for row in veriler])

@app.route('/api/admin/yorum-sil/<int:id>', methods=['DELETE'])
def admin_yorum_sil(id):
    conn = baglanti_ac()
    conn.execute("DELETE FROM yorumlar WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"durum": "basarili"})

@app.route('/api/admin/kullanici-sil/<int:id>', methods=['DELETE'])
def admin_kullanici_sil(id):
    conn = baglanti_ac()
    conn.execute("DELETE FROM kullanicilar WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"durum": "basarili"})

# --- AUTH & DİĞERLERİ ---
@app.route('/api/admin/login', methods=['POST'])
def admin_giris():
    data = request.get_json()
    # ŞİFRE BURADA 1234
    if data.get('kadi') == "admin" and data.get('sifre') == "1234":
        return jsonify({"durum": "basarili"})
    return jsonify({"durum": "hata", "mesaj": "Hatalı Giriş"}), 401

@app.route('/api/giris', methods=['POST'])
def giris_yap():
    data = request.get_json()
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT * FROM kullanicilar WHERE email=? AND sifre=?", (data['email'], data['sifre']))
    user = cur.fetchone()
    conn.close()
    if user: return jsonify({"durum": "basarili", "user": {"id": user["id"], "ad": user["ad_soyad"], "email": user["email"]}})
    return jsonify({"durum": "hata", "mesaj": "Hatalı bilgiler!"})

@app.route('/api/kayit', methods=['POST'])
def kayit_ol():
    data = request.get_json()
    conn = baglanti_ac()
    try:
        conn.execute("INSERT INTO kullanicilar (ad_soyad, email, sifre) VALUES (?, ?, ?)", (data['ad'], data['email'], data['sifre']))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except: return jsonify({"durum": "hata"})
    finally: conn.close()

@app.route('/api/yorum/ekle', methods=['POST'])
def yorum_ekle():
    data = request.get_json()
    conn = baglanti_ac()
    tarih = datetime.datetime.now().strftime("%d.%m.%Y")
    try:
        conn.execute("INSERT INTO yorumlar (urun_id, user_ad, yorum, puan, tarih) VALUES (?, ?, ?, ?, ?)", (data['urun_id'], data['user_ad'], data['yorum'], data['puan'], tarih))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except Exception as e: return jsonify({"durum": "hata", "mesaj": str(e)})
    finally: conn.close()

@app.route('/api/yorum-getir', methods=['POST'])
def yorumlari_cek():
    return jsonify({"durum": "basarili", "yorumlar": []}) # Scraping şimdilik boş dönsün hatayı önlemek için

@app.route('/api/kategoriler', methods=['GET'])
def kategorileri_getir():
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT * FROM kategoriler")
    return jsonify([{"id": k["id"], "ad": k["ad"]} for k in cur.fetchall()])

@app.route('/api/admin/kategori-ekle', methods=['POST'])
def kategori_ekle():
    data = request.get_json()
    conn = baglanti_ac()
    try:
        conn.execute("INSERT INTO kategoriler (ad) VALUES (?)", (data['ad'],))
        conn.commit()
        return jsonify({"durum": "basarili"})
    except: return jsonify({"durum": "hata"})
    finally: conn.close()

@app.route('/api/admin/kullanicilar', methods=['GET'])
def kullanicilari_getir():
    conn = baglanti_ac()
    cur = conn.cursor()
    cur.execute("SELECT id, ad_soyad, email FROM kullanicilar")
    return jsonify([{"id": u["id"], "ad_soyad": u["ad_soyad"], "email": u["email"]} for u in cur.fetchall()])

@app.route('/api/admin/kategori-sil/<int:id>', methods=['DELETE'])
def kategori_sil(id):
    conn = baglanti_ac()
    conn.execute("DELETE FROM kategoriler WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"durum": "basarili"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)