#!/usr/bin/env bash

set -x

npx @squoosh/cli --mozjpeg '{quality: 75}' --resize '{width: 1080}' -d $1 $2

# Usage example: bin/optimize-images.sh  source/uploads/2021/07  ~/Downloads/Spiderman/\*.png
