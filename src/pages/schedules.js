import React, { Fragment } from 'react'
import Seo from '../components/seo'
import { graphql } from 'gatsby'
import { Details } from '../components/details'
import { Link } from '../components/link'

const SchedulesPage = ({ data }) => {
  const { allUpcomingSchedules, allPastSchedules } = data

  return (
    <Fragment>
      <h1>schedules</h1>

      <h2>upcoming</h2>
      <ul>
        {allUpcomingSchedules
          .sort((s, t) => (s.start_date < t.start_date ? -1 : 1))
          .map(schedule => (
            <li key={schedule.id}>
              <Link to={schedule.path}>{schedule.name}</Link>
            </li>
          ))}
      </ul>

      <h2>past</h2>
      <ul>
        {allPastSchedules
          .sort((s, t) => (s.start_date > t.start_date ? -1 : 1))
          .map(schedule => (
            <li key={schedule.id}>
              <Link to={schedule.path}>{schedule.name}</Link>
            </li>
          ))}
      </ul>

      <Details title="data" data={data} />
    </Fragment>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Schedules" />

export default SchedulesPage

export const query = graphql`
  {
    allUpcomingSchedules {
      id
      name
      path
      start_date(formatString: "YYYY-MM-DD")
    }
    allPastSchedules {
      id
      name
      path
      start_date(formatString: "YYYY-MM-DD")
    }
  }
`
