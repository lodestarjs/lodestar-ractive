---
layout: post
title:  Simple Todo MVC
date:   2015-12-19 20:34:18
categories: example
---

<div class="panel">
  <div class="panel-heading">
    <h1 class="title text-center"> {{ page.title}} </h1>
  </div>
  <div class="panel-body cloak text-center clearfix">
    {%raw-%}
      <div class="todo-list">
        <form on-submit="addTodo:{{todo.input}}">
          <input type="text" value="{{todo.input}}" placeholder="What do you have todo?" />
        </form>
        <ul class="clearfix {{#unless todo.items.length}} hide {{/unless}}">
          {{#each todo.items:i}}
            <li class="clearfix">
              <div class="col-xs-6 text-left">
                <span class="{{this.completed ? 'completed': ''}}">{{task}}</span>
              </div>
              <div class="col-xs-6 text-right">
                <button on-click="set(@keypath + '.completed', !completed)" class="button {{this.completed ? 'button-secondary': 'button-primary'}}">{{#if completed}}undo{{else}}complete{{/if}}</button>
                <button on-click="splice('todo.items', @index, 1)" class="button button-warn">delete</button>
              </div>
            </li>
          {{/each}}
        </ul>
        <strong class="text-center cloak">{{todo.items.length}} / {{todo.max}} </strong>
      </div>
    {%endraw-%}
  </div>
  <div class="panel-footer">

    <div class="tabbed-code">
      <ul class="tabs">
        <li><a href="#example-one" class="active" on-click="activeTab">HTML</a></li>
        <li><a href="#example-two" on-click="activeTab">JavaScript</a></li>
      </ul>
      <div class="code-wrap">
        <div id="example-one" class="active">
          <iframe src="{{ "/todo-mvc-example.html" | prepend: site.baseurl }}"></iframe>
        </div>
        <div id="example-two">
{% highlight javascript %}
router.createRoute({
  path: '/',
  controller: {

    actions: {
      addTodo: function ( event, inputVal ) {
        if ( inputVal.length && this.get('todo.items').length < this.get('todo.max') ) {
          this.push( 'todo.items', { task: inputVal } );
          this.set('todo.input', '');
        }
        event.original.preventDefault();
      }
    }

  },
  view: {
    el: '#main-page',
    data: { 'todo': { 'items': [], 'max': 5 } },
    template: document.querySelector('#todo').innerHTML
  }
});
{% endhighlight %}
        </div>
      </div>
    </div>
  </div>
</div>