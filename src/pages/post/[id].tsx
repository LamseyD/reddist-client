import { Flex, Button, Text } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';

interface PostPageProps {

}

const PostPage: React.FC<PostPageProps> = ({}) => {
    const router = useRouter();
    const validID = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
    const [{data, fetching}] = usePostQuery ({
        pause: validID === -1,
        variables: {
            id: validID 
        }
    })

    if (!fetching && !data?.post){
        return <Layout>
            <Flex flexDirection="column" alignItems="center" justifyContent="center" marginTop={32}  p={24} shadow="md" borderWidth="1px">
                <Text fontSize={32}> Could not find the post you're looking fo... :( </Text>
                <Button onClick={() => {router.back()}} marginTop={8}>
                    Go back?
                </Button>
            </Flex>
        </Layout>
    }

    return (
        <Layout>
            {(fetching) ? (<Spinner/>) : (
                <div>
                    <div> {data?.post?.text} </div>
                    <div> {data?.post?.voteStatus} </div>
                </div>
            )}
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(PostPage);