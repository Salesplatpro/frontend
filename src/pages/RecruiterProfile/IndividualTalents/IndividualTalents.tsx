import React, { useEffect, useState } from 'react';
import { individualTalent } from '../../../api/api-communication';
import './IndividualTalents.scss';
import { useParams } from 'react-router-dom';

const IndividualTalents = () => {
  const { talentId } = useParams();
  const [talentProfile, setTalentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await individualTalent(talentId);
        setTalentProfile(data.data.user);
        console.log(data.data)
      } catch (err) {
        setError('Failed to fetch talent profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [talentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!talentProfile) {
    return <div>No talent profile found</div>;
  }

  return (
    <div className="view-container">
      <h2>Talent Profile</h2>
      <div className="view-body">
        <div className="view-talent">
          <h3>Name: {`${talentProfile.firstName} ${talentProfile.lastName}`}</h3>
          <p>Role: {talentProfile.profile?.role?.[0]?.name || 'Role not specified'}</p>
          <p>Experience: {talentProfile.profile?.experience || 'Experience not specified'}</p>
          <p>Bio: {talentProfile.profile?.bio || 'Bio not specified'}</p>
          <p>Assessment Score: {talentProfile.profile?.score || 'Assessment Score not Available'}</p>
        </div>
      </div>
    </div>
  );
};

export default IndividualTalents;
