export type Follower = {
  _id: string;
  baseUrl: string;
  name: string;
  expire: number;
  createdAt?: string;
  updatedAt?: string;
};

export type FollowerInput = {
  baseUrl: string;
  name: string;
  expire: number;
};

