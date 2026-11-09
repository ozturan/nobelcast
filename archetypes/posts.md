{{- $b := .File.ContentBaseName -}}
{{- $in := hasPrefix $b "intron" -}}
{{- $ep := cond $in (printf "Intron%s" (strings.TrimPrefix "intron" $b)) $b -}}
{{- $pre := cond $in "Intron" (substr $b 0 3) -}}
{{- $bg := "333333" }}{{ $ink := "FFFFFF" -}}
{{- range where .Site.RegularPages "Section" "posts" }}{{ if hasPrefix .Params.episode $pre }}{{ $bg = .Params.bg }}{{ $ink = .Params.ink }}{{ end }}{{ end -}}
---
title: "{{ cond $in (printf "Intron %s" (strings.TrimPrefix "intron" $b)) $b }} - "
date: {{ .Date }}
draft: true
# youtube: video ID (youtube.com/watch?v= sonrasi)
youtube: ""
episode: "{{ $ep }}"
# audio: Spotify/anchor ses dosyasi linki
audio: ""
spotify: ""
duration: "00:00:00"
# poster: static/posters/{{ $ep }}.jpg (1280x720) ve static/posters/thumb/{{ $ep }}.jpg (320x180)
poster: "/posters/{{ $ep }}.jpg"
# chapters: bölüm içi başlıklar (isteğe bağlı), örn.
# chapters:
#   - { t: "0:00", title: "Giriş" }
#   - { t: "12:30", title: "Ödül ve tartışmalar" }
bg: "{{ $bg }}"
ink: "{{ $ink }}"
---
