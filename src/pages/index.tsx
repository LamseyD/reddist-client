import { Link } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <Layout>
      <NextLink href="/createPost">
        <Link> Create Post </Link>
      </NextLink>
      {!data ? <Spinner /> : data.posts.map((p) => <div key={p.id}> {p.title} </div>)}
    </Layout>
  )
}
//don't server side render all the pages, server side render on pages with dynamic data
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
