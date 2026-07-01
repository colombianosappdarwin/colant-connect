import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  blockUser,
  activateUser,
} from "../../services/userService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
      alert("Error loading users");
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
      console.log(error);
      alert("Error updating role");
    }
  };

  const handleBlock = async (userId) => {
    try {
      await blockUser(userId);
      await loadUsers();
    } catch (error) {
      console.log(error);
      alert("Error blocking user");
    }
  };

  const handleActivate = async (userId) => {
    try {
      await activateUser(userId);
      await loadUsers();
    } catch (error) {
      console.log(error);
      alert("Error activating user");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-950 mb-2">
        Users
      </h1>

      <p className="text-slate-600 mb-6">
        Manage registered members, roles and account status.
      </p>

      {loading ? (
        <p className="text-slate-500">Loading users...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5"
            >
              <h2 className="text-lg font-bold text-blue-950">
                {user.full_name}
              </h2>

              <p className="text-sm text-slate-600">
                {user.email}
              </p>

              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={
                    user.is_active
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {user.is_active ? "Active" : "Blocked"}
                </span>
              </p>

              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  Role
                </label>

                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                  className="w-full mt-2 p-3 border rounded-xl bg-white"
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="mt-4 flex gap-3">
                {user.is_active ? (
                  <button
                    onClick={() => handleBlock(user.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Block
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(user.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Activate
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