import * as React from 'react'

export const Details = ({ title, data }) => {
  return (
    <details>
      <summary
        style={{
          cursor: 'pointer',
          backgroundColor: '#eee',
          padding: '0.5rem',
        }}
      >
        {title}
      </summary>
      <pre
        style={{
          backgroundColor: '#333',
          color: '#eee',
          padding: '1rem',
          margin: 0,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  )
}
