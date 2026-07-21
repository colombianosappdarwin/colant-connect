import { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ProfileForm from "../components/ProfileForm";

function Profile({
  userProfile,
  setUserProfile,
  logout,
  setActiveTab,
  language = "es",
  changeLanguage,
}) {
  const [editingProfile, setEditingProfile] = useState(false);

  const handleProfileUpdated = (updatedProfile) => {
    setUserProfile(updatedProfile);

    if (
      updatedProfile?.preferred_language &&
      changeLanguage
    ) {
      changeLanguage(updatedProfile.preferred_language);
    }
  };

  if (editingProfile) {
    return (
      <ProfileForm
        userProfile={userProfile}
        language={language}
        changeLanguage={changeLanguage}
        onBack={() => setEditingProfile(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    );
  }

  return (
    <ProfileCard
      userProfile={userProfile}
      language={language}
      onEditProfile={() => setEditingProfile(true)}
      onAdminClick={() => {
        setActiveTab("admin");
      }}
      onLogout={logout}
    />
  );
}

export default Profile;