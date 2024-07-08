import { UserRolesEnum } from './enums';

type Role = UserRolesEnum.ADMIN | UserRolesEnum.OFFICIA;

type JwtPayload = {
  userId: string;
  email: string;
  role: Role;
};
