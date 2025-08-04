import { Module } from '@nestjs/common';

import { DeleteUserModule } from './deleteUser/deleteUser.module';
import { FindUserByIdModule } from './findUserById/findUserById.module';
import { ListUsersModule } from './listUsers/listUsers.module';
import { UpdateUserModule } from './updateUser/updateUser.module';

@Module({
  imports: [FindUserByIdModule, DeleteUserModule, ListUsersModule, UpdateUserModule],
})
export class UserModule {}
