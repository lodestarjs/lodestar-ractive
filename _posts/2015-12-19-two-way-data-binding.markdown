---
layout: post
title:  Two way data-binding
date:   2015-12-19 20:35:18
categories: example
---


<div class="panel">
  <div class="panel-heading">
    <h1 class="title text-center">{{ page.title }}</h1>
  </div>
  <div class="panel-body text-center clearfix cloak">
    {%raw-%}
      <div class="row">
        <div class="col-sm-6">
          <input type="text" class="input stretch" placeholder="Enter a name" value="{{fullName}}">
        </div>
        <div class="col-sm-6">
          Hi my name is {{fullName}}, and I find this is so simple!
        </div>
        {{#if fullName.toLowerCase() === 'great scott!'}}
          <div class="col-xs-12 {{#if !fullName}} hide {{/if}}">
            <img src="/lodestar-ractive/assets/images/great-scott.gif"/>
          </div>
          <div class="col-xs-12 {{#if !fullName}} hide {{/if}}">
            <strong>Great Scott! I've been found...</strong>
          </div>
        {{/if}}
      </div>
    {%endraw-%}
  </div>
  <div class="panel-footer">
{% highlight javascript %}
{%raw-%}
router.createRoute({
  path: '/',
  controller: { },
  view: {
    el: '#target',
    template: '<input type="text" value="\{{fullName}}"/> Hi my name is \{{fullName}}, and I find this is so simple!'
  }
});
{%endraw-%}
{% endhighlight %}
  </div>
</div>
