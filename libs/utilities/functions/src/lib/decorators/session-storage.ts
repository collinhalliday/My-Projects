import { StorageService } from './storage-service';

export const storage = new StorageService();

/**
 * Decorator that makes this property read it's initial value from session storage, and optionally 
 * write any new values to session storage.
 * If there is no value in session storage it sets the property to null.
 * @param config
 */
export function SessionStorage({
  autoSave = true,
  key = '',
  initValue = null,
}: StorageOptions = {}) {
  return function (target: unknown, propName: string) {
    const storageKey = key ? key : propName;
    storage.init(storageKey, initValue);
   
    function getValue() {
      return storage.get(storageKey);
    }

    function setValueAutoSave(val: unknown) {
      storage.set(storageKey, val);
      storage.save(storageKey);
    }

    function setValue(val: unknown) {
      storage.set(storageKey, val);
    }

    Object.defineProperty(target, propName, {
      configurable: true,
      enumerable: true,
      get: getValue,
      set: autoSave ? setValueAutoSave : setValue,
    });
  };
}

interface StorageOptions {
  autoSave?: boolean;
  key?: string;
  initValue?: string;
}
