<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

<style>
  .blue-border {border-left:solid 4px lightblue; padding-left:20px border-top:inset 4px darkcyan;}

  [class$="post"] {
    border-bottom:dotted 4px darkcyan;
  }

  img {
    max-width: 20%;
    height: auto;
    border-radius: 10%;
    opacity: 0.8;
  }

  a:hover { color: hotpink }

  img:hover { transform: scale(1.3) rotate(5deg); }
</style>

## Blog posts

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
      <p class="right"><a href="{{ site.baseurl }}{{ post.url }}">Read more</a></p>
      <h4>
        <p class="post_date">{{ post.date | date: "%B %e, %Y" }}</p>
      </h4>
    </article>
  {% endfor %}
</div>

## Find me here 
- [LinkedIn](https://www.linkedin.com/in/casper-dijkstra-30661897/)
- [Xpirit](https://xpirit.com/casper)
- [Github](https://github.com/cdijkstra)