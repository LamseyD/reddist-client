import { Stack } from "@chakra-ui/layout";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import { Post } from "../components/Post";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as string | null })
  const [{ data, fetching }] = usePostsQuery({
    variables
  });
  if (!fetching && !data) {
    console.log("Something went wrong", data);
    return <div> Something went wrong. </div>
  }

  return (
    <Layout>
      {(!data && fetching) ? <Spinner /> :
        <Stack spacing={8} mb={4}>
          {data!.posts.posts.map((p) => {
            return <Post post={p}/>
          })}
        </Stack>
      }
      {data && data.posts.hasMore ? <Flex>
        <Button onClick={() => {
          setVariables({
            ...variables,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt, //set the cursor to be the last post createdAt and then request more from backend
          });
        }} mx="auto" my={8} isLoading={fetching}> Load more... </Button>
      </Flex> : null}
    </Layout>
  )
}
//don't server side render all the pages, server side render on pages with dynamic data
export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
