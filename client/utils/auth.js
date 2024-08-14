import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Router from 'next/router';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setUser({
        id: session.user.id,
        username: session.user.name,
        email: session.user.email,
        profilePicture: session.user.image,
        roles: session.user.roles,
        isEmailVerified: session.user.emailVerified,
      });
    }
  }, [session]);

  const getUser = () => {
    return new Promise((resolve, reject) => {
      if (user) {
        resolve(user);
      } else {
        // If user is not yet fetched, wait for the session to be loaded
        const timeout = setTimeout(() => {
          if (user) {
            resolve(user);
            clearTimeout(timeout);
          } else {
            reject(new Error('User not found'));
          }
        }, 5000); // Timeout after 5 seconds
      }
    });
  };

  const loginUser = async ({ email, password }) => {
    try {
      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      // Update the user state with the new data
      Router.push('/');
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const registerUser = async ({ username, email, password }) => {
    try {
      await signIn('credentials', {
        redirect: false,
        email,
        password,
        username,
      });
      // Update the user state with the new data
      Router.push('/');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    signOut({ redirect: false }).then(() => {
      setUser(null);
      Router.push('/');
    });
  };

  return {
    user,
    getUser,
    loginUser,
    registerUser,
    logout,
  };
};