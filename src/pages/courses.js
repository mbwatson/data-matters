import React, { Fragment } from 'react'
import Seo from '../components/seo'
import { graphql } from 'gatsby'
import { Details } from '../components/details'
import { Link } from '../components/link'

const CoursesPage = ({ data }) => {
  const courses = data.courses.nodes.sort((c, d) =>
    c.title < d.title ? -1 : 1
  )

  return (
    <Fragment>
      <h1>course catalog</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={course.path}>{course.title}</Link>
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
export const Head = () => <Seo title="Courses" />

export default CoursesPage

export const query = graphql`
  {
    courses: allCoursesYaml {
      nodes {
        id
        path
        title
        description
        prereqs
      }
    }
  }
`
