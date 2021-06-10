import { SessionStorageStub } from '@snap-monorepo/shared/utilities/test';
import { SessionStorage, storage } from './session-storage';

describe('SessionStorage', () => {
  beforeEach(() => {
    SessionStorageStub();
  });
  afterEach(() => {
    storage.clearAll();
  });

  describe('previous values', () => {
    it('inits the property if it exists in session storage', () => {
      // Decorators will run when the class is declared so we need to add items before then
      sessionStorage.setItem('prop', JSON.stringify('session value'));
      class Test {
        @SessionStorage()
        prop;
      }
      const test = new Test();
      expect(test.prop).toEqual('session value');
    });

    it('defaults to null if no previous values are found', () => {
      class Test {
        @SessionStorage()
        prop;
      }
      const test = new Test();
      expect(test.prop).toBeNull();
    });

    it('can set an optional init value', () => {
      class Test {
        @SessionStorage({ initValue: 'initValue' })
        value;
      }
      const test = new Test();
      expect(test.value).toEqual('initValue');
    });

    it('can set a default value in the constructor', () => {
      sessionStorage.setItem('savedValue', JSON.stringify('session value'));
      class Test {
        @SessionStorage()
        savedValue;
        @SessionStorage()
        defaultValue;

        constructor() {
          this.defaultValue = this.defaultValue || 'default value';
        }
      }
      const test = new Test();
      expect(test.savedValue).toEqual('session value');
      expect(test.defaultValue).toEqual('default value');
    });
  });

  describe('defaultArgs', () => {
    class Test {
      @SessionStorage()
      defaultArgs;
    }

    it('automatically saves new properties to session storage using the property name', () => {
      const test = new Test();
      test.defaultArgs = 'new value';
      expect(JSON.parse(sessionStorage.getItem('defaultArgs'))).toEqual(
        'new value'
      );
    });
  });

  it('can override the storage key', () => {
    class Test {
      @SessionStorage({ key: 'CUSTOM_KEY' })
      customKey;
    }

    const test = new Test();
    test.customKey = 'new value';
    expect(JSON.parse(sessionStorage.getItem('CUSTOM_KEY'))).toEqual(
      'new value'
    );
    expect(sessionStorage.getItem('customKey')).toBeNull();
  });

  it('can disable auto saving to session storage', () => {
    sessionStorage.setItem('prop', JSON.stringify('session value'));
    class Test {
      @SessionStorage({ autoSave: false })
      prop;
    }

    const test = new Test();
    expect(test.prop).toEqual('session value');
    test.prop = 'new value';
    expect(JSON.parse(sessionStorage.getItem('prop'))).toEqual('session value');
  });

  it('can disable auto saving and change the storage key', () => {
    sessionStorage.setItem('CUSTOM_KEY', JSON.stringify('session value'));
    class Test {
      @SessionStorage({ autoSave: false, key: 'CUSTOM_KEY' })
      prop;
    }

    const test = new Test();
    expect(test.prop).toEqual('session value');
    test.prop = 'new value';
    expect(JSON.parse(sessionStorage.getItem('CUSTOM_KEY'))).toEqual(
      'session value'
    );
    expect(sessionStorage.getItem('prop')).toBeNull();
  });
});
