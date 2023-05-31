const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const { hasDistinctElements } = require('./util')

// determine which content directory to build the ui against.
const shouldUseTestContent = process.env.TEST_CONTENT
const realContentPath = path.join('./src', 'content')
const testContentPath = path.join('./src', 'test', 'content')
const contentPath = shouldUseTestContent ? testContentPath : realContentPath

// paths with specific content
const instructorsFilePath = path.join(testContentPath, 'instructors.yaml')
const coursesDirPath = path.join(testContentPath, 'courses')
const schedulesDirPath = path.join(testContentPath, 'schedules')

// the content
const coursesYaml = fs
  .readdirSync(coursesDirPath)
  .map(file => fs.readFileSync(path.join(coursesDirPath, file), 'utf8'))
const instructorsYaml = fs.readFileSync(instructorsFilePath, 'utf8')
const schedulesYaml = fs
  .readdirSync(schedulesDirPath)
  .map(file => fs.readFileSync(path.join(schedulesDirPath, file), 'utf8'))

/*
 * tests
 **/

test('course slugs should be unique', () => {
  const courseSlugs = coursesYaml.map(courseYaml => {
    return YAML.parse(courseYaml).slug
  }, [])
  expect(hasDistinctElements(courseSlugs)).toBe(true)
})

test('instructor slugs should be unique', () => {
  const instructorSlugs = YAML.parse(instructorsYaml).map(
    instructor => instructor.slug
  )
  expect(hasDistinctElements(instructorSlugs)).toBe(true)
})

test('schedule slugs should be unique', () => {
  const scheduleSlugs = schedulesYaml.map(scheduleYaml => {
    return YAML.parse(scheduleYaml).slug
  }, [])
  expect(hasDistinctElements(scheduleSlugs)).toBe(true)
})
