import {
  ISettingRepository,
} from '@n-repositories/interfaces/v1';
import { REPOSITORIES } from '@n-types/injections/repositories';
import { inject, injectable } from 'inversify';

import { ISettingServices } from '@n-services/interface/ISettingServices';
import { handleDatabaseError } from '@n-errors/DatabaseError';
import { InternalError } from '@n-errors/HttpError';

@injectable()
export class SettingServices implements ISettingServices {
  @inject(REPOSITORIES.SettingRepository)
  private readonly settingRepository: ISettingRepository;

  async getSettingByType(type:string): Promise<any> {
    try {
      return await this.settingRepository.findOne({ type });
    } catch (error: any) {
      handleDatabaseError(error);
      throw new InternalError(error.message);
    }
  }

  async updateSetting(id: number, data: any): Promise<any> {
    try {
      const setting = this.settingRepository.findById(id);
      if (!setting) {
        throw new InternalError(`Cannot find setting id ${id}`);
      }
      return await this.settingRepository.updateById(id, data);
    } catch (error: any) {
      handleDatabaseError(error);
      throw new InternalError(error.message);
    }
  }
}
