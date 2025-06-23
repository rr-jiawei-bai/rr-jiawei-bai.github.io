#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: $0 <title> [subtitle] [author] [tags(逗号分隔)]"
  exit 1
fi

if [ ! -f "_config.yml" ]; then
  echo "This script must be run from the root of a Jekyll site."
  exit 1
fi

title="$1"
subtitle="$2"
author="$3"
tags="$4"
date=$(date "+%Y-%m-%d %H:%M:%S")
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
filename="_posts/$(date +%Y-%m-%d)-${slug}.md"

mkdir -p _posts

if [ -f "$filename" ]; then
  echo "Error: $filename already exists."
  exit 1
fi

cat <<EOF > "$filename"
---
layout: post
title: "$title"
subtitle: "${subtitle}"
date: ${date}
author: "${author}"
header-img: ""
catalog: true
tags:
$(for tag in $(echo $tags | tr ',' ' '); do echo "  - $tag"; done)
---
EOF

echo "文章已创建：$filename"