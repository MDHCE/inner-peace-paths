# 03 – Feature lista & Scope

## Jelölések

- ✅ **In scope** – megvalósítandó
- 🔲 **Out of scope** – explicit döntés alapján nem kerül megvalósításra
- 🔜 **Későbbi fázis** – elvben kívánatos, de az első verzióban nem prioritás

---

## 1. Tulajdonoskezelés

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 1.1 | Tulajdonosi fiók és profil kezelése | ✅ | |
| 1.2 | Tulajdonosi al-felhasználók létrehozása és jogosultságkezelése | ✅ | Szerepkör-alapú hozzáférés |
| 1.3 | Automatizált példány provisioning új tulajdonosnál | ✅ | Felhőalapú, dedikált környezet |
| 1.4 | Erőforrások létrehozása és kezelése | ✅ | Fizikai és online típus |
| 1.5 | Előfizetési csomagok definiálása bérlők számára | ✅ | Kvótákkal, erőforrás-limitekkel |
| 1.6 | Bérlők felvétele, jóváhagyása, deaktiválása | ✅ | |
| 1.7 | Fizetési modul aktiválása/deaktiválása bérlőnként | ✅ | |
| 1.8 | Tulajdonosi pénzügyi kimutatások | ✅ | Bérlőnként, erőforrásonként, időszakonként |

---

## 2. Bérlőkezelés

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 2.1 | Bérlői fiók és profiloldal kezelése | ✅ | Nyilvános profil végfelhasználók felé |
| 2.2 | Bérlői al-felhasználók létrehozása és jogosultságkezelése | ✅ | Pl. asszisztens |
| 2.3 | Előfizetési csomag kiválasztása és kezelése | ✅ | Pay-as-you-go vagy átalány |
| 2.4 | Payment provider account onboarding | ✅ | Pl. Stripe Connect – platform segíti |
| 2.5 | Bérlői pénzügyi kimutatások | ✅ | Saját bevételek, végfelhasználónként |

---

## 3. Erőforrás-foglalás (Booking)

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 3.1 | Erőforrás böngészése és elérhetőség megtekintése | ✅ | |
| 3.2 | Ismétlődő foglalás létrehozása | ✅ | Pl. heti rendszerességgel |
| 3.3 | Ad-hoc foglalás létrehozása | ✅ | Egyszeri alkalomra |
| 3.4 | Foglalás módosítása és lemondása | ✅ | |
| 3.5 | Minimum foglalható időegység kezelése | ✅ | Erőforrásonként konfigurálható |
| 3.6 | Ütközésdetekció (double booking megakadályozása) | ✅ | |

---

## 4. Időpontfoglalás (Appointment)

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 4.1 | Bérlő böngészése, keresése, szűrése | ✅ | A tulajdonos platformján belül |
| 4.2 | Bérlői profiloldal megtekintése | ✅ | Értékelések, elérhetőség |
| 4.3 | Közvetlen időpont-foglalás | ✅ | A bérlő előre létrehozza az elérhető időpontokat, a végfelhasználó választ és foglal (implicit jóváhagyás) |
| 4.4 | Kérés alapú foglalás | 🔜 | A végfelhasználó érdeklődést jelez, a bérlő időpontokat ajánl fel, a végfelhasználó visszaigazol – részletezés szükséges, több nyitott kérdéssel |
| 4.5 | Egyéni (1-1) időpont-foglalás | ✅ | |
| 4.6 | Csoportos időpont-foglalás | ✅ | Több végfelhasználó egy alkalomra – férőhely-korlát kezelése részletezendő |
| 4.7 | Foglalás visszaigazolása | ✅ | Értesítésen keresztül |
| 4.8 | Foglalás lemondása | ✅ | Végfelhasználó és bérlő részéről is |
| 4.9 | Végfelhasználói értékelés bérlőre | ✅ | Csillagos + szöveges értékelés együtt |
| 4.9 | Meghívó alapú belépés bérlőhöz | ✅ | Link alapján közvetlen navigáció |

---

