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

import type { Entity } from '../entity/Entity';
import schema from '../schema/kinds/Template.v1alpha1.schema.json';
import entitySchema from '../schema/Entity.schema.json';
import entityMetaSchema from '../schema/EntityMeta.schema.json';
import commonSchema from '../schema/shared/common.schema.json';
import type { JSONSchema, UISchema } from '../types';
import { ajvCompiledJsonSchemaValidator } from './util';
import { JsonObject } from '@backstage/config';

const KIND = 'Template' as const;

const ALPHA_VERSION = 'backstage.io/v1alpha1' as const;
export interface TemplateEntityV1alpha1 extends Entity {
  apiVersion: typeof ALPHA_VERSION;
  kind: typeof KIND;
  spec: {
    type: string;
    templater: string;
    path?: string;
    schema: JSONSchema;
  };
}

const BETA_VERSION = 'backstage.io/v1beta1' as const;
export interface TemplateEntityV1beta1 extends Entity {
  apiVersion: typeof BETA_VERSION;
  kind: typeof KIND;
  spec: {
    type: string;
    values: {
      schema: JSONSchema;
      uiSchema?: UISchema;
    };
    steps: { id: string; name: string; action: string; params: JsonObject }[];
    output: JsonObject;
  };
}

export const templateEntityV1alpha1Validator = ajvCompiledJsonSchemaValidator(
  KIND,
  [ALPHA_VERSION],
  schema,
  [commonSchema, entityMetaSchema, entitySchema],
);

export const templateEntityV1beta1Validator = ajvCompiledJsonSchemaValidator(
  KIND,
  [BETA_VERSION],
  schema,
  [commonSchema, entityMetaSchema, entitySchema],
);
