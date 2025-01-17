#!/usr/bin/env bash

#set -x

# npx @squoosh/cli --mozjpeg '{quality: 75}' --resize '{width: 1920}' -d $1 $2

# Usage example: bin/optimize-images.sh  source/uploads/2021/06  ~/Downloads/Spiderman/\*.png

# Check for correct usage
if [[ $# -ne 3 ]]; then
    echo "Usage: $0 <source_directory> <destination_directory> <max_dimension>"
    exit 1
fi

SOURCE_DIR="$1"
DEST_DIR="$2"
MAX_DIMENSION="$3"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Loop through all files in the source directory
for file in "$SOURCE_DIR"/*; do
    if [[ -f "$file" ]]; then
        base_name=$(basename "$file" | cut -d. -f1)
        sips -s format jpeg -Z "$MAX_DIMENSION" "$file" --out "$DEST_DIR/${base_name}.jpg"
    fi
done

echo "Conversion and resizing complete. Files saved to $DEST_DIR"