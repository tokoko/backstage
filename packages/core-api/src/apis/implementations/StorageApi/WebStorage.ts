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
import { StorageApi, ObservableMessage } from '../../definitions';
import { Observable } from '../../../types';
import ObservableImpl from 'zen-observable';

export class WebStorage implements StorageApi {
  constructor(private readonly namespace: string = '') {}

  get<T>(key: string): T | undefined {
    try {
      const storage = JSON.parse(localStorage.getItem(this.getKeyName(key))!);
      return storage ?? undefined;
    } catch (e) {
      window.console.error(
        `Error when parsing JSON config from storage for: ${key}`,
        e,
      );
    }

    return undefined;
  }

  forBucket(name: string): WebStorage {
    return new WebStorage(`${this.namespace}/${name}`);
  }

  async set<T>(key: string, data: T): Promise<void> {
    localStorage.setItem(this.getKeyName(key), JSON.stringify(data, null, 2));
    this.notifyChanges({ key, newValue: data });
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.getKeyName(key));
    this.notifyChanges({ key, newValue: undefined });
  }

  observe$<T>(key: string): Observable<ObservableMessage<T>> {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }

  private getKeyName(key: string) {
    return `${this.namespace}/${key}`;
  }

  private notifyChanges<T>(message: ObservableMessage<T>) {
    for (const subscription of this.subscribers) {
      subscription.next(message);
    }
  }

  private subscribers: Set<
    ZenObservable.SubscriptionObserver<ObservableMessage>
  > = new Set();

  private readonly observable = new ObservableImpl<ObservableMessage>(
    subscriber => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    },
  );
}
