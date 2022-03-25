import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { selectAllPosts } from '../features/posts/postSlice';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';

function PostsList() {
    const dispatch = useDispatch();
    const allPosts = useSelector(selectAllPosts);
    const navigate = useNavigate();
    const { c_id } = useParams();

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