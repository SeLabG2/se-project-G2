import { onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentClass } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { getPosts, selectAllPosts, selectCurrentDiscussion } from '../features/posts/postSlice';
import { getColRef } from '../firebase/firebase-firestore';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { hideSidebar } from '../features/sidebar/sidebarSlice';

function PostsList() {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectAllPosts);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const currentClass = useSelector(selectCurrentClass);
    const navigate = useNavigate();
    const { c_id } = useParams();
    const [arePostsLoading, setArePostsLoading] = useState(true);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
        const postQuery = query(
            postColRef,
            orderBy('created_at', 'desc')
        );

        const unsubscribe = onSnapshot(postQuery, (snapshot) => {
            const promises = snapshot.docs.map((doc) => {
                return { ...doc.data(), p_id: doc.id };
            });
            Promise.all(promises)
                .then((posts) => {
                    dispatch(getPosts(posts));
                    console.log('all the posts are : ', posts);
                    if (posts.length !== 0) {
                        if (currentDiscussion === '') {
                            setFilteredPosts([...posts]);
                        } else {
                            setFilteredPosts(posts.filter(post => {
                                post?.discussion_list.includes(currentDiscussion);
                            }));
                        }
                    }
                    setArePostsLoading(false);
                })
                .catch((err) => {
                    console.log(err.message);
                })
        });

        return unsubscribe;
    }, [c_id])

    useEffect(() => {
        console.log('all posts : ', allPosts);
        if (currentDiscussion === '') {
            setFilteredPosts([...allPosts]);
        } else {
            setFilteredPosts(allPosts.filter(post => {
                post?.discussion_list.includes(currentDiscussion);
            }));
        }
    }, [currentDiscussion]);


    return (
        <PostListContainer>
            {
                filteredPosts.length !== 0
                    ?
                    filteredPosts.map((post) => (
                        <StyledPostCard
                            key={post.p_id}
                            onClick={() => {
                                dispatch(hideSidebar());
                                dispatch(resetDropdown());
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