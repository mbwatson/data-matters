const path = require('path')
const { formatDate } = require('./src/test/util')

const findScheduleStartDate = schedule => {
  const dates = schedule.blocks
    .reduce((dates, block) => [...dates, ...block.dates], [])
    .sort((d, e) => (new Date(d) < new Date(e) ? -1 : 1))
  return dates[0]
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  // create a `path` field on InstructorYaml nodes
  createFieldExtension({
    name: 'instructor_path',
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/instructors#${source.slug}`
        },
      }
    },
  })
  // create a `full_name` field on InstructorYaml nodes.
  createFieldExtension({
    name: 'full_name',
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `${source.first_name} ${source.last_name}`
        },
      }
    },
  })
  // create a `path` field on ScheduleYaml nodes
  createFieldExtension({
    name: 'schedule_path',
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/schedules/${source.slug}`
        },
      }
    },
  })
  // create a `path` field on CoursesYaml nodes
  createFieldExtension({
    name: 'course_path',
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          return `/courses/${source.slug}`
        },
      }
    },
  })
  // create a `start_date` field on ScheduleYaml nodes,
  // derived from the first block's dates field.
  createFieldExtension({
    name: 'schedule_start_date',
    extend(options, prevFieldConfig) {
      const today = new Date()
      return {
        resolve(source) {
          const thisBlocksDates = source.blocks
            .reduce((dates, block) => [...dates, ...block.dates], [])
            .sort((d, e) => (new Date(d) < new Date(e) ? -1 : 1))
          return new Date(thisBlocksDates[0]).toISOString()
        },
      }
    },
  })

  const typeDefs = [
    `type Class implements Node {
      course: CoursesYaml @link(by: "slug", from: "course")
      instructor: InstructorsYaml @link(by: "slug", from: "instructor")
    }`,
    `type Block implements Node {
      name: String!
      classes: [Class!]!
    }`,
    `type SchedulesYaml implements Node {
      blocks: [Block!]
      path: String! @schedule_path
      start_date: Date! @schedule_start_date @dateformat
    }`,
    `type InstructorsYaml implements Node {
      firstName: String! @proxy(from: "first_name")
      lastName: String! @proxy(from: "last_name")
      full_name: String @full_name
      path: String! @instructor_path
      url: String
    }`,
    `type CoursesYaml implements Node {
      path: String! @course_path
    }`,
  ]
  createTypes(typeDefs)
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Query: {
      allUpcomingSchedules: {
        type: [`SchedulesYaml`],
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
            type: `SchedulesYaml`,
          })
          return entries.filter(schedule => {
            const startDate = findScheduleStartDate(schedule)
            return new Date(startDate) > new Date()
          })
        },
      },
      allPastSchedules: {
        type: [`SchedulesYaml`],
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
            type: `SchedulesYaml`,
          })
          return entries.filter(schedule => {
            const startDate = findScheduleStartDate(schedule)
            return new Date(startDate) < new Date()
          })
        },
      },
    },
  }
  createResolvers(resolvers)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  // page templates
  const courseTemplate = path.resolve(`src/template-pages/course.js`)
  const scheduleTemplate = path.resolve(`src/template-pages/schedule.js`)

  // query content nodes necessary for page-creation.
  return graphql(
    `
      query ($limit: Int!) {
        courses: allCoursesYaml(limit: $limit) {
          nodes {
            path
            slug
          }
        }
        schedules: allSchedulesYaml(limit: $limit) {
          nodes {
            path
            slug
          }
        }
      }
    `,
    { limit: 25 }
  ) // note: use second function parameter to pass in query variables.
    .then(result => {
      if (result.errors) {
        throw result.errors
      }
      // 🎉 no errors! proceed to create pages...
      // course pages
      result.data.courses.nodes.forEach(node => {
        createPage({
          path: node.path, // note: path is required
          component: courseTemplate,
          context: { slug: node.slug },
        })
      })
      // schedule pages
      result.data.schedules.nodes.forEach(node => {
        createPage({
          path: node.path, // note: path is required
          component: scheduleTemplate,
          context: { slug: node.slug },
        })
      })
    })
}
