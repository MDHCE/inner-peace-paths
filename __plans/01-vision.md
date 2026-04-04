# 01 – Problem Statement & Vision

## A megoldandó probléma

A modern szolgáltatási piacokon egyre több szakember (terapeuták, orvosok, coachok, nyelvtanárok) működik önállóan vagy kisebb szervezetek keretein belül, de nem rendelkeznek egységes, integrált digitális eszközzel az erőforrásaik kezelésére, ügyfeleik foglalásainak szervezésére és a pénzügyi elszámolás átlátható nyomon követésére. A meglévő megoldások általában csak egy-egy részproblémát fednek le (naptárkezelés, fizetés, videóhívás), de nem integráltan, és nem igazodnak a tulajdonos–bérlő–végfelhasználó háromszintű üzleti modellhez.

## A megoldás

Egy webalapú, többszereplős erőforrás-foglaló és -megosztó platform, amely lehetővé teszi:

- **Tulajdonosok** számára: fizikai és online erőforrásaik (termek, online meeting slotok) kezelését és bérlők részére történő elérhetővé tételét
- **Bérlők** számára: erőforrások foglalását, saját ügyfeleik kiszolgálását, foglalási naptáruk kezelését és bevételeik nyomon követését
- **Végfelhasználók** számára: bérlők megtalálását, időpont-foglalást és online fizetést egy egységes felületen

## Célcsoport

- **Elsődleges vevő (tulajdonos):** Ingatlanokat, infrastruktúrát vagy platformot üzemeltető szervezet vagy magánszemély, aki erőforrásait harmadik feleknek kívánja elérhetővé tenni (pl. magánklinika, coworking tér, oktatási intézmény)
- **Másodlagos felhasználó (bérlő):** Önálló szakember (orvos, terapeuta, coach, nyelvtanár) vagy a tulajdonos alkalmazottja, aki az erőforrásokat igénybe veszi saját ügyfelei kiszolgálásához
- **Végső felhasználó:** A bérlő ügyfele, aki a platformon keresztül foglal időpontot és fizet a szolgáltatásért

## Az üzleti modell lényege

A platform egy háromszintű hierarchiában működik:

```
Tulajdonos
  └── Bérlők (N db)
        └── Végfelhasználók (N db)
```

A pénzáramlás iránya:
- Végfelhasználó → Bérlő (foglalási díj, a rendszeren belül)
- Bérlő → Tulajdonos (platform-használati díj: pay-as-you-go vagy csomag előfizetés, a rendszeren belül)

## Telepítési modell

Minden tulajdonos számára **dedikált, elkülönített infrastrukturális példány** jön létre. Az új tulajdonosi környezetek kialakítása automatizált provisioning folyamaton keresztül történik (pl. felhőalapú klaszter). Tulajdonosok között nincs átjárás, adataik teljesen izoláltak.

## Sikerességi kritériumok

- A tulajdonos képes erőforrásait önállóan kezelni és bérlők számára elérhetővé tenni
- A bérlő képes a platformon belül teljes körűen kiszolgálni végfelhasználóit (foglalás, online meeting, fizetés)
- A végfelhasználó gördülékenyen tud időpontot foglalni és fizetni
- Az elszámolás minden szinten transzparens és exportálható
- Az integráció (naptár, meeting, fizetés) megbízhatóan működik harmadik fél szolgáltatásokon keresztül

## Scope határok – mi NEM része a projektnek

- Saját videókonferencia infrastruktúra fejlesztése (külső integráció helyettesíti)
- Tulajdonosok közötti keresés vagy piactér funkció
- Számlázási vagy könyvelési szoftver (az elszámolási riportok nem helyettesítik ezeket)
- Mobilalkalmazás (webalapú, reszponzív felület az elsődleges célplatform)

---

*Dokumentum állapota: első vázlat – jóváhagyásra vár*  
*Következő dokumentum: [02-domain.md](02-domain.md)*
