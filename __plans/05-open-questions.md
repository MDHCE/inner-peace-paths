# 05 – Nyitott kérdések

## Bevezető

Ez a dokumentum azokat a kérdéseket gyűjti össze, amelyek a tervezési folyamat során felmerültek, de még nem születtek végleges döntések róluk. Minden kérdésnél jelezzük, hogy mikor kritikus a döntés és ki felelős érte.

---

## Prioritás jelölések

- 🔴 **Kritikus** – architektúrát vagy fejlesztési irányt befolyásol, mielőbb döntendő
- 🟡 **Fontos** – a fejlesztés előrehaladtával döntendő, de nem blokkoló
- 🟢 **Alacsony prioritás** – kényelmi vagy részletkérdés, ráér később

---

## 1. Integrációk

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 1.1 | Melyik online meeting platformot integráljuk elsőként? (Zoom, Google Meet, Daily.co, stb.) | 🔴 | Befolyásolja az integrációs réteg tervezését |
| 1.2 | Melyik payment providert használjuk? (Stripe Connect, Barion, stb.) | 🔴 | Befolyásolja a fizetési modult és a bérlői onboarding folyamatot |
| 1.3 | Melyik email szolgáltatót használjuk? (SendGrid, Mailgun, AWS SES, stb.) | 🟡 | |
| 1.4 | Melyik SMS szolgáltatót használjuk? (Twilio, stb.) | 🟡 | |
| 1.5 | Milyen feltételek mentén kell a bérlőknek payment provider accountot létrehozni? (pl. Stripe Connect onboarding követelmények) | 🔴 | Jogi és technikai szempontból is tisztázandó |

---

## 2. Foglalási folyamat részletei

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 2.1 | Csoportos foglaláshoz van-e maximális férőhelyszám? Ha igen, ki definiálja – a bérlő vagy a tulajdonos? | 🔴 | Befolyásolja az Appointment adatmodellt |
| 2.2 | Kérés alapú foglalás (B folyamat) részletes kidolgozása: ki kezdeményez, mennyi ideig érvényes az ajánlat, mi történik ha a végfelhasználó nem válaszol? | 🟡 | Komplex folyamat, külön tervezési kör szükséges |
| 2.3 | Lemondási szabályok: van-e lemondási határidő? Van-e lemondási díj? Ki definiálja – a tulajdonos vagy a bérlő? | 🟡 | Fizetési folyamatot is érinti |
| 2.4 | Mi történik fizetés után lemondott foglalásnál – automatikus visszatérítés vagy manuális folyamat? | 🟡 | Visszatérítési modul tervezésével összefügg |
| 2.5 | A bérlő jóváhagyhat-e / utasíthat-e vissza közvetlen foglalást, vagy az mindig automatikusan visszaigazolódik? | 🟡 | |

---

## 3. Előfizetések és elszámolás

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 3.1 | Milyen időszakonként számlázódik a bérlői előfizetés? (havi, éves, egyéb) | 🔴 | |
| 3.2 | Pay-as-you-go modellnél mi az elszámolási egység? (időpont, erőforrás-használati óra, stb.) | 🔴 | |
| 3.3 | Mi történik ha egy bérlő eléri az előfizetési csomag kvótáját? (automatikus blokkolás, túlhasználati díj, értesítés) | 🟡 | |
| 3.4 | Lehetséges-e csomag váltása aktív előfizetési időszak közben? Ha igen, hogyan számlázódik az arányos különbözet? | 🟡 | |

---

## 4. Értesítések és kommunikáció

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 4.1 | Milyen rendszer-szintű eseményekre kell alapértelmezetten értesítést küldeni? (pl. foglalás visszaigazolása, emlékeztető, fizetés sikeres) | 🟡 | Az alapértelmezett sablonok tartalmát definiálni kell |
| 4.2 | Emlékeztető értesítésnél mennyi az alapértelmezett időtáv? (pl. 24 órával, 1 órával előtte) | 🟢 | Konfigurálható lesz, de alapértékeket meg kell határozni |

---

## 5. Kimutatások részletei

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 5.1 | Pontosan milyen adatokat tartalmaz a tulajdonosi kimutatás? (bevétel bérlőnként, erőforrásonként, időszakonként – mi a minimális elvárás?) | 🟡 | |
| 5.2 | Pontosan milyen adatokat tartalmaz a bérlői kimutatás? | 🟡 | |
| 5.3 | Pontosan milyen adatokat tartalmaz a végfelhasználói kimutatás? | 🟢 | |
| 5.4 | Van-e igény valós idejű (real-time) dashboard nézetre, vagy elegendő az időszakos kimutatás? | 🟡 | Befolyásolja az adatarchitektúrát |

---

## 6. Infrastruktúra és üzemeltetés

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 6.1 | Melyik felhőszolgáltatót használjuk? (AWS, GCP, Azure, stb.) | 🔴 | Befolyásolja a provisioning folyamatot és az eszközválasztást |
| 6.2 | Milyen technológiával valósul meg az automatizált provisioning? (Terraform, Pulumi, stb.) | 🔴 | |
| 6.3 | Hogyan történik a frissítések kiadása több tulajdonosi példányra egyszerre? | 🟡 | |

---

## 7. Jogi és megfelelőségi kérdések

| # | Kérdés | Prioritás | Megjegyzés |
|---|--------|-----------|------------|
| 7.1 | GDPR: Ki az adatkezelő és ki az adatfeldolgozó a tulajdonos–bérlő–végfelhasználó viszonyban? | 🔴 | Jogi tanácsadás szükséges |
| 7.2 | PSD2 / pénzforgalmi megfelelőség: szükséges-e pénzforgalmi engedély a rendszer üzemeltetéséhez? | 🔴 | Jogi tanácsadás szükséges |
| 7.3 | Milyen további nyelveken szükséges a rendszer az i18n után? | 🟡 | |

---

*Dokumentum állapota: első vázlat – folyamatosan frissítendő*  
*Előző dokumentum: [04-nonfunctional.md](04-nonfunctional.md)*
