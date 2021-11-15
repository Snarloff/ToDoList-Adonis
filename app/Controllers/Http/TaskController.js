'use strict'

const Task = use('App/Models/Task')
const { validateAll } = use('Validator')
const slugify = require('slugify')

class TaskController {

  constructor(){

    this.messages =  {
      'title.required': 'This field is required!',
      'title.min': 'Field with at least 5 characters!',
      'title.max': 'Field with a maximum of 5 characters!',
      'body.required': 'This field is required!',
      'body.min': 'Field with at least 10 characters!',
      'body.max': 'Field with a maximum of 1040 characters!'
    }

  }

  async index({ view }) {

    const tasks = await Task.all()
    return view.render('tasks', { tasks: tasks.toJSON() })

  }

  async store({ request, response, session }) {

    const validation = await validateAll(request.all(), {
      title: 'required|min:5|max:140',
      body: 'required|min:10|max:1040'
    }, this.messages)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const data = request.only(['title', 'body'])

    await Task.create({slug: slugify(data.title).toLowerCase(), ...data})

    session.flash({ notification: 'Task added!' })
    return response.redirect('/tasks')

  }

  async detail({ params, view }) {

    const task = await Task.findBy('slug', params.slug)
    return view.render('details', { task })

  }

  async remove({ params, response, session }) {

    const task = await Task.findBy('slug', params.slug)
    await task.delete()

    session.flash({ notification: 'Task removed!' })
    return response.redirect('/tasks')

  }

  async edit({ view, params }) {

    const task = await Task.findBy('slug', params.slug)
    return view.render('edit', { task })

  }

  async update({ params, request, response, session }) {

    const validation = await validateAll(request.all(), {
      title: 'required|min:5|max:140',
      body: 'required|min:10|max:1040'
    }, this.messages)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const data = request.only(['title', 'body'])
    const task = await Task.findBy('slug', params.slug)

    if (task != undefined) {

      await Task.query().where('slug', params.slug).update({slug: slugify(data.title).toLowerCase(), ...data})
      session.flash({ notification: 'Task eddited!' })
      return response.redirect('/tasks')

    }

  }

}

module.exports = TaskController
