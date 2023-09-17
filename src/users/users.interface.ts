export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  phone: number;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
}
// data trả về thông tin của user khi hành động điều gì đó
