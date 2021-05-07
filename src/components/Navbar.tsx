import { Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router'

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
    const [{data, fetching}] = useMeQuery();
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const router = useRouter();
    let body = null;
    //data is loading
    if (fetching) {

    //user not logged in
    } else if (!data?.me){
        body = (
            <Flex>
                <NextLink href="/login">                    
                    <Link mr={2}> login</Link>
                </NextLink>
                <NextLink href="/register">                    
                    <Link> register</Link>
                </NextLink>
            </Flex>
        )
    //user is logged in
    } else {
        body = (
            <Flex align="center">
                <NextLink href="/createPost">
                    <Button ml="auto" mr={4}> Create Post </Button>
                </NextLink>
                <Box mr={2}> {data.me.username}</Box>
                <Button onClick={async () => { await logout(); router.reload()}} isLoading = {logoutFetching} variant='link'> Logout </Button>
            </Flex>
        )
    }
    return (
        <Flex zIndex={5} position="sticky" top={0} bg='tomato' p={4} align="center">
            <NextLink href="/">
                <Link>
                    <Text fontSize={24} color="white">
                        REDDIST
                    </Text>
                </Link>
            </NextLink>
            <Box ml={"auto"}>
                {/* component to go to a link for Next.js */}
                {body}
            </Box>
        </Flex>

    );
}