import Aggregate from './Aggregate';

class NamesAggregate extends Aggregate<string> {
  compareItems(a: string, b: string): boolean {
    return a === b;
  }
}

describe('Aggregate', () => {
  it('should include initial items to items list', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    expect(namesList.items).toHaveLength(3);
    expect(namesList['initial']).toHaveLength(3);
  });

  it('should add new items from both "new" list and items list', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.add('Robert');

    expect(namesList.items).toHaveLength(4);
    expect(namesList.newItems).toHaveLength(1);
  });

  it('should remove items from both "removed" list and items list', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.remove('John');

    expect(namesList.items).toHaveLength(2);
    expect(namesList.removedItems).toHaveLength(1);
  });

  it('should just remove item from "new" list and do not include it on "remove" list when it is removed and it was a new item', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.add('Robert');
    namesList.remove('Robert');

    expect(namesList.items).toHaveLength(3);
    expect(namesList.newItems).toHaveLength(0);
    expect(namesList.removedItems).toHaveLength(0);
  });

  it('should remove item from "remove" list if it is beeing added again', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.remove('John');
    namesList.add('John');

    expect(namesList.items).toHaveLength(3);
    expect(namesList.newItems).toHaveLength(0);
    expect(namesList.removedItems).toHaveLength(0);
  });

  it('should only add item to the "new" list if it was not an initial item', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.add('Robert');

    namesList.remove('John');
    namesList.add('John');

    expect(namesList.items).toHaveLength(4);
    expect(namesList.newItems).toHaveLength(1);
    expect(namesList.removedItems).toHaveLength(0);
  });

  it('should be able to add multiple items once', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.add('Robert', 'Diana');

    expect(namesList.items).toHaveLength(5);
    expect(namesList.newItems).toHaveLength(2);
    expect(namesList.removedItems).toHaveLength(0);
  });

  it('should be able to remove multiple items once', () => {
    const namesList = new NamesAggregate(['John', 'Doe', 'Silva']);

    namesList.remove('John', 'Silva');

    expect(namesList.items).toHaveLength(1);
    expect(namesList.newItems).toHaveLength(0);
    expect(namesList.removedItems).toHaveLength(2);
  });
});
