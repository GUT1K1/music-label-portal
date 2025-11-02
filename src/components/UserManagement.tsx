import React, { useState } from 'react';
import { UserManagementProps, User } from './UserManagement/types';
import CreateUserForm from './UserManagement/CreateUserForm';
import UserListCard from './UserManagement/UserListCard';
import BlockUserModal from './UserManagement/BlockUserModal';
import FreezeUserModal from './UserManagement/FreezeUserModal';
import EditUserModal from './UserManagement/EditUserModal';

const UserManagement = React.memo(function UserManagement({ 
  allUsers, 
  newUser, 
  onNewUserChange, 
  onCreateUser,
  onBlockUser,
  onUnblockUser,
  onFreezeUser,
  onUnfreezeUser,
  onUpdateUser,
  isUserOnline,
  getUserLastSeen
}: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [freezeDate, setFreezeDate] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  const handleBlockUser = (permanent: boolean) => {
    if (selectedUser && blockReason && onBlockUser) {
      onBlockUser(selectedUser.id, blockReason, permanent);
      setShowBlockModal(false);
      setBlockReason('');
      setSelectedUser(null);
    }
  };

  const handleFreezeUser = () => {
    if (selectedUser && freezeDate && onFreezeUser) {
      onFreezeUser(selectedUser.id, new Date(freezeDate));
      setShowFreezeModal(false);
      setFreezeDate('');
      setSelectedUser(null);
    }
  };

  const handleEditUser = () => {
    if (selectedUser && onUpdateUser) {
      onUpdateUser(selectedUser.id, editData);
      setShowEditModal(false);
      setEditData({});
      setSelectedUser(null);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditData({
      full_name: user.full_name,
      username: user.username,
      role: user.role,
      revenue_share_percent: user.revenue_share_percent || 50,
      balance: user.balance || 0,
      email: user.email || user.vk_email || '',
      yandex_music_url: user.yandex_music_url || '',
      vk_group_url: user.vk_group_url || '',
      tiktok_url: user.tiktok_url || ''
    });
    setShowEditModal(true);
  };

  const openBlockModal = (user: User) => {
    setSelectedUser(user);
    setShowBlockModal(true);
  };

  const openFreezeModal = (user: User) => {
    setSelectedUser(user);
    setShowFreezeModal(true);
  };

  const closeBlockModal = () => {
    setShowBlockModal(false);
    setBlockReason('');
    setSelectedUser(null);
  };

  const closeFreezeModal = () => {
    setShowFreezeModal(false);
    setFreezeDate('');
    setSelectedUser(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditData({});
    setSelectedUser(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CreateUserForm 
        newUser={newUser}
        onNewUserChange={onNewUserChange}
        onCreateUser={onCreateUser}
      />

      <UserListCard
        allUsers={allUsers}
        onBlockUser={openBlockModal}
        onUnblockUser={onUnblockUser || (() => {})}
        onFreezeUser={openFreezeModal}
        onUnfreezeUser={onUnfreezeUser || (() => {})}
        onEditUser={openEditModal}
        isUserOnline={isUserOnline}
        getUserLastSeen={getUserLastSeen}
      />

      {showBlockModal && selectedUser && (
        <BlockUserModal
          user={selectedUser}
          blockReason={blockReason}
          onBlockReasonChange={setBlockReason}
          onBlock={handleBlockUser}
          onClose={closeBlockModal}
        />
      )}

      {showFreezeModal && selectedUser && (
        <FreezeUserModal
          user={selectedUser}
          freezeDate={freezeDate}
          onFreezeDateChange={setFreezeDate}
          onFreeze={handleFreezeUser}
          onClose={closeFreezeModal}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          editData={editData}
          onEditDataChange={setEditData}
          onSave={handleEditUser}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
});

export default UserManagement;
