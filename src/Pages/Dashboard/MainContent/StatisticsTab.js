import { getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import { getColRef } from '../../../firebase/firebase-firestore';
import { StyledPostCard } from '../../../components/styled/PostList.styled';

function StatisticsTab() {
    const user = useSelector(selectUser);
    const currentClass = useSelector(selectCurrentClass);
    const [individualStatsList, setIndividualStatsList] = useState([]);
    const myStats = individualStatsList.filter(stat => stat.user === user.email);
    const isOnInstructorList = currentClass?.instructors_list?.includes(user.email);

    useEffect(() => {
        const individualStatsColRef = getColRef(`classes/${currentClass.c_id}/individual_stats`);
        getDocs(individualStatsColRef)
            .then((snapshot) => {
                const promises = snapshot.docs.map(doc => {
                    return { ...doc.data(), id: doc.id }
                });
                Promise.all(promises)
                    .then(stats => {
                        setIndividualStatsList([...stats]);
                    })

            })
            .catch(err => console.log(err.message))
    }, [])

    return (
        <div>
            <div>Overall Class Statistics</div>
            {`total posts : ${currentClass.total_posts}\n`}
            {`total contributions : ${currentClass.total_contributions}\n`}
            {`total anonymous contributions : ${currentClass.total_anonymous_contributions}\n`}
            {`total deleted contributions : ${currentClass.total_deleted_contributions}\n`}
            <br />
            {myStats.length > 0 &&
                <>
                    <div>My Stats</div>
                    <pre>{JSON.stringify(myStats[0], null, 2)}</pre>
                    <br />
                </>
            }
            {
                isOnInstructorList
                &&
                individualStatsList.length > 0
                &&
                <>
                    <div>Individual Stats of Students/Instructors enrolled in this class</div>
                    {individualStatsList.map(stat => (
                        <StyledPostCard key={stat.id}>
                            {`${stat.user} :\n`}
                            Total Posts : {stat.total_posts}
                            <br />
                            Total Contributions : {stat.total_contributions}
                        </StyledPostCard>
                    ))}
                </>
            }
        </div>
    );
}

export default StatisticsTab;