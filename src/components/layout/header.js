import * as React from 'react'
import { Link } from '../link'

const Header = ({ siteTitle }) => (
  <header
    style={{
      display: 'flex',
      gap: '1rem',
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      borderBottom: '1px solid #333',
    }}
  >
    <Link to="/">{siteTitle}</Link>
    <Link to="/courses">Course Catalog</Link>
    <Link to="/instructors">Instructors</Link>
    <Link to="/schedules">Schedules</Link>
  </header>
)

export default Header
