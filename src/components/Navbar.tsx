import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../util/isServer';

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
    const [{data, fetching}] = useMeQuery({
        pause: isServer
    });
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
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
            <Flex>
                <Box mr={2}> {data.me.username}</Box>
                <Button onClick={() => {logout();}} isLoading = {logoutFetching} variant='link'> Logout </Button>
            </Flex>
        )
    }
    return (
        <Flex bg='tomato' p={4}>
            <Box ml={"auto"}>
                {/* component to go to a link for Next.js */}
                {body}
            </Box>
        </Flex>

    );
}