import { environment } from '@environment';

import { MPlatformEnvironment } from '@mercadona/core/platform';

describe('AppComponent', () => {
  it('environment env must exist', () => {
    const env: MPlatformEnvironment = environment.env;
    expect(env).toBeDefined();
  });

  it('environment production must exist', () => {
    const production = environment.production;
    expect(production).toBeDefined();
  });
});
