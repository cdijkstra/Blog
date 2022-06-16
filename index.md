<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

## Blog posts

<div class="posts">
  {% for post in site.posts %}
    <article class="post">
      <h1>
          <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
          <p class="post_date">{{ post.date | date: "%B %e, %Y" }}</p>
      </h1>
      <div class="entry" style = "position:fixed; left:80px; top:20px;">
        {{ post.excerpt }}
      </div>
    </article>
  {% endfor %}
</div>

## Find me here 
- [LinkedIn](https://www.linkedin.com/in/casper-dijkstra-30661897/)
- [Xpirit](https://xpirit.com/casper)
- [Github](https://github.com/cdijkstra)