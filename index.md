---
layout: default
title: "Commits"
---

<div class='main_page'>
  <h2>History of commits</h2>

  <ul>
  {% for post in site.posts %}
    <li><a href="/documentation/{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
<div>