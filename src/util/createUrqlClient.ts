import { cacheExchange, Cache } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from 'wonka'; //wonka comes with urql
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, VoteMutationVariables } from "../generated/graphql";
import { betterUpdateQuery } from './betterUpdateQuery';
import router from "next/router";
import { cursorPagination } from './cursorPagination';
import gql from 'graphql-tag';

//global error checker
const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes("not authenticated")) {
                router.replace("/login") // redirect to login
            }
        })
    )
}

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
    fieldInfos.forEach((fi) => {
        cache.invalidate("Query", "posts", fi.arguments || {});
    });
}

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    // need to update cache here because urql using caching, it caches the requests.
    exchanges: [
        dedupExchange,
        cacheExchange({
            keys: {
                PaginatedPosts: () => null
            },
            resolvers: {
                Query: {
                    posts: cursorPagination()
                }
            },
            //updates cache when any of these are invoked
            updates: {
                Mutation: {
                    vote: (_result, args, cache, info) => {
                        // updating the cache by graphql fragments
                        const {postId, value} =  args as VoteMutationVariables;
                        const data = cache.readFragment(
                            gql`
                                fragment _ on Post {
                                    id
                                    points
                                }
                            `, { id: postId } as any
                        )
                        if (data) {
                            const newPoints = data.points + value;
                            cache.writeFragment(
                                gql`
                                    fragment _ on Post{
                                        points
                                    }
                                `,
                                {id: postId, points: newPoints} 
                            )
                        }
                    },
                    //invalidate query so that refetch the first query
                    createPost: (_result, args, cache, info) => {
                        invalidateAllPosts(cache);
                    },
                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user,
                                    };
                                }
                            }
                        );
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                if (result.register.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.register.user,
                                    };
                                }
                            }
                        );
                    },
                    logout: (_result, args, cache, info) => {
                        //me query return null
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => ({ me: null })
                        );
                    },
                },
            },
        }),
        errorExchange,
        ssrExchange,
        fetchExchange,
    ],
});
