# Lastejobb for stedsnavn

Laster stedsnavn fra sentralt stedsnavn register (SSR). Data brukes av [stedsnavn-api](https://github.com/Artsdatabanken/stedsnavn-api)

Utfila er ~25 MB, men likevel behøver man ca. 5 GB diskplass til prosessering.

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

- `stages/download`: Script for å laste ned eksterne datafiler til `data/`
- `stages/transform`: Script som produserer resultatet og legger det i `build/`
- `build`: Filene som kommer ut av lastejobben
- `data`: Temporær lagring av nedlastede data og mellomformater

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

Tar filene fra `build`-katalogen som er produsert i `build` eller `tranform` og publiserer disse offentlig slik at andre lastejobber eller konsumenter kan nå dem uten å kjøre lastejobben.
