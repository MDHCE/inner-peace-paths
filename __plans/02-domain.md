# 02 – Szereplők & Domén szótár

## Szereplők

### Tulajdonos (Owner)

A platform elsődleges vevője. Lehet magánszemély vagy szervezet (pl. magánklinika, oktatási intézmény, coworking tér). Ő üzemelteti a rendszert, kezeli az erőforrásokat, és bérlőket vesz fel a platformra.

**Jellemzői:**
- A teljes rendszer felett adminisztrátori jogosultsággal rendelkezik
- Definiálja az erőforrásokat és az előfizetési csomagokat
- Látja az összes bérlő tevékenységét és a pénzügyi kimutatásokat
- Saját al-felhasználókat hozhat létre meghatározott jogosultságokkal (pl. recepciós, pénzügyi munkatárs)

---

### Tulajdonosi al-felhasználó (Owner Sub-user)

A tulajdonos által létrehozott, korlátozott jogosultságú felhasználó, aki a tulajdonos nevében végez meghatározott feladatokat a rendszerben (pl. bérlők jóváhagyása, erőforrás-kezelés, riportok megtekintése).

**Jellemzői:**
- Jogosultságait a tulajdonos definiálja
- Nem rendelkezik teljes adminisztrátori hozzáféréssel
- Példák: recepciós, adminisztrátor, pénzügyi munkatárs

---

### Bérlő (Tenant)

A tulajdonos ügyfele vagy alkalmazottja, aki erőforrásokat vesz igénybe és saját végfelhasználóit szolgálja ki a platformon keresztül.

**Jellemzői:**
- Mindig egyén (nem szervezet)
- Foglal erőforrásokat (ismétlődően vagy ad-hoc)
- Saját foglalási naptárral és profiloldallal rendelkezik
- Fizet a tulajdonosnak platform-használati díjat (pay-as-you-go vagy csomag előfizetés) – ez bérlőnként deaktiválható
- Saját al-felhasználókat hozhat létre (pl. asszisztens)
- Payment provider account-tal rendelkezik a végfelhasználói fizetések fogadásához

**Megjegyzés:** A rendszer nem tesz különbséget "külső bérlő" és "alkalmazott bérlő" között – a fizetési modul aktiválása a tulajdonos konfigurációs döntése.

---

### Bérlői al-felhasználó (Tenant Sub-user)

A bérlő által létrehozott, korlátozott jogosultságú felhasználó, aki a bérlő nevében végez meghatározott feladatokat (pl. foglalások kezelése, naptár szerkesztése).

**Jellemzői:**
- Jogosultságait a bérlő definiálja
- Példa: asszisztens, titkár

---

### Végfelhasználó (End User)

A tulajdonos platformjára regisztrált felhasználó, aki bérlők szolgáltatásait veszi igénybe időpontfoglalás és fizetés útján.

**Jellemzői:**
- A **tulajdonos platformjához** tartozik, nem egyetlen bérlőhöz kötött
- Egy regisztrációval több bérlő szolgáltatását is igénybe veheti újbóli regisztráció nélkül
- Regisztrálhat a rendszerbe bérlő ismerete nélkül is
- A tulajdonos rendszerén belül böngészi és választja ki a bérlőt (pl. szűrés, értékelések alapján)
- Párhuzamosan több bérlőnél is lehet aktív foglalása
- Fizet a foglalásért a rendszeren belül
- Látja saját foglalásait és fizetési előzményeit valamennyi bérlőnél

---

## Domén fogalmak

### Erőforrás (Resource)

Az a foglalható egység, amelyet a tulajdonos elérhetővé tesz bérlők számára. Az erőforrás lehet fizikai vagy online jellegű.

**Típusai:**
- **Fizikai erőforrás:** Valós, helyszíni tér (pl. rendelő, terem, tárgyaló)
- **Online erőforrás:** Virtuális foglalható egység, amelyhez egy külső meeting platform által hostolt online meeting kapcsolódik

**Jellemzői:**
- Rendelkezik minimum foglalható időegységgel
- Foglalható ismétlődő jelleggel (pl. minden hétfő délelőtt) vagy ad-hoc módon (egyszeri alkalomra)
- Egy erőforrást több bérlő is igénybe vehet (különböző időpontokban)
- Egy bérlő több erőforrást is használhat

---

### Foglalás (Booking)

Egy bérlő által egy erőforrásra vonatkozóan létrehozott időfoglalás, amelyhez végfelhasználói részvétel kapcsolódhat.

