import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  blockUser,
  activateUser,
} from "../../services/userService";

function Users({ language = "es" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    es: {
      title: "Usuarios",
      description:
        "Administra los miembros registrados, sus roles y el estado de sus cuentas.",
      loading: "Cargando usuarios...",
      noUsers: "No hay usuarios registrados.",
      loadError: "Error al cargar los usuarios.",
      roleError: "Error al actualizar el rol.",
      blockError: "Error al bloquear el usuario.",
      activateError: "Error al activar el usuario.",
      status: "Estado",
      active: "Activo",
      blocked: "Bloqueado",
      role: "Rol",
      user: "Usuario",
      staff: "Personal",
      admin: "Administrador",
      superAdmin: "Superadministrador",
      block: "Bloquear",
      activate: "Activar",
      unknownUser: "Usuario sin nombre",
    },
    en: {
      title: "Users",
      description:
        "Manage registered members, roles and account status.",
      loading: "Loading users...",
      noUsers: "No registered users.",
      loadError: "Error loading users.",
      roleError: "Error updating the role.",
      blockError: "Error blocking the user.",
      activateError: "Error activating the user.",
      status: "Status",
      active: "Active",
      blocked: "Blocked",
      role: "Role",
      user: "User",
      staff: "Staff",
      admin: "Administrator",
      superAdmin: "Super administrator",
      block: "Block",
      activate: "Activate",
      unknownUser: "Unnamed user",
    },
  };

  const t = translations[language] || translations.es;

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
      alert(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert(t.roleError);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await blockUser(userId);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert(t.blockError);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await activateUser(userId);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert(t.activateError);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-extrabold text-blue-950">
        {t.title}
      </h1>

      <p className="mb-6 text-slate-600">
        {t.description}
      </p>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            {t.loading}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="font-semibold text-slate-600">
            {t.noUsers}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-lg"
            >
              <h2 className="text-lg font-bold text-blue-950">
                {user.full_name || t.unknownUser}
              </h2>

              <p className="text-sm text-slate-600">
                {user.email}
              </p>

              <p className="mt-2 text-sm">
                {t.status}:{" "}
                <span
                  className={
                    user.is_active
                      ? "font-bold text-green-600"
                      : "font-bold text-red-600"
                  }
                >
                  {user.is_active
                    ? t.active
                    : t.blocked}
                </span>
              </p>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  {t.role}
                </label>

                <select
                  value={user.role || "user"}
                  onChange={(event) =>
                    handleRoleChange(
                      user.id,
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border bg-white p-3"
                >
                  <option value="user">
                    {t.user}
                  </option>

                  <option value="staff">
                    {t.staff}
                  </option>

                  <option value="admin">
                    {t.admin}
                  </option>

                  <option value="super_admin">
                    {t.superAdmin}
                  </option>
                </select>
              </div>

              <div className="mt-4 flex gap-3">
                {user.is_active ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleBlock(user.id)
                    }
                    className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
                  >
                    {t.block}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleActivate(user.id)
                    }
                    className="rounded-xl bg-green-600 px-4 py-2 font-bold text-white transition hover:bg-green-700"
                  >
                    {t.activate}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;