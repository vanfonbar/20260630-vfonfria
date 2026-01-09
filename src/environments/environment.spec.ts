import { environment } from '@environment';

import { MPlatformEnvironment } from '@mercadona/core/platform';

describe('AppComponent', () => {
  it('environment env must exist', () => {
    const env: MPlatformEnvironment = environment.env;
    expect(env).toBeDefined();
  });
});
