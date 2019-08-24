# deploy full-text-index
scp build/full-text-index-sted.json grunnkart@hydra:/dockerdata/generic-substring-lookup-api/full-text-index-sted.json
ssh grunnkart@hydra docker restart generic-substring-lookup-api
