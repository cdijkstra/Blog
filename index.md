<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

<div class="blue-border">
  {% for post in site.posts %}
    <article class="post">
      <h1>
        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
      </h1>
      <div class="entry">
        {{ post.excerpt }}
      </div>
      <picture>
        <img src="{{ site.baseurl }}/images/{{ post.image }}">
      </picture>
      <h4 class=tags>
        Tags: 
        {% for tag in post.tags %}
          {{ tag }}
        {% endfor %}
      </h4>   
      <p class="right"><a href="{{ site.baseurl }}{{ post.url }}">Read more</a></p>
      <h4>
        <p class="post_date">{{ post.date | date: "%B %e, %Y" }}</p>
      </h4>
    </article>
  {% endfor %}
</div>

## Find me here
- [LinkedIn](https://www.linkedin.com/in/casper-dijkstra-30661897/)
- [Github](https://github.com/cdijkstra)

<script src="myscripts.js"></script>