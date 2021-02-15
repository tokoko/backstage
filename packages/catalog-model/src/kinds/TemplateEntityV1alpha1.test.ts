/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  TemplateEntityV1alpha1,
  templateEntityV1alpha1Validator as validator,
  templateEntityV1beta1Validator as validatorBeta,
  TemplateEntityV1beta1,
} from './TemplateEntityV1alpha1';

describe('templateEntityV1alpha1Validator', () => {
  let entity: TemplateEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'website',
        templater: 'cookiecutter',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          required: ['storePath', 'owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
            storePath: {
              type: 'string',
              title: 'Store path',
              description: 'GitHub store path in org/repo format',
            },
          },
        },
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('accepts any other type', async () => {
    (entity as any).spec.type = 'hallo';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing templater', async () => {
    (entity as any).spec.templater = '';
    await expect(validator.check(entity)).rejects.toThrow(/templater/);
  });
});

describe('templateEntityV1beta1validator', () => {
  let entity: TemplateEntityV1beta1;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'website',
        values: {
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
        },
        steps: [
          {
            id: 'first',
            name: 'First Step',
            action: 'some:action',
            params: { storePath: '{{ values.storePath }}' },
          },
          {
            id: 'publish',
            name: 'Second Step',
            action: 'some:publish',
            params: { storePath: '{{ steps.first.output.lols }}' },
          },
          {
            id: 'register',
            name: 'Register Step',
            action: 'some:register',
            params: { storePath: '{{ steps.first.output.lols }}' },
          },
        ],
        output: {
          remoteUrl: '{{ steps.publish.output.remoteUrl }}',
          catalogInfoUrl: '{{ steps.publish.output.catalogInfoUrl }}',
          entityRef: '{{ steps.register.output.entityRef }}',
        },
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(validator.check(entity)).resolves.toBe(false);
  });

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('accepts any other type', async () => {
    (entity as any).spec.type = 'hallo';
    await expect(validator.check(entity)).resolves.toBe(true);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(validator.check(entity)).rejects.toThrow(/type/);
  });

  it('rejects missing templater', async () => {
    (entity as any).spec.templater = '';
    await expect(validator.check(entity)).rejects.toThrow(/templater/);
  });
});
