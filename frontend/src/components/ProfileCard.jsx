function ProfileCard({
  userProfile,
  onEditProfile,
  onAdminClick,
  onLogout,
  language = "es",
}) {
  const isAdmin =
    userProfile?.role === "admin" ||
    userProfile?.role === "super_admin";

  const t = {
    es: {
      settings: "Configuración",
      welcome: "Bienvenido",
      user: "Usuario",
      profile: "Mi perfil",
      admin: "Panel de administrador",
      logout: "Cerrar sesión",
      profileAlt: "Perfil",
    },
    en: {
      settings: "Settings",
      welcome: "Welcome",
      user: "User",
      profile: "My Profile",
      admin: "Administrator Panel",
      logout: "Sign Out",
      profileAlt: "Profile",
    },
  }[language];

  return (
    <div className="bg-white min-h-[calc(100vh-110px)]">
      {/* Header */}
      <div className="bg-slate-950 text-white px-6 pt-10 pb-24 rounded-b-[32px]">
        <h2 className="text-3xl font-extrabold mb-8">
          {t.settings}
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-5xl">
            {userProfile?.profile_photo_url ? (
              <img
                src={userProfile.profile_photo_url}
                alt={t.profileAlt}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              "👤"
            )}
          </div>

          <div>
            <p className="text-slate-300 text-sm">
              {t.welcome}
            </p>

            <h3 className="text-xl font-bold">
              {userProfile?.full_name || t.user}
            </h3>

            <p className="text-slate-300 text-sm">
              {userProfile?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="-mt-12 mx-4 bg-white rounded-[28px] shadow-lg overflow-hidden border border-slate-100">

        {/* Profile */}
        <button
          type="button"
          onClick={onEditProfile}
          className="w-full flex items-center justify-between px-6 py-6 border-b border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl">
              👤
            </div>

            <span className="font-bold text-lg text-slate-900">
              {t.profile}
            </span>
          </div>

          <span className="text-2xl text-slate-400">
            ›
          </span>
        </button>

        {/* Admin */}
        {isAdmin && (
          <button
            type="button"
            onClick={onAdminClick}
            className="w-full flex items-center justify-between px-6 py-6 border-b border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl">
                ⚙️
              </div>

              <span className="font-bold text-lg text-slate-900">
                {t.admin}
              </span>
            </div>

            <span className="text-2xl text-slate-400">
              ›
            </span>
          </button>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-6 py-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl">
              ↪
            </div>

            <span className="font-bold text-lg text-red-500">
              {t.logout}
            </span>
          </div>

          <span className="text-2xl text-slate-400">
            ›
          </span>
        </button>

      </div>
    </div>
  );
}

export default ProfileCard;