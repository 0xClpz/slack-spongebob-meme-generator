/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"

import "./layout.css"

import styled from 'styled-components'

const Title = styled.h1`

`

const Layout = ({ children }) => {
  return (
    <>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        <Title>Mocking spongebob meme generator for Slack</Title>
        <main>{children}</main>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
