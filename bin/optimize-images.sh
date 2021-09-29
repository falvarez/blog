#!/usr/bin/env bash

set -x

npx @squoosh/cli --mozjpeg '{quality: 75}' --resize '{width: 1920}' -d $1 $2

# Usage example: bin/optimize-images.sh  source/uploads/2021/06  ~/Downloads/Spiderman/\*.png
