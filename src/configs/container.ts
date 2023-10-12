import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { SERVICES } from '@n-types/injections/services';
import { REPOSITORIES } from '@n-types/injections/repositories';

import {
  IUserRepository,
  IInputFileRepository,
  IUserTokenRepository,
  ISettingRepository,
} from '@n-repositories/interfaces/v1';
import {
  UserRepository,
  InputFileRepository,
  UserTokenRepository,
  SettingRepository,
} from '@n-repositories';

import {
  IAuthServices,
  IInputFileServices,
  ISettingServices,
  IQueueServices
} from '@n-services/interface';
import {
  AuthServices, InputFileServices, QueueServices, SettingServices,
} from '@n-services';
import { ITikTokServices } from '@n-services/interface/ITikTokServices';
import { TikTokServices } from '@n-services/TikTokServices';

const container = new Container({ defaultScope: 'Singleton' });
container.bind<IUserRepository>(REPOSITORIES.UserRepository).to(UserRepository);
container.bind<IUserTokenRepository>(REPOSITORIES.UserTokenRepository).to(UserTokenRepository);
container.bind<IInputFileRepository>(REPOSITORIES.InputFileRepository).to(InputFileRepository);
container
  .bind<ISettingRepository>(REPOSITORIES.SettingRepository)
  .to(SettingRepository);

container.bind<IAuthServices>(SERVICES.AuthServices).to(AuthServices);
container.bind<ITikTokServices>(SERVICES.TikTokServices).to(TikTokServices);
container.bind<IInputFileServices>(SERVICES.InputFileServices).to(InputFileServices);
container.bind<IQueueServices>(SERVICES.QueueServices).to(QueueServices);
container.bind<ISettingServices>(SERVICES.SettingServices).to(SettingServices);

const { lazyInject } = getDecorators(container);

export { lazyInject };

export default container;
