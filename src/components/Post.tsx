import { ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Heading, Text, Link } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostSnippetFragment, useDeletePostMutation, useMeQuery, useVoteMutation } from '../generated/graphql';
import NextLink from "next/link";
interface PostProps {
    post: PostSnippetFragment;
    // post: Pick<PostType, "id" | "createdAt" | "updatedAt" | "title" | "textSnippet" | "points"> & { creator:  Pick<User, 'id' | 'username'>}
}

export const Post: React.FC<PostProps> = ({ post }) => {
    const [{data: profile, fetching}] = useMeQuery(); //to be replaced with a redux store to store state?
    const [loadingState, setLoadingState] = useState<'upvote-loading' | 'downvote-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation();
    const [, deletePost] = useDeletePostMutation();

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
            <Flex flexDirection="column" flex={1}>
                <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                    <Link>
                        <Heading fontSize="xl"> {post.title} </Heading>
                        <Text> posted by {post.creator.username} </Text>
                    </Link>
                </NextLink>
                <Text mt={4}> {post.textSnippet} </Text>
            </Flex>
            {((profile?.me?.id === post.creator.id) && !fetching) && <Flex ml="auto" direction="column">
                <NextLink href="post/edit/[id]" as={`/post/edit/${post.id}`}>
                    <Link>
                        <IconButton aria-label="edit" icon={<EditIcon />} mb={2}/>
                    </Link>
                </NextLink>
                <IconButton onClick={() => deletePost({ id: post.id })} aria-label="delete" icon={<DeleteIcon />} mb={2}/>
            </Flex> } 
        </Flex>
    );
}