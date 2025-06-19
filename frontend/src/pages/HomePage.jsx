import { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, MessageSquare } from 'lucide-react';
import { useEventStore } from '../store/useEventStore';
import { usePostStore } from '../store/usePostStore';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [eventFilter, setEventFilter] = useState('nearby');
  
  const { 
    myEvents, 
    nearbyEvents, 
    getMyEvents, 
    getNearbyEvents, 
    initLocationListener,
    isLoading: eventsLoading 
  } = useEventStore();
  
  const { 
    followingPosts, 
    getFollowingPosts, 
    isLoading: postsLoading 
  } = usePostStore();

  // Initialize location change listeners
  useEffect(() => {
    const cleanup = initLocationListener();
    return cleanup; // Cleanup listeners on unmount
  }, [initLocationListener]);

  useEffect(() => {
    if (activeTab === 'events') {
      if (eventFilter === 'my') {
        getMyEvents();
      } else {
        getNearbyEvents();
      }
    } else if (activeTab === 'following') {
      getFollowingPosts();
    }
  }, [activeTab, eventFilter, getMyEvents, getNearbyEvents, getFollowingPosts]);

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Tab Navigation */}
        <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab tab-lg gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Event Filter */}
            <div className="flex gap-2">
              <button
                className={`btn btn-sm ${eventFilter === 'nearby' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setEventFilter('nearby')}
              >
                <MapPin className="w-4 h-4" />
                Events Near Me
              </button>
              <button
                className={`btn btn-sm ${eventFilter === 'my' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setEventFilter('my')}
              >
                <Calendar className="w-4 h-4" />
                My Events
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {eventsLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <>
                  {eventFilter === 'nearby' && nearbyEvents.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                  {eventFilter === 'my' && myEvents.map((event) => (
                    <EventCard key={event._id} event={event} showRSVPStatus />
                  ))}
                  {((eventFilter === 'nearby' && nearbyEvents.length === 0) ||
                    (eventFilter === 'my' && myEvents.length === 0)) && (
                    <div className="text-center py-8">
                      <p className="text-base-content/60">
                        {eventFilter === 'my' 
                          ? "You haven't RSVPd to any events yet" 
                          : "No events found nearby"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="space-y-4">
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                {followingPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
                {followingPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-base-content/60">
                      No posts from people you follow yet
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-base-content/60 mb-4">
                Connect with other users through direct messages
              </p>
              <Link to="/messages" className="btn btn-primary">
                Open Messages
              </Link>
            </div>
          </div>
        )}

        {/* Floating Action Button for Create Event */}
        {activeTab === 'events' && (
          <div className="fixed bottom-6 right-6">
            <Link to="/create-event" className="btn btn-primary btn-circle btn-lg shadow-lg">
              <Calendar className="w-6 h-6" />
            </Link>
          </div>
        )}

        {/* Floating Action Button for Create Post */}
        {activeTab === 'following' && (
          <div className="fixed bottom-6 right-6">
            <Link to="/create-post" className="btn btn-primary btn-circle btn-lg shadow-lg">
              <Users className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;