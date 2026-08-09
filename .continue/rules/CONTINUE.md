# CONTINUE.md

## Project Overview

This repository contains a Node.js-based data ingestion and transformation pipeline for Norwegian place names (**stedsnavn**). It downloads source data from Geonorge SSR (Sentralt stedsnavnregister), enriches and transforms it, and produces build artifacts used by downstream consumers such as `stedsnavn-api` and a generic full-text lookup service.

### Key technologies
- **Node.js** with CommonJS modules
- **npm** for scripts and dependency management
- **@artsdatabanken/lastejobb** as the job/pipeline framework
- **oboe** for streaming JSON parsing of large GeoJSON files
- **xml2js** for parsing XSD/XML metadata
- **Shell utilities** such as `sort`, `unzip`, `scp`, and `ssh`
- **GDAL / ogr2ogr**, executed through the `lastejobb` Docker/GDAL helpers, for reprojection from source CRS to EPSG:4326
- **GitHub Actions** for CI/build/publish

### High-level architecture
The project follows a staged ETL-style workflow:
1. **Download stage** fetches raw upstream inputs into `temp/`
2. **Transform stage** unzips, reprojects, categorizes, converts, sorts, and enriches data into `build/`
3. **Deploy stage** publishes selected build artifacts to downstream systems

This is a data pipeline repository rather than an application server.

> Needs verification: exact operational deployment targets and whether all deployment scripts are still actively used, since both legacy Travis CI and GitHub Actions are present.

---

## Getting Started

### Prerequisites
Install or verify the following:
- **Node.js 18.x** recommended for CI parity (`.github/workflows/deploy.yml`)
- **npm**
- **Docker** or whatever runtime is required by `@artsdatabanken/lastejobb` GDAL helpers
- **unzip** command-line utility
- Standard Unix tools like **sort**, **scp**, and **ssh** for certain scripts
- Sufficient disk and memory for large-file processing
  - README notes the output is ~25 MB, but processing may require about **5 GB disk space**
  - `transform` uses `--max_old_space_size=28192`, suggesting high memory pressure on full runs
- On Windows, prefer **WSL**, since README notes path-length issues during download

### Installation
```bash
npm install
```

### Common commands
```bash
npm run download
npm run transform
npm run build
npm run fulltext
npm run deploy
```

### What each command does
- `npm run download` — fetches external source material into `temp/`
- `npm run transform` — processes downloaded data and writes outputs to `build/`
- `npm run build` — runs `download` then `transform`
- `npm run fulltext` — invokes the `stages/fulltext` pipeline entrypoint if present/configured by the framework
- `npm run deploy` — runs deployment-stage jobs

> Needs verification: `package.json` includes a `fulltext` script targeting `stages/fulltext`, but the repository listing does not show a `stages/fulltext/` directory. Confirm whether this is legacy or framework-dependent behavior.

### Running tests
There is currently **no real automated test suite** configured.

`npm test` intentionally fails with:
- `Error: no test specified`

Current validation is primarily through:
- successful completion of pipeline stages
- file presence checks in CI (`.github/workflows/filecheck.sh`)
- manual inspection of generated artifacts in `build/`

---

## Project Structure

### Main directories
- `stages/download/` — download jobs for upstream inputs
- `stages/transform/` — transformation and build-generation jobs
- `stages/deploy/` — deployment scripts/jobs
- `build/` — generated output artifacts committed or produced by the pipeline
- `temp/` — temporary and intermediate files; typically large and disposable
- `doc/` — architecture/dataflow documentation and source PDF spec
- `.github/workflows/` — CI/CD automation

### Important files
- `package.json` — scripts, runtime dependencies, and entrypoints
- `README.md` — Norwegian-language project overview and data-flow explanation
- `.github/workflows/deploy.yml` — primary GitHub Actions workflow for build and publication
- `.travis.yml` — legacy CI configuration; likely historical

### Key stage files and roles
#### Download stage
- `stages/download/stedsnavn.js`
  - Downloads the main Geonorge GML ZIP source as `stedsnavn.zip`
- `stages/download/ubehandlet.js`
  - Clones `Artsdatabanken/stedsnavn-ubehandlet` into `temp/stedsnavn-ubehandlet`
  - This repo appears to provide supplemental mapping/configuration data
- `stages/download/material-icons.js`
  - Clones Google Material Design icons into `temp/icons`

#### Transform stage
- `stages/transform/02_unzip.js`
  - Unzips downloaded source into `temp/`
- `stages/transform/05_reproject.js`
  - Uses GDAL/`ogr2ogr` via Docker helpers to convert source data to GeoJSON in EPSG:4326
- `stages/transform/10_inn_kategori.js`
  - Builds nested category structures from source feature properties
- `stages/transform/20_convert.js`
  - Streams GeoJSON features, filters/normalizes them, and writes intermediate place rows
