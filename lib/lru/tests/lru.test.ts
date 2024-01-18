import { Lru } from '../index';

describe('LruCache', () => {
    it('should add keys', () => {
        let lru = new Lru(1);
        lru.set('key', 'value');

        expect(lru.getLru()).toEqual('key');
    });

    it('should get values', () => {
        let lru = new Lru(2);
        lru.set('key', 'value');
        lru.set('hello', 'world');

        expect(lru.get('key')).toEqual('value');
        expect(lru.get('hello')).toEqual('world');
    });

    it('should not get values if key was not stored', () => {
        let lru = new Lru(2);
        lru.set('key', 'value');

        expect(lru.get('hello')).toEqual(undefined);
    });

    it('should refresh keys', () => {
        let lru = new Lru(2);
        lru.set('first key', 'value 1');
        lru.set('second key', 'value 2');
        lru.set('first key', 'value 1');

        expect(lru.getLru()).toEqual('second key');
    });

    it('should remove oldest keys if full', () => {
        let lru = new Lru(1);
        lru.set('first key', 'value 1');
        lru.set('second key', 'value 2');

        expect(lru.getLru()).toEqual('second key');
    });

    it('should be able to delete keys', () => {
        let lru = new Lru(1);
        lru.set('first key', 'value 1');
        lru.delete('first key');

        expect(lru.getLru()).toEqual(undefined);
        lru.delete('first key');
        expect(lru.getLru()).toEqual(undefined);
    });
});
