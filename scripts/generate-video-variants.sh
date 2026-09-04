#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <camera-source> <ghostwriter-source> <mirror-ai-source>" >&2
  exit 64
fi

camera_source=$1
ghostwriter_source=$2
mirror_source=$3
output_dir=static/media/v1/home

mkdir -p "$output_dir"

# Homepage variants are muted, metadata-free, yuv420p for broad playback support,
# and capped at the largest size the cards render. WebM is preferred; MP4 is the fallback.
ffmpeg -y -i "$camera_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=900:-2:flags=lanczos,fps=30' \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 -pix_fmt yuv420p \
  "$output_dir/camera-harness-preview.webm"

ffmpeg -y -i "$camera_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=900:-2:flags=lanczos,fps=30' \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart \
  "$output_dir/camera-harness-preview.mp4"

ffmpeg -y -i "$ghostwriter_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=1280:-2:flags=lanczos,fps=25' \
  -c:v libvpx-vp9 -crf 31 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 -pix_fmt yuv420p \
  "$output_dir/ghostwriter-preview.webm"

ffmpeg -y -i "$ghostwriter_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=1280:-2:flags=lanczos,fps=25' \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart \
  "$output_dir/ghostwriter-preview.mp4"

ffmpeg -y -i "$mirror_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=1280:-2:flags=lanczos,fps=30' \
  -c:v libvpx-vp9 -crf 31 -b:v 0 -deadline good -cpu-used 2 -row-mt 1 -pix_fmt yuv420p \
  "$output_dir/mirror-ai-preview.webm"

ffmpeg -y -i "$mirror_source" -map 0:v:0 -an -sn -dn -map_metadata -1 \
  -vf 'scale=1280:-2:flags=lanczos,fps=30' \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart \
  "$output_dir/mirror-ai-preview.mp4"