**Típusai:**
- **Ismétlődő foglalás:** Rendszeres, előre meghatározott időablakra vonatkozó foglalás (pl. heti rendszerességgel)
- **Ad-hoc foglalás:** Egyszeri, eseti foglalás

**Jellemzői:**
- Kapcsolódhat hozzá végfelhasználói időpontfoglalás
- Online erőforrás esetén automatikusan generálódik meeting link
- Megjelenik a bérlő belső naptárában és szinkronizálható külső naptárral

---

### Időpontfoglalás (Appointment)

A végfelhasználó által egy bérlőnél kezdeményezett konkrét időpontra szóló foglalás, amely egy erőforrás adott foglalásához kapcsolódik.

**Jellemzői:**
- A végfelhasználó a rendszeren belül fizet az időpontért
- Lehet egyéni (1-1) vagy csoportos (több végfelhasználó ugyanazon az alkalmon)
- Visszaigazolás, emlékeztető értesítés tartozik hozzá

---

### Online Meeting

Külső platformon (pl. Zoom, Google Meet) hostolt virtuális találkozó, amelyet a rendszer automatikusan generál online erőforráshoz kapcsolódó foglaláshoz.

**Jellemzői:**
- A meeting infrastruktúra külső szolgáltatónál fut (nem saját fejlesztés)
- A rendszer a meeting linket kezeli és terjeszti a résztvevők felé
- Lehet egyéni (1-1) vagy csoportos részvételű

---

### Előfizetési csomag (Subscription Plan)

A tulajdonos által definiált, bérlők számára elérhető platform-használati konstrukció.

**Típusai:**
- **Pay-as-you-go:** A bérlő tényleges használat alapján fizet
- **Átalány előfizetés:** A bérlő fix időszaki díjat fizet, amely meghatározott kvótákat tartalmazhat (pl. havi X óra fizikai teremhasználat)

**Jellemzői:**
- A bérlő választ a rendelkezésre álló csomagok közül
- A csomagok tartalmazhatnak erőforrás-kvótákat
- A fizetési modul bérlőnként aktiválható vagy deaktiválható

---

### Elszámolás (Settlement)

Az a folyamat, amely alapján meghatározható, hogy a rendszeren belül keletkezett bevétel melyik bérlőhöz és melyik erőforráshoz kötődik.

**Jellemzői:**
- Minden tranzakció nyomon követhető bérlő és erőforrás szinten
- Kimutatások generálhatók időszakonként
- Exportálható formátumok: PDF, Excel, CSV

---

### Értesítés (Notification)

A rendszer által küldött tájékoztató üzenet egy adott esemény bekövetkeztekor.

**Csatornák:** email, SMS, push notification, in-app  
**Konfigurálhatóság:** A tulajdonos és a bérlő szabadon konfigurálhatja, mely esemény milyen csatornán küldjön értesítést. Gyors beállításhoz előre definiált sablonok állnak rendelkezésre.

---

### Teendőlista (To-do / Action Center)

Bejelentkezéskor megjelenő, személyre szabott lista, amely az adott felhasználó számára elvégzendő, aktuális feladatokat sorolja fel (pl. jóváhagyandó foglalás, esedékes fizetés, kitöltetlen profil).

---

### Naptár (Calendar)

A bérlő foglalásait vizuálisan megjelenítő, csak olvasható nézet a rendszeren belül. Kétirányúan szinkronizálható külső naptáralkalmazásokkal (Google Calendar, Outlook):
- A rendszerbeli foglalás megjelenik a külső naptárban
- A külső naptárban jelölt elfoglaltság blokkolja a foglalhatóságot a rendszerben

---

## Szereplők közötti kapcsolatok

```
Tulajdonos
  ├── Tulajdonosi al-felhasználók (0..N)
  ├── Erőforrások (1..N)
  ├── Előfizetési csomagok (1..N)
  ├── Bérlők (1..N)
  │     ├── Bérlői al-felhasználók (0..N)
  │     └── Foglalások / Bookings (0..N) ── Erőforrás
  └── Végfelhasználók (1..N)              ← a tulajdonos platformjához tartozik
        └── Időpontfoglalások (0..N) ── Foglalás + Bérlő
```

**Kulcspont:** A Végfelhasználó és a Bérlő között nincs közvetlen, előre rögzített kapcsolat. A kapcsolatot az Időpontfoglalás (Appointment) teremti meg – egy végfelhasználó több bérlőnél is rendelkezhet időpontfoglalással.

---

*Dokumentum állapota: első vázlat – jóváhagyásra vár*  
*Előző dokumentum: [01-vision.md](01-vision.md)*  
*Következő dokumentum: [03-features.md](03-features.md)*
