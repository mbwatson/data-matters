import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import Seo from '../components/seo'
import { Link } from '../components/link'
import { Details } from '../components/details'

const HomePage = ({ data }) => {
  const schedules = data.schedules.nodes
  const today = new Date()
  // select only the schedules starting in the near future,
  const upcomingSchedules = schedules
    // say, between now and 90 days from now.
    .filter(schedule => {
      const dateOffset = new Date(schedule.start_date) - today
      return 0 < dateOffset && dateOffset < 90 * (24 * 60 * 60 * 1000)
    })
    .sort((s, t) => new Date(s.start_date) - new Date(t.start_date))

  return (
    <Fragment>
      <h1>home</h1>

      <h2>a section</h2>
      <p>
        Culpa pariatur consectetur irure deserunt labore occaecat aliqua enim
        velit irure velit dolore quis ea dolore esse. Laboris est sint ex
        proident nisi esse non dolore id fugiat dolore ut duis magna culpa
        dolore. Lorem ipsum aliquip incididunt enim irure excepteur pariatur ea
        commodo et id nulla officia tempor ad nulla pariatur dolor aliquip.
      </p>

      <h2>upcoming schedules</h2>

      <p>
        there's still time to enroll Consequat ea proident fugiat pariatur magna
        id sit deserunt amet in aute occaecat amet ut.
      </p>

      {upcomingSchedules.map(schedule => (
        <p key={schedule.id}>
          <strong>{schedule.name}</strong> ({schedule.start_date})<br />
          <Link to={schedule.path}>Details</Link> |{' '}
          <Link to={schedule.registration_url}>Register</Link>
        </p>
      ))}
      <Link to="/schedules">view all schedules</Link>

      <h2>another section</h2>
      <p>
        Lorem ipsum commodo et elit incididunt do aute pariatur irure deserunt
        in duis. Incididunt cillum dolor qui eiusmod magna amet cupidatat
        adipisicing tempor do cillum dolor incididunt magna aliqua. Ut eiusmod
        est est ex ullamco deserunt cupidatat duis occaecat aliqua id esse. Esse
        proident velit nostrud duis qui voluptate aliquip cillum enim. Ut labore
        excepteur dolore dolor do ad ad anim sint non ad labore aute deserunt
        magna incididunt reprehenderit. Sint eu voluptate in ullamco ea anim
        cupidatat magna fugiat aliquip ut duis esse elit consectetur
        reprehenderit nostrud.
      </p>

      <Details title="data" data={data} />
    </Fragment>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Welcome!" />

export default HomePage

export const query = graphql`
  {
    schedules: allSchedulesYaml {
      nodes {
        id
        name
        path
        start_date(formatString: "YYYY-MM-DD")
        registration_url
        blocks {
          dates
        }
      }
    }
  }
`
