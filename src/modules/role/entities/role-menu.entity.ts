import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('role_menu')
export class Role {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  menuId: number;
}
