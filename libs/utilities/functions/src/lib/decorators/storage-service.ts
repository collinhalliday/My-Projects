class DuplicateKeyError extends Error {
  constructor(key: string) {
    super(`${key} has already been used in session storage.`);
  }
}

/**
 * Helper class for the session storage decorator. It creates an in-memory storage of all decorated property values
 * and handles reading and writing to session storage as the values change.
 */
export class StorageService {
  private _storage = new Map<string, unknown>();

  /**
   * Create a new storage item with the provided key. Initializes it's value to what is in session storage.
   * @param key The key used for storage
   */
  init(key: string, initValue?: string) {
    if (this._storage.has(key)) {
      throw new DuplicateKeyError(key);
    }

    let storageData = sessionStorage.getItem(key) || initValue;
    // Session values may not have been stringified before using this so for now we'll let it handle both cases.
    try {
      storageData = JSON.parse(storageData);
    } catch {
      storageData = storageData || null;
    }
    this._storage.set(key, storageData);
  }

  /**
   * Retrieve the value of an item from storage with the provided key.
   * @param key The key used for storage
   */
  get(key: string) {
    return this._storage.get(key) || null;
  }

  /**
   * Set the value of an item in storage with the provided key.Does not persist the new value to session storage.
   * @param key The key used for storage
   * @param val The new value to set
   */
  set(key: string, val: unknown) {
    this._storage.set(key, val);
  }

  /**
   * Save the current value of an item to session storage.
   * Called automatically when autoSave is set to true on `SessionStorage` decorator.
   * @param key The key used for storage
   */
  save(key: string) {
    if (this._storage.has(key)) {
      sessionStorage.setItem(key, JSON.stringify(this._storage.get(key)));
    }
  }

  /**
   * Remove an item from storage and session storage
   * @param key The key used for storage
   */
  clear(key: string) {
    if (this._storage.has(key)) {
      sessionStorage.removeItem(key);
      this._storage.delete(key);
    }
  }

  /**
   * Remove all known items from session storage
   */
  clearAll() {
    for (const key of this._storage.keys()) {
      sessionStorage.removeItem(key);
    }
    this._storage.clear();
  }
}
