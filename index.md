<!-- <head>
{% if site.google_analytics and jekyll.environment == 'production' %}
{% include analytics.html %}
{% endif %}
</head> -->

<style>
  .blue-border {
    border-left:solid 4px lightblue; 
    padding-left:20px;
    border-top:dotted 4px darkcyan;
  }

  [class$="post"] {
    border-bottom:dotted 4px darkcyan;
  }

  img {
    max-width: 20%;
    height: auto;
    border-radius: 10%;
    opacity: 0.8;
  }

  p a {
    color: mediumseagreen;
  }

  p a:hover { 
    color: darkseagreen;
    transition: 0.2s
  }

  img:hover { 
    transform: scale(1.05) rotate(5deg) translate(20px, 0px);
  }

  .change-color {
    font: 22px Arial;
    display: inline-block;
    padding: 1em 2em;
    text-align: center;
    color: white;
    background: red; /* default color */

    /* "to left" / "to right" - affects initial color */
    background: linear-gradient(to left, salmon 50%, lightblue 50%) right;
    background-size: 200%;
    transition: .5s ease-out;
  }
  .change-color:hover {
    background-position: left;
  }

  .change-color2 {
    color: #31302B;
    background: #FFF;
    padding: 12px 17px;
    margin: 25px;
    font-family: 'OpenSansBold', sans-serif;
    border: 3px solid #31302B;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: 2px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    box-shadow: inset 0 0 0 0 #31302B;
    -webkit-transition: all ease 0.8s;
    -moz-transition: all ease 0.8s;
    transition: all ease 0.8s;
  }
  .change-color2:hover {
    box-shadow: inset 100px 0 0 0 #e0e0e0;
    color: #fff;
  }
</style>

<div class="change-color">Blog posts</div>
<div class="change-color2">Blog posts</div>

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
- [Github](https://github.com/cdijkstra)