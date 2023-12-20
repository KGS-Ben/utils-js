"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lru = void 0;
/**
 * Create a least recently used cache.
 * Older items are removed on insert, if the max size is reached.
 */
class Lru {
    maxSize;
    cache;
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    /**
     * Retrieve a key's value.
     *
     * @param {any} key - Identifier for a value
     * @returns {any} The value stored by the key
     */
    get(key) {
        if (this.cache.has(key)) {
            //Refresh key
            let value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return this.cache.get(key);
    }
    /**
     * Store an item in the LRU.
     *
     * @param {any} key - The identifier for the value
     * @param {any} value - The value to store
     */
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.maxSize) {
            this.cache.delete(this.getLru());
        }
        this.cache.set(key, value);
    }
    /**
     * Get the least recently used key.
     *
     * @returns {any} The least recently used key
     */
    getLru() {
        return this.cache.keys()?.next().value;
    }
    /**
     * Remove an item from the LRU.
     *
     * @param {any} key - Key to delete from LRU
     */
    delete(key) {
        this.cache.delete(key);
    }
}
exports.Lru = Lru;
//# sourceMappingURL=index.js.map