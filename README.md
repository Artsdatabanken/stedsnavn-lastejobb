# Lastejobb for stedsnavn

Laster stedsnavn fra sentralt stedsnavn register (SSR). Data brukes av [stedsnavn-api](https://github.com/Artsdatabanken/stedsnavn-api)

Utfila er mindre enn 50MB, men likevel behøver man ca. 5 GB diskplass til prosessering.

## Målfiler

### steder.json

Inneholder alle stedsnavn.

```
E11 17.3354  68.30591  Storberget
D14 17.32879  68.3137  Erikelva
E2 15.01159  68.83431  Bakkejordstabben
C3 14.63289  68.54859  Taen
G7 20.25671  69.6817  Koppangen
H35 10.84147  60.64473  Lensbygda

```

### kategori.json

Inneholder oversettelse fra kategoritekst til tallkode bruker i steder.json.

```json
{
  "ferskvann_ferskvannskontur_nes": 61,
  "ferskvann_ferskvannskontur_øy": 73,
  "ferskvann_ferskvannskontur_øygruppe": 179,
  "ferskvann_ferskvannskontur_strand": 88,
  "ferskvann_grunnerIFerskvann_banke": 204,
  "ferskvann_grunnerIFerskvann_grunne": 131,
  "ferskvann_rennendeVann_bekk": 2,
  "ferskvann_rennendeVann_elv": 40,
  "markslag_dyrkamark_eng": 45,
  "markslag_isOgPermafrost_isbre": 103,
  "terreng_høyder_hei": 14,
  "terreng_senkninger_søkk": 55,
  "terreng_skråninger_bakke": 16,
  ".....": 999
}
```

## Datakilde

Data lastes fra [Geonorge Stedsnavn](https://kartkatalog.geonorge.no/metadata/kartverket/stedsnavn/30caed2f-454e-44be-b5cc-26bb5c0110ca) i GML-format.
