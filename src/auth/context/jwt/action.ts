import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import axiosInstance from 'src/lib/axios';
import { UpdateProfileParams } from 'src/types/user';

// ----------------------------------------------------------------------

export type SignInParams = {
  username: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }: SignInParams): Promise<void> => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { token } = res.data;

    if (!token) {
      throw new Error('Access token not found in response');
    }

    setSession(token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Update account profile
 *************************************** */

export const updateProfile = async (params: UpdateProfileParams): Promise<void> => {
  try {
    const token = sessionStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      throw new Error('No access token found');
    }

    const res = await axiosInstance.patch(endpoints.auth.updateMe, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200) {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    console.error('Error during profile update:', error);
    throw error;
  }
};

/** **************************************
 * Update account password
 *************************************** */
export const changePassword = async (): Promise<void> => {
  try {

  } catch (error) { }
}
