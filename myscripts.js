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