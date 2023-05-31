const fs = require('fs')
const path = require('path')
const { faker } = require('@faker-js/faker')
const YAML = require('yaml')
const { emptyDirectory, formatDate } = require('./util')
const arg = require('arg')

const slugify = text => faker.helpers.slugify(text).toLowerCase()

// store incoming command line arguments
const args = arg({
  // types
  '--verbose': Boolean,
  '--pretend': Boolean,
  '--instructors': Number,
  '--courses': Number,
  '--schedules': Number,
  // aliases
  '-v': '--verbose',
  '-p': '--pretend',
  '-i': '--instructors',
  '-c': '--courses',
  '-s': '--schedules',
})
// ^ couldn't hurt to add a --help, -h flag.
// MODE defaults
// - VERBOSE=true : console.log the generator entities
// - WRITE_MODE=true : overwrite existing test data
let VERBOSE_MODE = false
let WRITE_MODE = true
// overwrite defaults as available
if (args['--verbose']) {
  VERBOSE_MODE = true
}
if (args['--pretend']) {
  WRITE_MODE = false
}
const COUNTS = {
  instructors: args['--instructors'] > 0 ? args['--instructors'] : 12,
  courses: args['--courses'] > 0 ? args['--courses'] : 15,
}
// ^ it feels like there's some tidying up/abstraction that could be done here.

// all test content resides in this directory.
const testContentPath = path.join('./src', 'test', 'content')
// specific content locations
const instructorsFilePath = path.join(testContentPath, 'instructors.yaml')
const coursesDirPath = path.join(testContentPath, 'courses')
const schedulesDirPath = path.join(testContentPath, 'schedules')

//

// instructors
function generateInstructor() {
  const first_name = faker.person.firstName()
  const last_name = faker.person.lastName()
  const slug = slugify(`${first_name} ${last_name}`)

  return {
    slug,
    first_name,
    last_name,
    url: faker.internet.url(),
    affiliation: faker.company.name(),
    bio: faker.lorem.paragraph(5),
  }
}

// courses
function generateCourse() {
  const title = faker.lorem.words(3)
  const slug = slugify(title)

  return {
    slug,
    title,
    description: faker.lorem.paragraph(5),
    prereqs: faker.lorem.paragraph(1),
  }
}

// class
function generateClass() {
  return {
    course: faker.helpers.arrayElement(courses).slug,
    instructor: faker.helpers.arrayElement(instructors).slug,
    location: `Room ${faker.location.buildingNumber()}`,
    meeting_url: faker.internet.url(),
  }
}

// schedules
function generateSchedule(start_date) {
  const name = `${faker.lorem.word()} ${start_date.getFullYear()}`
  const slug = slugify(name)
  const dates = [...Array(5).keys()].map(i => {
    let _date = new Date(start_date)
    _date.setDate(_date.getDate() + i)
    return formatDate(_date)
  })

  return {
    name: name,
    slug: slug,
    location: faker.location.streetAddress(),
    registration_url: faker.internet.url(),
    // this implementation is restricted to the usual
    // two-day, one-day, two-day, consecutive block structure.
    // it will take a bit of effort to mix up the block schedules
    // if that ever becomes necessary.
    blocks: [
      {
        name: faker.lorem.words(2),
        dates: [dates[0], dates[1]],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
      {
        name: faker.lorem.words(2),
        dates: [dates[2]],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
      {
        name: faker.lorem.words(2),
        dates: [dates[3], dates[4]],
        classes: faker.helpers.multiple(generateClass, { count: 5 }),
      },
    ],
  }
}

// generate instructors.
const instructors = faker.helpers.multiple(generateInstructor, {
  count: COUNTS.instructors,
})
// generate courses.
const courses = faker.helpers.multiple(generateCourse, {
  count: COUNTS.courses,
})
// generate schedules.
// first, we'll want to guarantee a few things about the dates
// that get generated to align with expectations client-side.
const futureDates = [
  // we'll want one in the _near_ future...
  faker.date.soon({ days: 60 }),
  // ...and some more a bit farther out.
  ...[...Array(2).keys()].map(_ => faker.date.future({ years: 2 })),
]
// we'll do the analogous thing for past dates:
const pastDates = [
  // one in the recent past...
  faker.date.past({ days: 60 }),
  // ...and a few more father back.
  ...[...Array(4).keys()].map(_ => faker.date.past({ years: 2 })),
]
// finally, we generate schedules with our dates.
const schedules = [...futureDates, ...pastDates].map(date =>
  generateSchedule(date)
)

VERBOSE_MODE &&
  console.log(
    'VERBOSE_MODE=true\n',
    JSON.stringify(
      {
        instructors,
        courses,
        schedules,
      },
      null,
      2
    )
  )
console.log(`
 | successfully wrote to ${testContentPath}:
 |   - ${instructors.length} instructors
 |   - ${courses.length} courses
 |   - ${schedules.length} schedules
`)

if (WRITE_MODE) {
  // let's ensure all the content locations exist before proceeding.
  ;[coursesDirPath, schedulesDirPath].forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
  })
  // cleanout
  emptyDirectory(testContentPath)
  // write new content
  fs.writeFileSync(instructorsFilePath, YAML.stringify(instructors, null, 2))
  courses.forEach(course => {
    courseFilePath = path.join(coursesDirPath, `${course.slug}.yaml`)
    fs.writeFileSync(courseFilePath, YAML.stringify(course, null, 2))
  })
  schedules.forEach(schedule => {
    scheduleFilePath = path.join(schedulesDirPath, `${schedule.slug}.yaml`)
    fs.writeFileSync(scheduleFilePath, YAML.stringify(schedule, null, 2))
  })
} else {
  console.log('WRITE_MODE=false: existing test data is preserved.')
}
