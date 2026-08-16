// src/Pages/FollowList.jsx - View Following and Followers
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import FollowButton from '../components/community/FollowButton';

const FollowList = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get('tab') || 'following';
  const [activeTab, setActiveTab] = useState(tab);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchConnections = async () => {
      try {
        // Get current user's following and followers arrays
        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userSnap.exists()) return;
        const userData = userSnap.data();
        const followingIds = userData.following || [];
        const followerIds = userData.followers || [];

        // Fetch following users
        if (followingIds.length > 0) {
          const followingUsers = [];
          for (const uid of followingIds) {
            try {
              const uSnap = await getDoc(doc(db, 'users', uid));
              if (uSnap.exists()) followingUsers.push({ id: uSnap.id, ...uSnap.data() });
            } catch (e) {}
          }
          setFollowing(followingUsers);
        }

        // Fetch followers
        if (followerIds.length > 0) {
          const followerUsers = [];
          for (const uid of followerIds) {
            try {
              const uSnap = await getDoc(doc(db, 'users', uid));
              if (uSnap.exists()) followerUsers.push({ id: uSnap.id, ...uSnap.data() });
            } catch (e) {}
          }
          setFollowers(followerUsers);
        }
      } catch (e) { console.error('Error fetching connections:', e); }
      setLoading(false);
    };
    fetchConnections();
  }, [currentUser]);

  const renderUser = (user) => (
    <div key={user.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
      <Link to={`/profile/${encodeURIComponent(user.email)}`} className="flex items-center gap-3 min-w-0 flex-1">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user.displayName || 'U')[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-gray-900 text-sm font-semibold truncate hover:text-blue-600">{user.displayName || 'User'}</p>
          <p className="text-gray-500 text-xs truncate">{user.specialization || user.primarySkillTrack || 'Member'}</p>
        </div>
      </Link>
      {user.id !== currentUser?.uid && (
        <div className="flex-shrink-0 ml-3">
          <FollowButton targetUserId={user.id} targetUserData={user} size="sm" />
        </div>
      )}
    </div>
  );

  const tabs = [
    { key: 'following', label: 'Following', count: following.length },
    { key: 'followers', label: 'Followers', count: followers.length },
  ];

  const list = activeTab === 'following' ? following : followers;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Connections</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-900 font-semibold mb-1">
            {activeTab === 'following' ? 'Not following anyone yet' : 'No followers yet'}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {activeTab === 'following' ? 'Discover and follow tech professionals.' : 'Share your work and engage with the community to gain followers.'}
          </p>
          <button onClick={() => navigate('/members-directory')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-all">
            Discover People
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map(renderUser)}
        </div>
      )}
    </div>
  );
};

export default FollowList;
