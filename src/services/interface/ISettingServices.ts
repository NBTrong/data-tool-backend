import {
} from '@n-services/types';

export interface ISettingServices {
  getSettingByType(type:string): Promise<any>
  updateSetting(id: number, data:any): Promise<any>
}