## 5. Online Meeting integráció

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 5.1 | Meeting link automatikus generálása online foglalásnál | ✅ | Külső platform (Zoom, Google Meet, stb.) |
| 5.2 | Meeting link terjesztése résztvevők felé | ✅ | Értesítésen keresztül |
| 5.3 | Saját meeting infrastruktúra fejlesztése | 🔲 | Külső integráció váltja ki |

---

## 6. Fizetés

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 6.1 | Végfelhasználói online fizetés foglaláskor | ✅ | Végfelhasználó → Bérlő irány |
| 6.2 | Bérlői előfizetési díj fizetése | ✅ | Bérlő → Tulajdonos irány |
| 6.3 | Pay-as-you-go számlázás bérlőnek | ✅ | |
| 6.4 | Átalány előfizetés kezelése bérlőnek | ✅ | |
| 6.5 | Erőforrás-kvóta nyomon követése csomagban | ✅ | |
| 6.6 | Fizetési előzmények megtekintése (minden szerepkör) | ✅ | |
| 6.7 | Payment provider integráció (pl. Stripe Connect) | ✅ | Külső szolgáltató |
| 6.8 | Visszatérítés kezelése | 🔜 | Első verzióban nem prioritás |

---

## 7. Értesítések

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 7.1 | Email értesítés | ✅ | Külső provider (pl. SendGrid) |
| 7.2 | SMS értesítés | ✅ | Külső provider (pl. Twilio) |
| 7.3 | Push notification | ✅ | |
| 7.4 | In-app értesítés | ✅ | |
| 7.5 | Teendőlista (Action Center) bejelentkezéskor | ✅ | Actionable to-do lista |
| 7.6 | Értesítési beállítások konfigurálása (esemény, csatorna) | ✅ | Tulajdonos és bérlő szinten |
| 7.7 | Előre definiált értesítési sablonok | ✅ | Gyors konfigurációhoz |

---

## 8. Naptár

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 8.1 | Belső naptár nézet (csak olvasható) | ✅ | Bérlő foglalásainak vizuális megjelenítése |
| 8.2 | Google Calendar kétirányú szinkron | ✅ | |
| 8.3 | Outlook kétirányú szinkron | ✅ | |
| 8.4 | Külső elfoglaltság blokkolja a foglalhatóságot | ✅ | A szinkron részeként |

---

## 9. Kimutatások & Export

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 9.1 | Tulajdonosi kimutatás (bevétel bérlőnként, erőforrásonként) | ✅ | |
| 9.2 | Bérlői kimutatás (saját foglalások, bevételek) | ✅ | |
| 9.3 | Végfelhasználói kimutatás (saját foglalások, fizetések) | ✅ | |
| 9.4 | Online nézet | ✅ | |
| 9.5 | PDF export | ✅ | |
| 9.6 | Excel export | ✅ | |
| 9.7 | CSV export | ✅ | |

---

## 10. Felhasználókezelés & Regisztráció

| # | Feature | Státusz | Megjegyzés |
|---|---------|---------|------------|
| 10.1 | Végfelhasználói regisztráció a tulajdonos platformjára | ✅ | Bérlő ismerete nélkül is |
| 10.2 | Végfelhasználói profil kezelése | ✅ | |
| 10.3 | Bejelentkezés / autentikáció | ✅ | |
| 10.4 | Jelszókezelés, fiókvisszaállítás | ✅ | |
| 10.5 | Szerepkör-alapú hozzáférés-vezérlés (RBAC) | ✅ | Minden szereplőre |

---

## Explicit scope határok – ami NEM kerül megvalósításra

| Feature | Indok |
|---------|-------|
| Saját videókonferencia infrastruktúra | Külső integráció kiváltja, nem indokolt a komplexitás |
| Tulajdonosok közötti keresés / piactér | Dedikált példányok, nincs átjárás |
| Mobilalkalmazás (iOS / Android) | Első verzióban webalapú reszponzív felület elegendő |
| Számlázási / könyvelési szoftver funkcionalitás | A rendszer elszámolási riportot nyújt, nem könyvelési rendszer |
| Visszatérítés kezelése | Első verzióban nem prioritás |

---

*Dokumentum állapota: első vázlat – jóváhagyásra vár*  
*Előző dokumentum: [02-domain.md](02-domain.md)*  
*Következő dokumentum: [04-nonfunctional.md](04-nonfunctional.md)*
