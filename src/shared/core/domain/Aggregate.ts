export default abstract class Aggregate<T> {
  protected _items: Array<T> = [];

  private initial: T[];

  private new: T[];

  private removed: T[];

  private updated: T[];

  constructor(initialItems?: Array<T>) {
    this._items = [...(initialItems || [])];
    this.initial = [...(initialItems || [])];
    this.new = [];
    this.removed = [];
    this.updated = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  public get items(): Array<T> {
    return this._items;
  }

  public get unalteredInitialItems(): Array<T> {
    return this.initial.filter(
      (item) => !this.isNewItem(item) && !this.isUpdatedItem(item) && !this.isRemovedItem(item),
    );
  }

  public get newItems(): Array<T> {
    return this.new;
  }

  public get updatedItems(): Array<T> {
    return this.updated;
  }

  public get removedItems(): Array<T> {
    return this.removed;
  }

  private isItem(item: T): boolean {
    return Boolean(this._items.find((v: T) => this.compareItems(item, v)));
  }

  private isNewItem(item: T): boolean {
    return Boolean(this.new.find((v: T) => this.compareItems(item, v)));
  }

  private isRemovedItem(item: T): boolean {
    return Boolean(this.removed.find((v: T) => this.compareItems(item, v)));
  }

  private isUpdatedItem(item: T): boolean {
    return Boolean(this.updated.find((v: T) => this.compareItems(item, v)));
  }

  private removeFromItems(item: T): void {
    this._items = this._items.filter((v) => !this.compareItems(item, v));
  }

  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item));
  }

  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v));
  }

  private removeFromUpdated(item: T): void {
    this.removed = this.updated.filter((v) => !this.compareItems(item, v));
  }

  private wasAddedInitially(item: T): boolean {
    return this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0;
  }

  public exists(item: T): boolean {
    return this.isItem(item);
  }

  /** Overrides `_items` and `initial` props; Normally used when loading relations in lazy mode */
  public setInitialItems(initialItems: Array<T>): void {
    this._items = [...initialItems];
    this.initial = [...initialItems];
  }

  public add(...items: Array<T>): void {
    items.forEach((item) => {
      if (this.isRemovedItem(item)) {
        this.removeFromRemoved(item);
      }

      if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
        this.new.push(item);
      }

      if (!this.isItem(item)) {
        this._items.push(item);
      }
    });
  }

  public remove(...itemsToRemove: Array<T>): void {
    itemsToRemove.forEach((item) => {
      this.removeFromItems(item);

      // if it is a new item it shouldn't be added to removed cause it maybe would cause a database error when trying to remove it
      if (this.isNewItem(item)) {
        this.removeFromNew(item);
        return;
      }

      if (this.isUpdatedItem(item)) {
        this.removeFromUpdated(item);
      }

      if (!this.isRemovedItem(item)) {
        this.removed.push(item);
      }
    });
  }

  public update(...itemsToUpdate: Array<T>): void {
    itemsToUpdate.forEach((item) => {
      if (!this.exists(item)) {
        this.add(item);
        return;
      }

      if (this.isRemovedItem(item)) {
        this.removeFromRemoved(item);
      }

      if (!this.isNewItem(item) && !this.isUpdatedItem(item)) {
        this.updated.push(item);
      }

      this._items = this._items.map((itemToCompare) => {
        if (this.compareItems(itemToCompare, item)) {
          return item;
        }

        return itemToCompare;
      });
    });
  }
}
