const React = require('react')
const { Layout } = require('./src/components/layout')

// wraps every page in ur Layout component
exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}
