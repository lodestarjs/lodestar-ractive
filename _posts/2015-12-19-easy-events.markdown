---
layout: post
title:  Easy Events
date:   2015-12-19 20:30:18
categories: example
---


<div class="panel">
  <div class="panel-heading">
    <h1 class="title text-center">{{ page.title }}</h1>
  </div>
  <div class="panel-body text-center clearfix">
    {%raw-%}
    <div class="row">
      <div class="col-sm-6">
        <div id="random-color" style="background-color: {{color || '#f2f2f2'}};"></div>
      </div>
      <div class="col-sm-6"><button class="button ghost-primary thicker stretch" on-click="randomColor">Click me!</button></div>
    </div>
    {%endraw-%}
  </div>
  <div class="panel-footer">
{% highlight javascript %}
{%raw-%}
router.createRoute({
  path: '/',
  controller: {

    actions: {
      randomColor: function() {
         this.set('color', "#" + Math.random().toString(16).slice(2, 8));
      }
    }

  },
  view: {
    el: '#target',
    template: '<div id="random-color" style="background-color: \{{color}};"></div><button on-click="randomColor">click me</button>'
  }
});
{%endraw-%}
{% endhighlight %}
  </div>
</div>