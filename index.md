<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

## Blog posts
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

## Find me here 
- [LinkedIn](https://www.linkedin.com/in/casper-dijkstra-30661897/)
- [Xpirit](https://xpirit.com/casper)
- [Github](https://github.com/cdijkstra)
