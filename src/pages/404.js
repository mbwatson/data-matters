import React, { Fragment } from 'react'
import Seo from '../components/seo'

const NotFoundPage = () => (
  <Fragment>
    <h1>404: Not Found</h1>
    <p>You look lost :(</p>
  </Fragment>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
