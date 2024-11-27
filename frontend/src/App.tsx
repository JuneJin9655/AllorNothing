import React, { useState } from "react";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const [user, setUser] = useState<{ username: string; funds: number } | null>(
    null
  );

  return (
    <div>
      {!user ? (
        <Auth onLogin={setUser} />
      ) : (
        <div>
          <h1>Welcome, {user.username}</h1>
          <p>Your Funds: {user.funds}</p>
        </div>
      )}
    </div>
  );
};

export default App;
