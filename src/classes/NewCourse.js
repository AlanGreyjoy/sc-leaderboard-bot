const NewTime = require('./NewTime')

class NewCourse {
  constructor(name, description) {
    this.name = name
    this.description = description
    this.times = []
  }

  addTime(time) {
    this.times.push(new NewTime(time.start, time.end))
  }
}

module.exports = NewCourse
