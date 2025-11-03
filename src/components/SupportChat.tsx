import { useState } from 'react';
import Icon from '@/components/ui/icon';
import SupportThreadList from './SupportThreadList';
import SupportChatWindow from './SupportChatWindow';
import NewThreadModal from './NewThreadModal';
import ArtistSupportView from './ArtistSupportView';
import { useSupportData } from './support/useSupportData';
import { useSupportActions } from './support/useSupportActions';
import { SupportChatProps } from './support/types';

export default function SupportChat({ userId, userRole }: SupportChatProps) {
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const isStaff = userRole === 'manager' || userRole === 'director';

  const {
    threads,
    messages,
    artists,
    releases,
    tracks,
    loading,
    loadThreads,
    loadMessages
  } = useSupportData(userId, isStaff, statusFilter, activeThread);

  const {
    sendingMessage,
    sendMessage: sendMessageAction,
    createNewThread: createNewThreadAction,
    updateThreadStatus,
    attachRelease,
    submitRating
  } = useSupportActions(userId, isStaff, loadThreads, loadMessages);

  const sendMessage = async () => {
    await sendMessageAction(activeThread!, newMessage, setNewMessage);
  };

  const createNewThread = async () => {
    await createNewThreadAction(
      selectedArtist,
      newThreadSubject,
      newThreadMessage,
      selectedRelease,
      selectedTrack,
      (id) => {
        setActiveThread(id);
        setShowNewThreadModal(false);
        setSelectedArtist(null);
        setNewThreadSubject('');
        setNewThreadMessage('');
      },
      setSelectedRelease,
      setSelectedTrack
    );
  };

  const handleThreadSelect = async (threadId: number) => {
    setActiveThread(threadId);
    await loadThreads();
  };

  const activeThreadData = threads.find(t => t.id === activeThread);

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <ArtistSupportView
        hasThread={threads.length > 0}
        threadData={activeThreadData || null}
        messages={messages}
        userId={userId}
        newMessage={newMessage}
        sendingMessage={sendingMessage}
        releases={releases}
        tracks={tracks}
        onCreateThread={(releaseId, trackId) => {
          setSelectedRelease(releaseId || null);
          setSelectedTrack(trackId || null);
          createNewThread();
        }}
        onMessageChange={setNewMessage}
        onSendMessage={sendMessage}
        onRatingSubmit={(rating) => submitRating(activeThread!, rating)}
        onAttachRelease={(releaseId, trackId) => attachRelease(activeThread!, releaseId, trackId)}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SupportThreadList
          threads={threads}
          activeThread={activeThread}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onThreadSelect={handleThreadSelect}
          onStatusFilterChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          onNewThreadClick={() => setShowNewThreadModal(true)}
        />

        <SupportChatWindow
          threadData={activeThreadData || null}
          messages={messages}
          userId={userId}
          newMessage={newMessage}
          sendingMessage={sendingMessage}
          isStaff={isStaff}
          releases={releases}
          tracks={tracks}
          onMessageChange={setNewMessage}
          onSendMessage={sendMessage}
          onStatusChange={isStaff ? (status) => updateThreadStatus(activeThread!, status) : undefined}
          onAttachRelease={!isStaff ? (releaseId, trackId) => attachRelease(activeThread!, releaseId, trackId) : undefined}
        />
      </div>

      <NewThreadModal
        open={showNewThreadModal}
        artists={artists}
        selectedArtist={selectedArtist}
        newThreadSubject={newThreadSubject}
        newThreadMessage={newThreadMessage}
        releases={releases}
        tracks={tracks}
        selectedRelease={selectedRelease}
        selectedTrack={selectedTrack}
        isArtist={!isStaff}
        onOpenChange={setShowNewThreadModal}
        onArtistChange={setSelectedArtist}
        onSubjectChange={setNewThreadSubject}
        onMessageChange={setNewThreadMessage}
        onReleaseChange={setSelectedRelease}
        onTrackChange={setSelectedTrack}
        onCreate={createNewThread}
      />
    </>
  );
}
