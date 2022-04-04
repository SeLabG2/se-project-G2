import { onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectCurrentClass } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { getPosts, resetPosts, selectAllPosts, selectCurrentDiscussion } from '../features/posts/postSlice';
import { getColRef } from '../firebase/firebase-firestore';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { hideSidebar } from '../features/sidebar/sidebarSlice';

function PostsList({ searchTerm }) {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectAllPosts);
    const currentDiscussion = useSelector(selectCurrentDiscussion);
    const currentClass = useSelector(selectCurrentClass);
    const navigate = useNavigate();
    const { c_id } = useParams();
    const [arePostsLoading, setArePostsLoading] = useState(true);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        if (searchTerm !== '') {
            // returns all posts whose summary and details contain search term
            setFilteredPosts(allPosts.filter(post => {
                return (post?.summary.toLowerCase().includes(searchTerm.toLowerCase())
                    ||
                    post?.details.toLowerCase().includes(searchTerm.toLowerCase()));
            }));
        } else {
            // show the posts from current discussion
            if (currentDiscussion === '') {
                setFilteredPosts([...allPosts]);
            } else {
                const newPostList = allPosts.filter(post => {
                    const isPresent = post?.discussion_list.includes(currentDiscussion);
                    return isPresent;
                });
                setFilteredPosts(newPostList);
            }
        }
    }, [searchTerm]);

    useEffect(() => {
        if (currentClass != undefined || currentClass !== null) {

            if (allPosts.length !== 0) {
                if (currentDiscussion === '') {
                    setFilteredPosts([...allPosts]);
                } else {
                    setFilteredPosts(allPosts.filter(post => {
                        post?.discussion_list.includes(currentDiscussion);
                    }));
                }
            }

            // console.log('currentclass id :', currentClass.c_id);
            // const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
            // const postQuery = query(
            //     postColRef,
            //     orderBy('created_at', 'desc')
            // );

            // const unsubscribe = onSnapshot(postQuery, (snapshot) => {
            //     const promises = snapshot.docs.map((doc) => {
            //         return { ...doc.data(), p_id: doc.id };
            //     });
            //     Promise.all(promises)
            //         .then((posts) => {
            //             if (currentClass != undefined || currentClass !== null) {
            //                 dispatch(getPosts(posts));
            //                 console.log('all the posts are : ', posts);
            //                 if (posts.length !== 0) {
            //                     if (currentDiscussion === '') {
            //                         setFilteredPosts([...posts]);
            //                     } else {
            //                         setFilteredPosts(posts.filter(post => {
            //                             post?.discussion_list.includes(currentDiscussion);
            //                         }));
            //                     }
            //                 }
            //             } else {
            //                 dispatch(resetPosts());
            //             }
            //             setArePostsLoading(false);
            //         })
            //         .catch((err) => {
            //             console.log(err.message);
            //         })
            // });

            // return unsubscribe;
        }
    }, [currentClass, allPosts])

    useEffect(() => {
        console.log('all posts : ', allPosts);
        if (currentDiscussion === '') {
            setFilteredPosts([...allPosts]);
        } else {
            const newPostList = allPosts.filter(post => {
                const isPresent = post?.discussion_list.includes(currentDiscussion);
                return isPresent;
            });
            setFilteredPosts(newPostList);
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
                            {`post summary : ${post.summary}`}
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