- `stages/transform/25_steder_sort.sh`
  - Sorts output by place ID to minimize diffs
- `stages/transform/30_koder.js`
  - Generates code mappings (`kode2autor`, `autor2kode`) and `steder_kategori.json`
- `stages/transform/40_alle.js`
  - Parses XSD metadata from the supplemental repo to produce the full type hierarchy
- `stages/transform/45_type.js`
  - Assigns URLs and writes `build/type.json`
- `stages/transform/50_fulltextindex.js`
  - Builds newline-delimited JSON (`jsonl`) full-text lookup index from `steder.csv`
- `stages/transform/60_ikon.js`
  - Indexes available Material icons
- `stages/transform/70_ikon.js`
  - Maps categories to icons and copies SVGs into `build/ikon/`
- `stages/transform/kartfil.js`
  - Appears to be an ad hoc/debug helper and is effectively disabled via top-level `return`

#### Deploy stage
- `stages/deploy/staging.sh`
  - Copies generated artifacts to remote servers over `scp` and restarts a Dockerized service

### Important generated outputs
- `build/steder.csv` — primary place-name dataset for downstream consumers
- `build/steder_kategori.json` — category ID to code mapping
- `build/type.json` — type hierarchy and metadata
- `build/full-text-index-sted.jsonl` — full-text search index input
- `build/ikon/*.svg` — category icon assets

### Important configuration and documentation files
- `doc/Produktspesifikasjoner_Stedsnavn_v2_produktspesifikasjon-kartverket-stedsnavn-5_0_.pdf`
  - upstream product specification
- `doc/dataflyt.png`
  - visual data-flow diagram

---

## Development Workflow

### Coding style and conventions
Observed conventions from the codebase:
- CommonJS style (`require`, not ES modules)
- Stage scripts are small, single-purpose pipeline steps
- File names are prefixed numerically to enforce execution order within a stage
- Streaming is preferred for large datasets (`oboe`, `readline`) to reduce memory spikes
- Shell scripts are used when Unix tools are simpler than JS alternatives

There is **no visible ESLint or Prettier configuration**.

> Needs verification: whether there are team conventions not encoded in the repo.

### Testing approach
Since there is no formal unit/integration test suite, contributors should validate changes by:
1. Running the relevant stage(s)
2. Inspecting artifacts in `build/`
3. Checking for deterministic output ordering (`25_steder_sort.sh` helps here)
4. Reviewing diffs in generated files for unexpected changes
5. Verifying CI workflow success

Suggested practical validation after changes:
```bash
npm install
npm run download
npm run transform
```
Then inspect:
- `build/steder.csv`
- `build/steder_kategori.json`
- `build/type.json`
- `build/full-text-index-sted.jsonl`

### Build and deployment process
#### Local build
- `npm run build` runs the end-to-end local pipeline

#### CI/CD
GitHub Actions (`.github/workflows/deploy.yml`) currently appears to be the main automation path:
1. Checkout repository
2. Use Node 18.x
3. `npm install`
4. `npm update`
5. `npm run download`
6. `npm run transform`
7. Check expected files
8. Checkout destination repository `artsdatabanken/stedsnavn`
9. Run deployment script
10. Create release artifact
11. Post to Slack
12. Push generated updates to destination repo

#### Legacy CI
- `.travis.yml` is still present and likely historical
- Treat it as legacy unless team confirms otherwise

### Contribution guidance
When making changes:
- Preserve stage ordering and naming conventions
- Keep transformations deterministic where possible
- Be careful with large-file processing and memory usage
- Prefer incremental/local stage runs during development
- Avoid unnecessary changes to generated artifacts unless intentional
- Document assumptions when changing upstream mappings or category logic

---

## Key Concepts

### Domain terminology
- **Stedsnavn** — place names
- **SSR** — Sentralt stedsnavnregister, the upstream source domain
- **Navneobjekthovedgruppe / navneobjektgruppe / navneobjekttype** — hierarchical source classification fields used to derive internal category mappings
- **Viktighet / prioritet** — ranking/importance encoded as letters and used in search scoring
- **Autorkode** — source/authority code mapped into internal `SN-*` codes

### Core abstractions
- **Pipeline stage** — a folder of ordered job scripts
- **Temp data** — downloaded/intermediate artifacts stored in `temp/`
- **Build data** — finalized outputs stored in `build/`
- **Code mappings** — conversions between source terminology and internal compact codes
- **Type hierarchy** — metadata model for place categories/types and their parent relationships

### Design patterns in use
- **ETL pipeline** structure
- **Streaming processing** for large files
- **Generated reference data** from upstream schema and supplemental repositories
- **Deterministic sorting** to stabilize output diffs
- **Separation of raw/intermediate/final artifacts** via `temp/` and `build/`

