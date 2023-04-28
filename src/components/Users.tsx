import { useState } from "react";

const Users = () => {
  const [users, setUsers] = useState<any[]>();
  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to show</p>
      )}
    </article>
  );
};

export default Users;
