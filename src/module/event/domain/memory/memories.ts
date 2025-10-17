import Memory from './memory';

import Aggregate from '@/shared/core/domain/Aggregate';

export class Memories extends Aggregate<Memory> {
  private constructor(initialItems?: Array<Memory>) {
    super(initialItems);
  }

  compareItems(a: Memory, b: Memory): boolean {
    return a.equals(b);
  }

  get totalMemories(): number {
    return this.items.length;
  }

  public static create(initialItems?: Array<Memory>): Memories {
    return new Memories(initialItems);
  }
}
