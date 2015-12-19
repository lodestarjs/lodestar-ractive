---
layout: post
title:  Simple Hierarchy with built-in "caching"
date:   2015-12-19 20:20:18
categories: example
---


<div class="panel">
  <div class="panel-heading">
    <h1 class="title text-center">{{ page.title }}</h1>
  </div>
  <div class="panel-body">
{% highlight javascript %}
{%raw-%}
router.createRoute({
  path: '/',
  controller: function() {
    console.log('This is the index page.');
  }
});

router.createRoute({
  path: '[/]blog',
  controller: function() {
    console.log('This is the child of that ^ index page.');
  }
});
{%endraw-%}
{% endhighlight %}
  </div>
</div>