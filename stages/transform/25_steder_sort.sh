#!/bin/bash
set -e

# Sort by id to minimize our diffs
sort --field-separator=' ' -n --key=1 temp/steder.csv > build/steder.csv