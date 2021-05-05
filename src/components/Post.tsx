import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Heading, Text, Link } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import NextLink from "next/link";
interface PostProps {
    post: PostSnippetFragment;
    // post: Pick<PostType, "id" | "createdAt" | "updatedAt" | "title" | "textSnippet" | "points"> & { creator:  Pick<User, 'id' | 'username'>}
}

export const Post: React.FC<PostProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'upvote-loading' | 'downvote-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation();
    return (
        <Flex p={5} shadow="md" borderWidth="1px">
            <Flex direction="column" paddingRight={8} alignItems="center">
                <IconButton
                    onClick={async () => {
                        setLoadingState('upvote-loading')
                        await vote({
                            postId: post.id,
                            value: 1
                        })
                        setLoadingState('not-loading')
                    }}
                    bg={post.voteStatus === 1 ? '#ff6347' : '#edf2f7'}
                    color={post.voteStatus === 1 ? 'white' : 'black'}
                    aria-label="upvote"
                    icon={<ArrowUpIcon />}
                    isLoading={loadingState === 'upvote-loading'}
                />
                <Text marginTop={2} marginBottom={2}> {post.points} </Text>
                <IconButton
                    onClick={() => {
                        setLoadingState('downvote-loading')
                        vote({
                            postId: post.id,
                            value: -1
                        })
                        setLoadingState('not-loading')
                    }}
                    bg={post.voteStatus === -1 ? '#7393ff' : '#edf2f7'}
                    color={post.voteStatus === -1 ? 'white' : 'black'}
                    aria-label="downvote"
                    icon={<ArrowDownIcon />}
                    isLoading={loadingState === 'downvote-loading'}

                />

            </Flex>
            <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                <Link flex="100%">
                        <Heading fontSize="xl"> {post.title} </Heading>
                        <Text> posted by {post.creator.username} </Text>
                        <Text mt={4}> {post.textSnippet} </Text>
                </Link>
            </NextLink>
        </Flex>
    );
}