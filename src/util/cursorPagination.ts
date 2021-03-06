import { Resolver, Variables } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

export type MergeMode = 'before' | 'after';

export interface PaginationParams {
    cursorArgument?: string;
    // limitArgument?: string;
    // mergeMode?: MergeMode;
}

export const compareArgs = (
    cursorArgument = 'cursor',
    limitArgument = 'limit',
    fieldArgs: Variables,
    connectionArgs: Variables
): boolean => {
    for (const key in connectionArgs) {
        if (key === cursorArgument || key === limitArgument) {
            continue;
        } else if (!(key in fieldArgs)) {
            return false;
        }

        const argA = fieldArgs[key];
        const argB = connectionArgs[key];

        if (
            typeof argA !== typeof argB || typeof argA !== 'object'
                ? argA !== argB
                : stringifyVariables(argA) !== stringifyVariables(argB)
        ) {
            return false;
        }
    }

    for (const key in fieldArgs) {
        if (key === cursorArgument || key === limitArgument) {
            continue;
        }
        if (!(key in connectionArgs)) return false;
    }

    return true;
};

export const cursorPagination = (
// {
//     cursorArgument = 'cursor',
//     limitArgument = 'limit',
//     mergeMode = 'after',
// }: PaginationParams = {}
): Resolver => {


    //fieldargs are what we passing in as variables
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey); //gets all the fields in the cache; in this case Queries.
        // {
        //     fieldKey: 'posts({"limit":10})',
        //     fieldName: 'posts',
        //     arguments: { limit: 10 }
        // }
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        // if cache misses
        if (size === 0) {
            return undefined;
        } 
        
        
        const fieldKey = cache.resolve(entityKey, `${fieldName}(${stringifyVariables(fieldArgs)})`) as string;
        const cacheData = cache.resolve(fieldKey, "posts");
        info.partial = !cacheData; // tell urql we got partial return -> request from backend

        const results: string[] = [];
        let hasMore = true;
        fieldInfos.forEach(item => {
            const key = cache.resolve(entityKey, item.fieldKey) as string; //cast it as string[]
            const data = cache.resolve(key, "posts") as string[];
            hasMore = cache.resolve(key, "hasMore") as boolean;
            results.push(...data); //combine the list into the list

        });
        return {__typename: "PaginatedPosts", hasMore, posts: results};
    };
};