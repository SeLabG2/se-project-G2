import { getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentClass } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { getPosts, selectAllPosts } from '../features/posts/postSlice';
import { getColRef } from '../firebase/firebase-firestore';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';

function PostsList() {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectAllPosts);
    const currentClass = useSelector(selectCurrentClass);
    const navigate = useNavigate();
    const { c_id } = useParams();
    const [arePostsLoading, setArePostsLoading] = useState(true);
    const [posts, setPosts] = useState(allPosts);

    useEffect(() => {
        console.log('postlist loaded');
        const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
        const postQuery = query(
            postColRef,
            where('type', '==', 'poll')
        );

        const unsubscribe = onSnapshot(postQuery, (snapshot) => {
            const promises = snapshot.docs.map((doc) => {
                console.log('each post is : ', doc.data());
                return { ...doc.data(), p_id: doc.id };
            });
            Promise.all(promises)
                .then((posts) => {
                    dispatch(getPosts(posts));
                    console.log('all the posts are : ', posts);
                    setArePostsLoading(false);
                })
                .catch((err) => {
                    console.log(err.message);
                })
        });

        return unsubscribe;
    }, [c_id])

    // useEffect(() => {
    //     console.log('all posts : ', allPosts);
    // }, [currentClass]);


    return (
        <PostListContainer>
            {
                allPosts.length !== 0
                    ?
                    allPosts.map((post) => (
                        <StyledPostCard
                            key={post.p_id}
                            onClick={() => {
                                dispatch(toggleContent('other'));
                                navigate(`/dashboard/${c_id}/${post.p_id}`)
                            }}
                        >
                            {`post summary : ${post.summary} and class id from params here : ${c_id}`}
                        </StyledPostCard>
                    ))
                    :
                    (
                        <div>No Posts Yet...</div>
                    )
            }
        </PostListContainer>
    );
}

export default PostsList;