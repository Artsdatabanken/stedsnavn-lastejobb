# stedsnavn-lastejobb

Laster stedsnavn fra sentralt stedsnavn register (SSR). Data brukes av [stedsnavn-api](https://github.com/Artsdatabanken/stedsnavn-api)

Utfila er ~25 MB, men likevel behøver man ca. 5 GB diskplass til prosessering.

## Komponenter og dataflyt

### Dataflyt

[![Dataflyt](https://github.com/Artsdatabanken/stedsnavn-lastejobb/raw/master/doc/dataflyt.png)](https://artsdatabanken.github.io/stedsnavn-lastejobb/)

### Tegnforklaring

| Symbol                                                                                                   | Forklaring               |
| -------------------------------------------------------------------------------------------------------- | ------------------------ |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/api_24.png)  | API (HTTP REST)          |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/data_24.png) | Åpne data                |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/kart_24.png) | Kart                     |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/last_24.png) | Lastejobb / Konvertering |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/lib_24.png)  | Bibliotek                |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/tool_24.png) | Verktøy                  |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/www_24.png)  | Web-side/applikasjon     |

## Kildedata

- [stedsnavn-ubehandlet](https://github.com/Artsdatabanken/stedsnavn-ubehandlet)
- [Produktspesifikasjon](https://register.geonorge.no/data/documents/Produktspesifikasjoner_Stedsnavn_v2_produktspesifikasjon-kartverket-stedsnavn-5_0_.pdf)

## Målfiler

### steder.json

Inneholder alle stedsnavn på følgende format

| Kolonner   | Beskrivelse                                       |
| ---------- | ------------------------------------------------- |
| Prioritet  | Bokstav fra A-N hvor N er viktigst (Navn på land) |
| Kategori   | Kategorisering i 3 nivå av hva navet beskriver    |
| Lengdegrad | Koordinat på desimalform EPSG:4326                |
| Breddegrad | Koordinat på desimalform EPSG:4326                |
| Navn       | Det primære stedsnavnet                           |

#### Eksempel

| Prioritet | Kategori | Breddegrad | Lengdegrad | Navn             |
| --------- | -------- | ---------- | ---------- | ---------------- |
| E         | 11       | 17.3354    | 68.30591   | Storberget       |
| D         | 14       | 17.32879   | 68.3137    | Erikelva         |
| E         | 2        | 15.01159   | 68.83431   | Bakkejordstabben |
| C         | 3        | 14.63289   | 68.54859   | Taen             |
| G         | 7        | 20.25671   | 69.6817    | Koppangen        |
| H         | 35       | 10.84147   | 60.64473   | Lensbygda        |

### steder_kategori.json

Inneholder oversettelse mellom kode og tallkode brukt i `steder.json`.

```json
  "items": [
    {
      "id": 29,
      "kode": "SN-S-F-F"
    },
    {
      "id": 251,
      "kode": "SN-S-F-H"
    },
    {
      "id": 30,
      "kode": "SN-S-F-S"
    },
    {
      "id": 40,
      "kode": "SN-S-F-HO"
    }
  ]
}
```

## Datakilde

Data lastes fra [Geonorge Stedsnavn](https://kartkatalog.geonorge.no/metadata/kartverket/stedsnavn/30caed2f-454e-44be-b5cc-26bb5c0110ca) i GML-format.

## Kataloger

- `stages/download`: Script for å laste ned eksterne datafiler til `temp/`
- `stages/transform`: Script som produserer resultatet og legger det i `build/`
- `build`: Filene som kommer ut av lastejobben
- `temp`: Temporær lagring av nedlastede data og mellomformater

## Bruk

### Installere

```bash
npm run install
```

Laster ned avhengige biblioteker til `node_modules`.

### Download

```bash
npm run download
```

Laster ned eksterne avhengigheter som lastejobben er avhengig av for å produsere sitt resultat i "transform". Denne kjører stegene som ligger i `stages/download`. Nedlastede data lagres som en konvensjon i katalog `data`.

### Transform

```bash
npm run transform
```

Bruker allerede nedlastede data til å produsere sitt resultat. Denne brukes gjerne mens man utvikler så man slipper å laste ned data hver gang, og kan også brukes uten at man har tilgang til nett sålenge man har gjort `download` først. Denne kjører stegene som ligger i `stages/transform`

Sluttproduktet av transform skrives som en konvensjon til katalogen `build`.

### Build

```bash
npm run build
```

Kjører hele lastejobben, først `download`, så `transform`.

### Deploy

```bash
npm run deploy
```

Tar filene fra `build`-katalogen som er produsert i `build` eller `transform` og publiserer disse offentlig slik at andre lastejobber eller konsumenter kan nå dem uten å kjøre lastejobben.

## Lage en ny lastejobb

Hvis du ønsker å sette opp en ny lastejobb er en enkel måte å gjøre det på å lage en ny katalog for så å be lastejobb-modulen initialisere. Den oppretter et nytt git repo, lager package.json med script for å kjøre lastejobben, README-fil og eksempelsteg.

```bash
$ mkdir minlastejobb && cd minlastejobb
$ npx lastejobb init
npx: installed 35 in 2.808s
  ℹlastejobb Initialiserer lastejobb +0ms
  ℹlastejobb Initialize Git repo +1ms
  ℹlastejobb Initialized empty Git repository in /home/b/minlastejobb/.git/ +7ms
  ℹlastejobb Initialize npm project +1ms
  ℹlastejobb Wrote to /home/b/minlastejobb/package.json: +163ms
  ℹlastejobb Installing library lastejobb +0ms
  ℹlastejobb + lastejobb@2.4.1 +2s
  ℹlastejobb added 35 packages from 37 contributors and audited 47 packages in 1.589s +1ms
  ℹlastejobb found 0 vulnerabilities +0ms
  ℹlastejobb Add scripts to package.json +0ms
  ℹlastejobb Create index.js +1ms
  ℹlastejobb Make directory stages +1ms
  ℹlastejobb Make directory stages/download +0ms
  ℹlastejobb Make directory stages/transform +1ms
  ℹlastejobb Create stages/download/10_sample.js +0ms
  ℹlastejobb Create stages/transform/10_sample.js +0ms
  ℹlastejobb Create README.md +1ms
```

## API

### Lastejobb API

```bash
const lastejobb = require('lastejobb')
```

| Funksjon             | Beskrivelse                                                  |
| -------------------- | ------------------------------------------------------------ |
| kjørLastejobberUnder | Kjører alle javascript i angitt katalog eller underkataloger |
| kjørLastejobb        | Kjører 1 enkelt lastejobb spesifisert med filnavn            |

### io

```bash
const {io} = require('lastejobb')
```

Funksjoner for å lese eller skrive til filer (typisk JSON, tekst eller binære filer)

Katalog for build output kan overstyres ved å sette environment variabel BUILD.

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/io.js

### http

```bash
const {http} = require('lastejobb')
```

Funksjoner for å lese JSON eller binære filer fra web.

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/http.js

### log

```bash
const {log} = require('lastejobb')
```

Slå på logging ved å sette environment variabel

- `export DEBUG=*` (Linux)
- `set DEBUG=*` (Windows)

Funksjoner for logging fra lastejobben

Se https://github.com/bjornreppen/log-less-fancy#readme
