import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};

export interface UserResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserItem[];
};

export const validDegrees = ['BACHELOR', 'MASTER', 'DOCTORATE', 'ORTHER'] as const;
export type DegreeType = typeof validDegrees[number];
export interface UserItem {
  id: string;
  address: string;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  avatar: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  code: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  teacherProfile?: {
    id: string;
    degree: string;
  };
  role: {
    id: string;
    name: string;
  };
  isInGroup?: boolean;
}

export interface CreateOrUpdateUserDto {
  address?: string | null;
  roleId: string;
  password?: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  avatar?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE';
  code?: string;
  email?: string;
  phone?: string;
  teacherProfile?: {
    degree: 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'ORTHER';
  };
  studentProfile?: {
    academicYear: string;
  };
}

export interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  dob?: string;
  description?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: {
    address?: string;
    ward?: string;
    district?: string;
    province?: string;
    country?: string;
    postalCode?: string;
  };
}