import user from './user';
import snapshot from './snapshot';
import dataset from './dataset';
import job from './job';
import configuration from './configuration';
import query from './query';

export default {
  ...user,
  ...snapshot,
  ...dataset,
  ...job,
  ...configuration,
  ...query,
};
