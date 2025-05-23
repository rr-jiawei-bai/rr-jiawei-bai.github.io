#!/bin/bash
title="$1"
date=$(date +%Y-%m-%d)
filename="_posts/${date}-$(echo "$title" | tr ' ' '-').md"
cat <<EOF > "$filename"
---
layout: post
title: "$title"
date: ${date} 20:00:00
categories: 
tags: 
---
EOF
echo "文章已创建：$filename"