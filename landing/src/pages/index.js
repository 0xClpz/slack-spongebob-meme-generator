import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import axios from "axios"

const AddToSlack = () => {
  const [stats, setStats] = useState({
    memes: 0,
    teams: 0,
  })

  useEffect(() => {
    axios
      .get(`https://798vx7fgrd.execute-api.us-east-1.amazonaws.com/dev/stats`)
      .then(({ data }) => setStats(data))
  }, [])

  return (
    <>
      <p>
        Installed in {stats.teams} workspaces - {stats.memes} memes created
      </p>
      <a href="https://slack.com/oauth/authorize?scope=commands,bot&client_id=977747011076.980065613159">
        <img
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
      <img
        src={
          "https://cdn.mobilesyrup.com/wp-content/uploads/2019/01/mocking-spongebob.jpg"
        }
      />
      <hr />
      <p>
        Built with ❤️ by <a href="https://twitter.com/0xclpz">0xClpz</a>
      </p>
      <p>
        Source:{" "}
        <a href={"https://github.com/0xClpz/slack-spongebob-meme-generator"}>
          0xClpz/slack-spongebob-meme-generator
        </a>
      </p>
    </>
  )
}

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <AddToSlack />
  </Layout>
)

export default IndexPage
