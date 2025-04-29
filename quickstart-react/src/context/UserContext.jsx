import { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Access hook
export const useUser = () => useContext(UserContext);

// Provider
export const UserProvider = ({ children }) => {
  const [userPlan, setUserPlan] = useState("trial"); // 'free', 'trial', 'pro', 'team'
  const [trialEndsAt, setTrialEndsAt] = useState(() => {
    const stored = localStorage.getItem("trialEndsAt");
    return stored ? new Date(stored) : null;
  });

  // Simulate trial logic
  useEffect(() => {
    if (!trialEndsAt) {
      const ends = new Date();
      ends.setDate(ends.getDate() + 30);
      setTrialEndsAt(ends);
      localStorage.setItem("trialEndsAt", ends.toISOString());
    }
  }, [trialEndsAt]);

  const isTrialActive = () => {
    if (!trialEndsAt) return false;
    return new Date() < new Date(trialEndsAt);
  };

  const hasProAccess = () => {
    return userPlan === "pro" || (userPlan === "trial" && isTrialActive());
  };

  const hasTeamAccess = () => userPlan === "team";

  return (
    <UserContext.Provider
      value={{
        userPlan,
        setUserPlan,
        trialEndsAt,
        isTrialActive,
        hasProAccess,
        hasTeamAccess,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
