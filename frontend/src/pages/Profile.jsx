import { useState } from "react"
import ProfileCard from "../components/ProfileCard"
import ProfileForm from "../components/ProfileForm"

function Profile({ userProfile, setUserProfile, logout, setActiveTab }) {
  const [editingProfile, setEditingProfile] = useState(false)

  const handleProfileUpdated = (updatedProfile) => {
    setUserProfile(updatedProfile)
  }

  if (editingProfile) {
    return (
      <ProfileForm
        userProfile={userProfile}
        onBack={() => setEditingProfile(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    )
  }

  return (
    <ProfileCard
      userProfile={userProfile}
      onEditProfile={() => setEditingProfile(true)}
      onAdminClick={() => {
        setActiveTab("admin")
      }}
      onLogout={logout}
    />
  )
}

export default Profile