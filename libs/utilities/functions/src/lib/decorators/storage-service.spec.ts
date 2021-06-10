import { StorageService } from './storage-service';
import { SessionStorageStub } from '@snap-monorepo/shared/utilities/test';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    SessionStorageStub();
    service = new StorageService();
    service.set('item', 'item value');
  });

  describe('init', () => {
    it('initializes the value of the new key from session storage if set', () => {
      sessionStorage.setItem('newItem', JSON.stringify('value'));
      service.init('newItem');
      expect(service.get('newItem')).toEqual('value');
    });

    it('can initialize a value that is not JSON stringified', () => {
      sessionStorage.setItem('newItem', 'value');
      service.init('newItem');
      expect(service.get('newItem')).toEqual('value');
    });

    it('initializes as the initValue if initValue is passed when called', () => {
      service.init('newItem', 'initValue');
      expect(service.get('newItem')).toBe('initValue');
    });

    it('initValue is overwritten by new value as soon as new value is set', () => {
      service.init('newItem', 'initValue');
      expect(service.get('newItem')).toBe('initValue');
      service.set('newItem', 'newValue');
      expect(service.get('newItem')).toBe('newValue');
    });

    it('defaults to null if nothing exists in session storage and no initValue is passed', () => {
      service.init('newItem');
      expect(service.get('newItem')).toBeNull();
    });

    it('throws an exception if the same key is used twice', () => {
      service.init('newItem');
      expect(() => service.init('newItem')).toThrow();
    });
  });

  describe('get', () => {
    it('returns null if a value has not been stored', () => {
      expect(service.get('noItem')).toBeNull();
    });

    it('returns the item if it has been stored', () => {
      expect(service.get('item')).toBe('item value');
    });
  });

  describe('set', () => {
    it('sets the value in memory', () => {
      service.init('newItem');
      service.set('newItem', 'newValue');
      expect(service.get('newItem')).toEqual('newValue');
    });

    it('does not save the new value to session storage', () => {
      service.init('newItem');
      service.set('newItem', 'newValue');
      expect(sessionStorage.getItem('newItem')).toBeNull();
    });
  });

  describe('save', () => {
    it('saves the state of the item to session storage', () => {
      service.init('newItem');
      service.set('newItem', 'value');
      service.set('newItem', 'new value');
      service.save('newItem');
      expect(JSON.parse(sessionStorage.getItem('newItem'))).toEqual(
        'new value'
      );
    });

    it('stringifies objects', () => {
      const value = { name: 'test' };
      service.init('newItem');
      service.set('newItem', value);
      service.save('newItem');
      expect(JSON.parse(sessionStorage.getItem('newItem'))).toEqual(value);
    });
  });

  describe('clear', () => {
    it('removes an item from memory and session storage', () => {
      sessionStorage.setItem('newItem', JSON.stringify('value'));
      service.init('newItem');
      service.clear('newItem');
      expect(service.get('newItem')).toBeNull();
      expect(sessionStorage.getItem('newItem')).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('removes all known keys from memory and session storage', () => {
      sessionStorage.setItem('newItem', JSON.stringify('value'));
      service.init('newItem');
      sessionStorage.setItem('otherItem', JSON.stringify('other value'));
      service.init('otherItem');
      service.clearAll();

      expect(service.get('newItem')).toBeNull();
      expect(sessionStorage.getItem('newItem')).toBeNull();
      expect(service.get('otherItem')).toBeNull();
      expect(sessionStorage.getItem('otherItem')).toBeNull();
    });

    it('does not remove other data from session storage', () => {
      sessionStorage.setItem('some other key', 'value from somewhere else');
      service.clearAll();
      expect(sessionStorage.getItem('some other key')).toEqual(
        'value from somewhere else'
      );
    });
  });
});
