import { ArrowUpIcon, ArrowDownIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Flex, Button, Text, Heading, IconButton, Link } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../util/createUrqlClient';
import { useGetPostFromURL } from '../../util/useGetPostFromURL';
import { useMeQuery, useVoteMutation, useDeletePostMutation } from '../../generated/graphql';

interface PostPageProps {

}

const PostPage: React.FC<PostPageProps> = ({ }) => {
    const router = useRouter()
    const [{data: profile, fetching: fetchingMe}] = useMeQuery(); //to be replaced with a redux store to store state?
    const [loadingState, setLoadingState] = useState<'upvote-loading' | 'downvote-loading' | 'not-loading'>('not-loading');
    const [, vote] = useVoteMutation();
    const [, deletePost] = useDeletePostMutation();
    const [{ data, fetching }] = useGetPostFromURL()


    if (!fetching && !fetchingMe && !data?.post && !profile) {
        return <Layout>
            <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop={32} p={24} shadow="md" borderWidth="1px">
                <Text fontSize={32}> Could not find the post you're looking fo... :( </Text>
                <Button onClick={() => { router.back() }} marginTop={8}>
                    Go back?
                </Button>
            </Flex>
        </Layout>
    }

    return (
        <Layout>
            {(fetching && fetchingMe && !data) ? (<Spinner />) : (
                <Flex minHeight={250} p={5} shadow="md" borderWidth="1px">
                    <Flex direction="column" paddingRight={8} alignItems="center">
                        <IconButton
                            onClick={async () => {
                                setLoadingState('upvote-loading')
                                await vote({
                                    postId: (data?.post?.id ? data.post.id : -1),
                                    value: 1
                                })
                                setLoadingState('not-loading')
                            }}
                            bg={data!.post!.voteStatus === 1 ? '#ff6347' : '#edf2f7'}
                            color={data!.post!.voteStatus === 1 ? 'white' : 'black'}
                            aria-label="upvote"
                            icon={<ArrowUpIcon />}
                            isLoading={loadingState === 'upvote-loading'}
                        />
                        <Text marginTop={2} marginBottom={2}> {data!.post!.points} </Text>
                        <IconButton
                            onClick={() => {
                                setLoadingState('downvote-loading')
                                vote({
                                    postId: (data?.post?.id ? data.post.id : -1),
                                    value: -1
                                })
                                setLoadingState('not-loading')
                            }}
                            bg={data!.post!.voteStatus === -1 ? '#7393ff' : '#edf2f7'}
                            color={data!.post!.voteStatus === -1 ? 'white' : 'black'}
                            aria-label="downvote"
                            icon={<ArrowDownIcon />}
                            isLoading={loadingState === 'downvote-loading'}
                        />
                    </Flex>
                    <Flex flexDirection="column" flex={1}>
                        <Heading fontSize="xl"> {data!.post!.title} </Heading>
                        <Text> posted by {data!.post!.creator.username} </Text>
                        <Text mt={4}> {data!.post!.text} </Text>
                    </Flex>
                    {((profile?.me?.id === data!.post!.creator.id) && !fetching) && <Flex ml="auto" direction="column">
                        <NextLink href="../post/edit/[id]" as={`../post/edit/${data!.post!.id}`}>
                            <Link>
                                <IconButton aria-label="edit" icon={<EditIcon />} mb={2} />
                            </Link>
                        </NextLink>
                        <IconButton onClick={() => deletePost({ id: (data?.post?.id ? data.post.id : -1) })} aria-label="delete" icon={<DeleteIcon />} mb={2} />
                    </Flex>}
                </Flex>
            )}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(PostPage);