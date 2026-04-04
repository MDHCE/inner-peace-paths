# 04 – Nem-funkcionális követelmények

## Bevezető

A nem-funkcionális követelmények meghatározzák, hogy a rendszer **hogyan** működjön, szemben azzal, hogy **mit** csináljon. Ezek a követelmények alapvetően befolyásolják az architektúrális döntéseket, ezért fontos őket korán rögzíteni.

---

## 1. Biztonság

### Adatizoláció
- Minden tulajdonos teljesen elkülönített infrastrukturális példányon fut – adataik fizikailag is izoláltak, nem csak logikailag
- Tulajdonosok között semmilyen adatátjárás nem lehetséges

### Hozzáférés-vezérlés
- Szerepkör-alapú hozzáférés-vezérlés (RBAC) minden szereplőre: tulajdonos, tulajdonosi al-felhasználó, bérlő, bérlői al-felhasználó, végfelhasználó
- Minden API végpont autentikációhoz és jogosultság-ellenőrzéshez kötött
- Minimális jogosultság elve (principle of least privilege): minden szerepkör csak ahhoz fér hozzá, ami a feladatához szükséges

### Autentikáció
- Biztonságos jelszókezelés (hashing, salting)
- Token alapú session kezelés (pl. JWT)
- Jelszóvisszaállítási folyamat

### Pénzügyi adatok
- Érzékeny fizetési adatok (kártyaadatok) soha nem tárolódnak a rendszerben – ezek kezelése kizárólag a payment provider felelőssége (PCI DSS compliance a provider oldalán)
- Minden fizetési kommunikáció titkosított csatornán zajlik (HTTPS/TLS)

### Kommunikáció
- Minden kliens-szerver kommunikáció HTTPS-en keresztül
- API kulcsok és titkok biztonságos tárolása (environment variables, secret management)

---

## 2. Teljesítmény

### Válaszidők
- API válaszidő átlagosan: < 300ms normál terhelés mellett
- Oldalbetöltési idő (Time to Interactive): < 2 másodperc
- Naptárszinkron és értesítések: aszinkron feldolgozás, nem blokkolja a felhasználói felületet

### Foglalási folyamat
- Az ütközésdetekció (double booking) atomi módon kezelendő – párhuzamos foglalási kísérletek esetén is garantált a konzisztencia

---

## 3. Skálázhatóság

### Infrastruktúra
- Minden tulajdonosi példány önállóan skálázható az adott tulajdonos terhelésétől függően
- Az automatizált provisioning folyamat új példányok létrehozását egységesen, reprodukálható módon végzi

### Adatmennyiség
- A rendszernek kezelhetőnek kell lennie több ezer végfelhasználóval és több száz bérlővel tulajdonosonként
- Kimutatások és exportok nagy adatmennyiség esetén is elfogadható idő alatt generálódjanak

---

## 4. Megbízhatóság & Rendelkezésre állás

### Uptime
- Cél: 99.9% rendelkezésre állás (évi ~8 óra tervezett leállás)
- Kritikus folyamatok (foglalás, fizetés) különösen magas megbízhatósággal kezelendők

### Hibatűrés
- Külső integrációk (meeting platform, payment provider, értesítési szolgáltatók, naptár szinkron) meghibásodása ne okozzon teljes rendszerleállást – graceful degradation
- Sikertelen külső API hívások újrapróbálási mechanizmussal kezelendők

### Adatmentés
- Rendszeres, automatizált adatmentés (backup) minden tulajdonosi példányon
- Visszaállítási folyamat definiált és tesztelt legyen

---

## 5. Karbantarthatóság & Fejleszthetőség

### Kód
- Golang backend, egységes konvenciókkal (részletek a CLAUDE.md-ben)
- Moduláris felépítés: az egyes funkcionális területek (foglalás, fizetés, értesítés, naptár) lazán csatolt modulokként kezelendők
- Külső integrációk absztrakciós rétegen keresztül érhetők el – csereberélhetőség biztosított (pl. ha Zoom helyett más meeting platformra kell váltani)

### Tesztelhetőség
- Az üzleti logika unit tesztekkel lefedett
- Kritikus folyamatok (foglalás, fizetés, ütközésdetekció) integrációs tesztekkel is lefedettek

### Dokumentáció
- Az architektúrális döntések ADR (Architecture Decision Record) formátumban dokumentáltak (`/docs/adr/`)
- A `CLAUDE.md` fájl mindig naprakész állapotban tartandó

---

## 6. Használhatóság & Hozzáférhetőség

### Felület
- Webalapú, reszponzív felület – mobilon és asztali böngészőn egyaránt használható
- Natív mobilalkalmazás az első verzióban nem cél

### Nyelv
- Az első verzió elsődleges nyelve: magyar
- A lokalizációs architektúra (i18n) az első verziótól kezdve kiépítendő – a többnyelvűség támogatása alapkövetelmény, nem utólagos bővítés
- A konkrét további nyelvek később határozandók meg, de a rendszer felkészített legyen azok hozzáadására minimális fejlesztési ráfordítással

---

## 7. Megfelelőség & Jogi követelmények

### Adatvédelem
- GDPR megfelelőség kötelező: személyes adatok kezelése, tárolása, törlése szabályozott módon
- Adattörlési kérések kezelésére folyamat szükséges

### Pénzügyi megfelelőség
- A payment provider kiválasztásánál a vonatkozó pénzügyi szabályozások figyelembevétele szükséges (pl. PSD2 az EU-ban)

---

*Dokumentum állapota: első vázlat – jóváhagyásra vár*  
*Előző dokumentum: [03-features.md](03-features.md)*  
*Következő dokumentum: [05-open-questions.md](05-open-questions.md)*
