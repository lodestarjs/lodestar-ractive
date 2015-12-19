---
layout: post
title:  Get HTML from other pages
date:   2015-12-19 20:25:18
categories: example
---


<div class="panel">
  <div class="panel-heading">
    <h1 class="title text-center">{{ page.title }}</h1>
  </div>
  <div class="panel-body text-center">
    <div>This will pull in content without reloading the page.</div>
    <a href="{{ "/load-example" | prepend: site.baseurl }}">To the example!</a>
  </div>
  <div class="panel-footer">
{% highlight javascript %}
{%raw-%}
router.createRoute({
  path: '/example',
  controller: function() { },
  view: {
    el: '#target',
    template: {
      url: '/lodestar-ractive/example',
      container: 'main',
      notOnSame: true // Makes sure not to execute the request when on the page already
    }
  }
});
{%endraw-%}
{% endhighlight %}
  </div>
</div>