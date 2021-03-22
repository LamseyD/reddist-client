import { Box, Heading, Stack, Text } from "@chakra-ui/layout";
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({limit: 10, cursor: null as string | null})
  const [{data, fetching}] = usePostsQuery({
    variables
  });
  
  if (!fetching && !data){
    console.log("Something went wrong", data);
    return <div> Something went wrong. </div>
  }
  
  return (
    <Layout>
      <Flex>
        <Heading> New Posts </Heading>
        <NextLink href="/createPost">
          <Button ml="auto" mb={4}> Create Post </Button>
        </NextLink>
      </Flex>
      {(!data && fetching) ? <Spinner /> : 
        <Stack spacing={8} mb = {4}> 
          {data!.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px"> 
              <Heading fontSize="xl"> {p.title} </Heading> 
              <Text mt={4}> {p.textSnippet} </Text>
            </Box>
          ))} 
        </Stack>}
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
export default withUrqlClient(createUrqlClient, {ssr: true})(Index)
