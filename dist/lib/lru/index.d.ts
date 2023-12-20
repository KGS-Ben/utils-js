/**
 * Create a least recently used cache.
 * Older items are removed on insert, if the max size is reached.
 */
export declare class Lru {
    maxSize: number;
    cache: Map<any, any>;
    constructor(maxSize: number);
    /**
     * Retrieve a key's value.
     *
     * @param {any} key - Identifier for a value
     * @returns {any} The value stored by the key
     */
    get(key: any): any;
    /**
     * Store an item in the LRU.
     *
     * @param {any} key - The identifier for the value
     * @param {any} value - The value to store
     */
    set(key: any, value: any): void;
    /**
     * Get the least recently used key.
     *
     * @returns {any} The least recently used key
     */
    getLru(): any;
    /**
     * Remove an item from the LRU.
     *
     * @param {any} key - Key to delete from LRU
     */
    delete(key: any): void;
}
