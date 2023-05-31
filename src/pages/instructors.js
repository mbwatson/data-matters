import React, { Fragment } from 'react'
import { graphql } from 'gatsby'
import Seo from '../components/seo'
import { Details } from '../components/details'
import { Link } from '../components/link'

const InstructorsPage = ({ data }) => {
  const instructors = data.instructors.nodes

  return (
    <Fragment>
      <h1>instructors</h1>

      {instructors.map(instructor => (
        <div id={instructor.slug} key={instructor.id}>
          <h2 style={{ margin: 0 }}>{instructor.full_name}</h2>
          <div>
            {instructor.affiliation}
            {instructor.url && (
              <Fragment>
                &nbsp;|&nbsp;<Link to={instructor.url}>website</Link>
              </Fragment>
            )}
          </div>
          <p>{instructor.bio}</p>
        </div>
      ))}

      <Details title="data" data={data} />
    </Fragment>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Instructors" />

export default InstructorsPage

export const query = graphql`
  {
    instructors: allInstructorsYaml {
      nodes {
        id
        slug
        full_name
        url
        bio
        affiliation
      }
    }
  }
`
