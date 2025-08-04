/* eslint-disable no-use-before-define */

import UniqueEntityID from './UniqueEntityID';

const isEntity = (v: unknown): v is Entity<unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return v instanceof Entity;
};

export default abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;

  public readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : UniqueEntityID.create();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return Boolean(this._id?.equals(object._id));
  }
}
