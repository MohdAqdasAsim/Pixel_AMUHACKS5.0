import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/config";
import { useAuth } from "../contexts/AuthContext";
import { OnboardingContext } from "../contexts/OnboardingContext";

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const { user, loading: authLoading } = useAuth();

  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Reset loading state when user changes
      setLoading(true);

      if (!user) {
        setIsOnboardingComplete(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setIsOnboardingComplete(data.onboardingComplete === true);
        } else {
          setIsOnboardingComplete(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkOnboarding();
    }
  }, [user, authLoading]);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete: isOnboardingComplete === true,
        setIsOnboardingComplete,
        loading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
