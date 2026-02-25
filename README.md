# SYSCODE tesztfeladat -- megoldás

## AI használat

A fejlesztés során használtam modern fejlesztői eszközöket (editorba
integrált asszisztenst), főleg ismétlődő boilerplate gyorsítására.\
Az architektúra, a technológiai döntések és a teljes rendszer felépítése
saját tervezés és kivitelezés eredménye.

------------------------------------------------------------------------

## Röviden a projektről

A feladat két NodeJS (NestJS) microservice és egy Angular SPA
elkészítése volt.

A **profile service** egy Student CRUD alkalmazás PostgreSQL-lel. UUID
alapú azonosítót használ, az email formailag validált, az adatbázis
sémát Liquibase hozza létre, az ORM TypeORM. Minden végponthoz készült
unit és e2e teszt.

Az **address service** egy különálló service, amely Basic Auth-tal
védett endpointon keresztül ad vissza címet egy adott id-hez. Ehhez is
készültek tesztek.

Az Angular frontend az összes funkciót demonstrálja: student lista,
létrehozás, módosítás, törlés, illetve cím lekérés. A felület
reszponzív, mobilon és desktopon is használható.

A service-ek Docker image-ben futnak, és együtt indíthatók.

------------------------------------------------------------------------

## Indítás

A legegyszerűbb mód Dockerrel:

docker compose up -d --build

Ez elindítja a PostgreSQL-t, a két service-t és a web alkalmazást.

Elérhetőségek: - Web: http://localhost:4200\
- Profile API: http://localhost:3000\
- Address API: http://localhost:3001

Leállítás:

docker compose down

------------------------------------------------------------------------

## Tesztek

Backend service-ek futtatása:

cd apps/profile-service\
npm test\
npm run test:e2e

cd ../address-service\
npm test\
npm run test:e2e

------------------------------------------------------------------------

## Playwright e2e tesztek

A `playwright/` mappában találhatóak az UI és API e2e tesztek.

Cucumber feature fájlokat használ, a megvalósítás Page Object Model
mintát követ.\
A locatorok a page osztályokban vannak, a step definíciók üzleti nyelven
írják le a lépéseket.\
Hibánál screenshot és HTML riport készül.

Futtatás:

cd playwright\
npm ci\
npx playwright install chromium --with-deps\
npm run test:e2e

------------------------------------------------------------------------

## Logolás

A service-ekben szintezett logolás van (info, warn, error).\
Hibák részletesebben naplózásra kerülnek, teszt környezetben a log zaj
csökkentett.

------------------------------------------------------------------------

## Load teszt

Készült egy egyszerű script, amely nagyobb mennyiségű (legalább 10.000)
student létrehozását és a cím lekérését végzi, és méri a teljes futási
időt.

Futtatás:

node load-test/run.mjs

------------------------------------------------------------------------

## Összegzés

A cél egy tiszta, jól átlátható, Dockerrel futtatható microservice
architektúra volt, frontenddel és automatizált tesztekkel.\
A rendszer lokálisan és CI környezetben is stabilan fut.
