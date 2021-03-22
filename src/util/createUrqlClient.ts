import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from 'wonka'; //wonka comes with urql
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "../generated/graphql";
import { betterUpdateQuery } from './betterUpdateQuery';
import router from "next/router";
import { cursorPagination } from './cursorPagination';

//global error checker
const errorExchange: Exchange = ({forward}) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.includes("not authenticated")) {
                router.replace("/login") // redirect to login
            }
        })
    )
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
            updates: {
                Mutation: {
                    //@ts-ignore
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
                    //@ts-ignore
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
                    //@ts-ignore
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
