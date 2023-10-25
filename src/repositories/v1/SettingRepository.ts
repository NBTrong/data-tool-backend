import { ISettingRepository } from '@n-repositories/interfaces/v1';
import Repository, { BaseTransaction } from '@n-repositories/Repository';
import { injectable } from 'inversify';
import Setting from '@n-models/Setting';

@injectable()
export class SettingRepository
  extends Repository<typeof Setting>
  implements ISettingRepository {
  initializeModel(): typeof Setting {
    return Setting;
  }

  transacting(trx: BaseTransaction): ISettingRepository {
    const repositoryTransaction = new SettingRepository(trx.transaction);
    return repositoryTransaction;
  }
}
