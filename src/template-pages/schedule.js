import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import { Details } from '../components/details'
import { Link } from '../components/link'

const Block = block => {
  return (
    <div>
      <h2>Block: {block.name}</h2>

      <p>{block.dates.join(', ')}</p>

      <ul>
        {block.classes.map((c, index) => (
          <li key={`class-${index}`}>
            <Link to={c.course.path}>{c.course.title}</Link>
            &nbsp; (<Link to={c.instructor.path}>{c.instructor.full_name}</Link>
            )
          </li>
        ))}
      </ul>
    </div>
  )
}

function ScheduleTemplate({ data }) {
  const { schedule } = data

  return (
    <Fragment>
      <Link to="/schedules">back to all schedules</Link>
      <h1>{schedule.name}</h1>

      <p>Location: {schedule.location}</p>

      <Link to={schedule.registration_url}>Register</Link>

      {schedule.blocks.map((block, index) => (
        <Block key={`block-${index}`} {...block} />
      ))}

      <Details title="data" data={data} />
    </Fragment>
  )
}

export default ScheduleTemplate

export const pageQuery = graphql`
  query ($slug: String) {
    schedule: schedulesYaml(slug: { eq: $slug }) {
      name
      location
      registration_url
      blocks {
        name
        dates(formatString: "YYYY-MM-DD")
        classes {
          course {
            title
            path
          }
          instructor {
            full_name
            path
          }
        }
      }
    }
  }
`
