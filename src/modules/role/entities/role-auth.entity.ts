import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('role_auth')
export class Role {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  authId: number;
}
