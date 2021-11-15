'use strict'

const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {

  async register({ response, request, session }) {

    const messages = {
      'username.required': 'This field is required!',
      'username.min': 'Field with at least 5 characters!',
      'username.max': 'Field with a maximum of 50 characters!',
      'email.required': 'This field is required!',
      'email.min': 'Field with at least 5 characters!',
      'email.max': 'Field with a maximum of 150 characters!',
      'password.required': 'This field is required!',
      'password.min': 'Field with at least 6 characters!',
      'password.max': 'Field with a maximum of 100 characters!',
      'repeat_password.required': 'This field is required!',
      'repeat_password.min': 'Field with at least 6 characters!',
      'repeat_password.max': 'Field with a maximum of 100 characters!',
    }

    const { username, email, password, repeat_password } = request.all()

    if (password != repeat_password) {
      session.withErrors({ repeat_password: 'Password does not match with repeat password field.' }).flashAll()
      return response.redirect('back')
    }

    const validation = await validateAll(request.all(), {
      username: 'required|min:5|max:50',
      email: 'required|min:5|max:150',
      password: 'required|min:6|max:100',
      repeat_password: 'required|min:6|max:100'
    }, messages)

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    await User.create({ username, email, password })
    return response.redirect('/login')

  }

  async login({ request }) {

  }


}

module.exports = UserController
