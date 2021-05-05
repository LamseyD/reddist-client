import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { createUrqlClient } from '../../util/createUrqlClient';

interface PostPageProps {

}

const PostPage: React.FC<PostPageProps> = ({}) => {
    const router = useRouter();
    
    return (
        <div>
            Hello world
        </div>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(PostPage);