import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from './link'

// this object defines a map: DOM elements --> React components,
// which allows us to streamline styles for incoming content.
const componentMap = {
  // for links, we'll use our smart link component.
  a: ({ href, ...props }) => <Link to={href} {...props} />,
}

export const Markdown = props => {
  return (
    <ReactMarkdown
      {...props}
      components={componentMap}
      remarkPlugins={[remarkGfm]}
    />
  )
}
