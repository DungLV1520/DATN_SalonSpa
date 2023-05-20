export class User {
  _id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
  jwt?: string;
  role?: string;
  idBranch?: string;
}

export interface Password {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