---

## Common Tasks

### 1. Run the full pipeline locally
```bash
npm install
npm run build
```
Use this when you need a fresh end-to-end rebuild from upstream sources.

### 2. Re-run only transformation logic
```bash
npm run transform
```
Use this after code changes when the inputs in `temp/` are already present.

### 3. Refresh downloaded source material
```bash
npm run download
```
Use this when upstream source data or supplemental repositories may have changed.

### 4. Inspect generated outputs
After a successful run, check:
- `build/steder.csv`
- `build/steder_kategori.json`
- `build/type.json`
- `build/full-text-index-sted.jsonl`
- `build/ikon/`

### 5. Work on category/type mapping logic
Relevant files:
- `stages/transform/10_inn_kategori.js`
- `stages/transform/30_koder.js`
- `stages/transform/40_alle.js`
- `stages/transform/45_type.js`

Recommended workflow:
1. Update mapping logic
2. Run `npm run transform`
3. Review `build/steder_kategori.json` and `build/type.json`
4. Confirm downstream URLs and parent relationships still look correct

### 6. Work on search index generation
Relevant file:
- `stages/transform/50_fulltextindex.js`

Recommended workflow:
1. Modify scoring or output shape
2. Run `npm run transform`
3. Inspect `build/full-text-index-sted.jsonl`
4. Verify downstream consumer compatibility

### 7. Work on icon generation
Relevant files:
- `stages/download/material-icons.js`
- `stages/transform/60_ikon.js`
- `stages/transform/70_ikon.js`

Recommended workflow:
1. Refresh icons with `npm run download` if needed
2. Run `npm run transform`
3. Inspect `build/ikon/`

---

## Troubleshooting

### Windows path issues
README notes that generated download paths can be too long for Windows.
- Prefer running under **WSL**
- Or use a shorter workspace path

### Missing system tools
Some scripts rely on external tools:
- `unzip`
- `sort`
- `scp`
- `ssh`
- GDAL/`ogr2ogr` via Docker helpers

If a stage fails, verify these are available in your environment.

### Memory or disk problems
The pipeline processes large geospatial files.
- Ensure several GB of free disk space
- Ensure sufficient RAM / Node heap availability
- Avoid running multiple heavy jobs at once on constrained machines

### Reprojection failures
If `05_reproject.js` fails:
- verify Docker is running
- verify `@artsdatabanken/lastejobb` GDAL helpers are functioning in your environment
- verify the expected unzipped GML file exists in `temp/`

### Missing or unexpected outputs
If output files are absent or incomplete:
1. Confirm `npm run download` completed successfully
2. Confirm `temp/` contains the expected source files
3. Re-run `npm run transform`
4. Inspect intermediate files such as `temp/4326.geojson`
5. Review CI file checks for expected output names

### Fulltext script confusion
`package.json` defines a `fulltext` script, but the repository structure does not show a matching `stages/fulltext/` directory.
- Treat this as a likely legacy or incomplete configuration until verified

### Deployment script access errors
Deployment uses remote SSH/SCP targets and credentials not available to most local developers.
- Expect local deploy commands to fail without the correct environment and access
- Coordinate with maintainers before modifying deployment steps

### Debugging tips
- Compare generated file diffs before and after your change
- Run the smallest relevant stage instead of a full rebuild where possible
- Use `DEBUG=*` to enable verbose logging via the `lastejobb` logging stack
- Inspect `temp/` intermediates to identify where the pipeline first diverges

---

## References

### Internal repository references
- `README.md`
- `doc/dataflyt.png`
- `doc/Produktspesifikasjoner_Stedsnavn_v2_produktspesifikasjon-kartverket-stedsnavn-5_0_.pdf`
- `.github/workflows/deploy.yml`

### External references
- Geonorge Stedsnavn metadata/catalog entry:
  - https://kartkatalog.geonorge.no/metadata/kartverket/stedsnavn/30caed2f-454e-44be-b5cc-26bb5c0110ca
- Supplemental source repository:
  - https://github.com/Artsdatabanken/stedsnavn-ubehandlet
- Downstream API referenced by README:
  - https://github.com/Artsdatabanken/stedsnavn-api
- `@artsdatabanken/lastejobb` framework:
  - https://github.com/Artsdatabanken/lastejobb
- Google Material Design icons:
  - https://github.com/google/material-design-icons/

---

## Notes for Continue

This file is intended to give Continue enough project context to help with:
- understanding the stage-based ETL pipeline
- locating the right transformation step for a given change
- identifying generated outputs and downstream dependencies
- distinguishing source files from generated artifacts

For finer-grained guidance, consider adding additional `rules.md` files in subdirectories such as:
- `stages/download/`
- `stages/transform/`
- `stages/deploy/`
- `doc/`
