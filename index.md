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
    border-bottom:dotted 8px darkcyan;
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

  .tag-filter {
    margin-bottom: 20px;
  }

  .tag-filter__button {
    padding: 10px 15px;
    margin-right: 10px;
    background-color: #f1f1f1;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
  }

  .tag-filter__button.active {
    background-color: #333;
    color: #fff;
  }

  .tags
  {
    color: midnightblue
  }
</style>

<div class="change-color">Blog posts</div>

<!-- The buttons don't work correctly yet... -->
<!-- <div class="tag-filter">
  <button class="tag-filter__button active" data-filter="all">All</button>
  <button class="tag-filter__button" data-filter="cloud">Cloud</button>
  <button class="tag-filter__button" data-filter="csharp">C#</button>
  <button class="tag-filter__button" data-filter="devops">DevOps</button>
</div> -->

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

<footer>
<p>Find me here</p> 
- [LinkedIn](https://www.linkedin.com/in/casper-dijkstra-30661897/)
- [Github](https://github.com/cdijkstra)
</footer>

<script>
// Add event listener to tag buttons
const tagButtons = document.querySelectorAll('.tag-filter__button');
const blogPosts = document.querySelectorAll('.post');

tagButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all buttons
    tagButtons.forEach((btn) => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    // Filter the blog posts based on the selected tag
    blogPosts.forEach((post) => {
      if (filter === 'all' || post.getAttribute('data-tags').includes(filter)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  });
});
</script>