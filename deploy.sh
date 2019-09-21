# deploy full-text-index
scp build/full-text-index-sted.json grunnkart@hydra:/dockerdata/generic-substring-lookup-api/full-text-index-sted.json
scp build/steder.json grunnkart@hydra:/dockerdata/stedsnavn-api/
scp build/steder_kategori.json grunnkart@hydra:/dockerdata/stedsnavn-api/
ssh grunnkart@hydra docker restart generic-substring-lookup-api

#cp build/ikon/* ~/src/adb/bilder/bilder-lastejobb/bilder-lastejobb/data/logo/
