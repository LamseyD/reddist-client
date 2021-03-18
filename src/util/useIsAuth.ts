import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{data, fetching}] = useMeQuery();
    const router = useRouter();

    //! Since useEffect fires when component first loads, data is just requested and not back yet, need to check if it's still fetching. 
    //! It's watching for any changes in data
    useEffect(() => {
        if (!fetching && !data?.me){
            router.replace("/login?next=" + router.pathname); 
            //telling browser where to go after login
            //putting next in next.js query param
        }
    }, [data, router])
}