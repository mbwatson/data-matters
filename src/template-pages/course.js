import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import { Link } from '../components/link'
import { Markdown } from '../components/markdown'
import { Details } from '../components/details'

function CourseTemplate({ data }) {
  const { course, schedules } = data
  const today = new Date()
  const scheduleBuckets = schedules.nodes.reduce(
    (buckets, schedule) => {
      if (new Date(schedule.start_date) < today) {
        return {
          ...buckets,
          past: [...buckets.past, schedule].sort(
            (s, t) => new Date(s.start_date) - new Date(t.start_date)
          ),
        }
      }
      return {
        ...buckets,
        future: [...buckets.future, schedule].sort(
          (s, t) => new Date(s.start_date) - new Date(t.start_date)
        ),
      }
    },
    { past: [], future: [] }
  )

  return (
    <Fragment>
      <h1>{course.title}</h1>

      <Markdown>{course.description}</Markdown>

      <h2>Prerequisites</h2>
      <Markdown>{course.prereqs}</Markdown>

      <h2>Upcoming course offerings</h2>
      <ul>
        {scheduleBuckets.future.map(({ name, path }) => (
          <li key={`course-${course.title}--${name}`}>
            <Link to={path}>{name}</Link>
          </li>
        ))}
      </ul>

      <h2>Past course offerings</h2>
      <ul>
        {scheduleBuckets.past.reverse().map(({ name, path }) => (
          <li key={`course-${course.title}--${name}`}>
            <Link to={path}>{name}</Link>
          </li>
        ))}
      </ul>

      <Details title="data" data={data} />
    </Fragment>
  )
}

export default CourseTemplate

export const pageQuery = graphql`
  query ($slug: String) {
    course: coursesYaml(slug: { eq: $slug }) {
      id
      slug
      path
      title
      description
      prereqs
    }
    schedules: allSchedulesYaml(
      filter: {
        blocks: {
          elemMatch: {
            classes: { elemMatch: { course: { slug: { eq: $slug } } } }
          }
        }
      }
    ) {
      nodes {
        name
        path
        start_date
      }
    }
  }
`
