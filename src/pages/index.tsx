import { withUrqlClient } from "next-urql"
import React from "react"
import { Navbar } from "../components/Navbar"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../util/createUrqlClient"

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <div>
      <Navbar/>
      Hello world
      {!data ? null : data.posts.map((p) => <div key={p.id}> {p.title} </div>)}
    </div>
  )
}
//don't server side render all the pages, server side render on pages with dynamic data
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
