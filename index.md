<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

<style>
  .blue-border {border-left:solid 4px lightblue; padding-left:20px; border-top:dotted 4px darkcyan;}
</style>

<style>
[class$="post"] {
  border-bottom:dotted 4px darkcyan;
}
</style>

## Blog posts

<div class="blue-border">
  {% for post in site.posts %}
    <article class="post">
      <h1>
        <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a>
      </h1>
      <picture>
        <img src="/assets/images/{{ post.image }}.png" style="width:auto;">
      </picture>
      <div class="entry">
        {{ post.excerpt }}
      </div>
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