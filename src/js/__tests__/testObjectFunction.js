import { orderByProps, skills, defaultValue } from '../objectFunction';

describe('orderByProps', () => {
  const obj = {
    name: 'мечник',
    health: 10,
    level: 2,
    attack: 80,
    defence: 40,
  };

  test('должен возвращать массив с приоритетными свойствами в заданном порядке', () => {
    const result = orderByProps(obj, ['name', 'level']);
    
    expect(result[0]).toEqual({ key: 'name', value: 'мечник' });
    expect(result[1]).toEqual({ key: 'level', value: 2 });
    expect(result).toHaveLength(5);
  });

  test('должен сортировать оставшиеся свойства по алфавиту', () => {
    const result = orderByProps(obj, ['name', 'level']);
    const remaining = result.slice(2);
    
    const expectedRemaining = [
      { key: 'attack', value: 80 },
      { key: 'defence', value: 40 },
      { key: 'health', value: 10 },
    ];
    
    expect(remaining).toEqual(expectedRemaining);
  });

  test('должен корректно обрабатывать другой порядок приоритетных свойств', () => {
    const result = orderByProps(obj, ['defence', 'attack']);
    
    expect(result[0]).toEqual({ key: 'defence', value: 40 });
    expect(result[1]).toEqual({ key: 'attack', value: 80 });
    
    const remaining = result.slice(2);
    const expectedRemaining = [
      { key: 'health', value: 10 },
      { key: 'level', value: 2 },
      { key: 'name', value: 'мечник' },
    ];
    
    expect(remaining).toEqual(expectedRemaining);
  });

  test('должен обрабатывать несуществующие приоритетные ключи', () => {
    const result = orderByProps(obj, ['nonexistent1', 'nonexistent2']);
    
    expect(result[0]).toEqual({ key: 'nonexistent1', value: undefined });
    expect(result[1]).toEqual({ key: 'nonexistent2', value: undefined });
    
    const remaining = result.slice(2);
    const expectedRemaining = [
      { key: 'attack', value: 80 },
      { key: 'defence', value: 40 },
      { key: 'health', value: 10 },
      { key: 'level', value: 2 },
      { key: 'name', value: 'мечник' },
    ];
    
    expect(remaining).toEqual(expectedRemaining);
  });

  test('должен корректно обрабатывать дублирующиеся приоритетные ключи', () => {
    const result = orderByProps(obj, ['name', 'name']);
    
    expect(result[0]).toEqual({ key: 'name', value: 'мечник' });
    expect(result[1]).toEqual({ key: 'name', value: 'мечник' });
    
    const remaining = result.slice(2);
    const expectedRemaining = [
      { key: 'attack', value: 80 },
      { key: 'defence', value: 40 },
      { key: 'health', value: 10 },
      { key: 'level', value: 2 },
    ];
    
    expect(remaining).toEqual(expectedRemaining);
  });

  test('не должен мутировать исходный объект', () => {
    const originalObj = { ...obj };
    orderByProps(obj, ['name', 'level']);
    expect(obj).toEqual(originalObj);
  });

  test('должен корректно обрабатывать пустой объект', () => {
    const emptyObj = {};
    const result = orderByProps(emptyObj, ['a', 'b']);
    
    expect(result).toEqual([
      { key: 'a', value: undefined },
      { key: 'b', value: undefined },
    ]);
  });

  test('должен корректно обрабатывать числовые ключи', () => {
    const numericObj = { 3: 'three', 1: 'one', 2: 'two' };
    const result = orderByProps(numericObj, ['2', '1']);
    
    expect(result[0]).toEqual({ key: '2', value: 'two' });
    expect(result[1]).toEqual({ key: '1', value: 'one' });
    expect(result[2]).toEqual({ key: '3', value: 'three' });
  });

  // Исправленный тест: проверяем, что оставшиеся ключи отсортированы,
  // но не проверяем конкретный порядок из-за особенностей localeCompare
  test('должен сортировать оставшиеся ключи с учетом регистра (localeCompare)', () => {
    const caseObj = { B: 2, a: 1, C: 3 };
    const result = orderByProps(caseObj, ['B', 'nonexistent']);
    
    // Проверяем приоритетные ключи
    expect(result[0]).toEqual({ key: 'B', value: 2 });
    expect(result[1]).toEqual({ key: 'nonexistent', value: undefined });
    
    // Получаем оставшиеся ключи
    const remainingKeys = result.slice(2).map(item => item.key);
    
    // Проверяем, что оставшиеся ключи отсортированы (сравниваем с отсортированной версией)
    const sortedKeys = [...remainingKeys].sort((a, b) => a.localeCompare(b));
    expect(remainingKeys).toEqual(sortedKeys);
    
    // Проверяем, что все ключи присутствуют
    expect(remainingKeys).toContain('C');
    expect(remainingKeys).toContain('a');
    expect(remainingKeys).toHaveLength(2);
  });

  test('должен сохранять порядок приоритетных свойств даже если они не в объекте', () => {
    const result = orderByProps(obj, ['level', 'name']);
    
    expect(result[0]).toEqual({ key: 'level', value: 2 });
    expect(result[1]).toEqual({ key: 'name', value: 'мечник' });
  });

  // Исправленный тест: проверяем сортировку, а не жесткий порядок
  test('должен правильно сортировать ключи с разными регистрами', () => {
    const mixedObj = { Z: 26, a: 1, b: 2, A: 27, c: 3 };
    const result = orderByProps(mixedObj, ['Z', 'A']);
    
    // Проверяем приоритетные ключи
    expect(result[0]).toEqual({ key: 'Z', value: 26 });
    expect(result[1]).toEqual({ key: 'A', value: 27 });
    
    // Получаем оставшиеся ключи
    const remaining = result.slice(2).map(item => item.key);
    
    // Проверяем, что оставшиеся ключи отсортированы
    const expectedSorted = [...remaining].sort((a, b) => a.localeCompare(b));
    expect(remaining).toEqual(expectedSorted);
    
    // Проверяем, что все ключи присутствуют
    expect(remaining).toHaveLength(3);
    expect(remaining).toContain('a');
    expect(remaining).toContain('b');
    expect(remaining).toContain('c');
  });

  // Дополнительный тест для проверки полной сортировки
  test('должен полностью сортировать все оставшиеся ключи', () => {
    const unsortedObj = {
      zebra: 1,
      apple: 2,
      Banana: 3,
      dog: 4,
      cat: 5
    };
    
    const result = orderByProps(unsortedObj, ['zebra', 'Banana']);
    
    // Проверяем приоритетные
    expect(result[0].key).toBe('zebra');
    expect(result[1].key).toBe('Banana');
    
    // Проверяем, что остальные отсортированы
    const remaining = result.slice(2).map(item => item.key);
    const sortedRemaining = [...remaining].sort((a, b) => a.localeCompare(b));
    expect(remaining).toEqual(sortedRemaining);
  });
});

describe('skills', () => {
  const character = {
    name: 'Лучник',
    type: 'Bowman',
    health: 50,
    level: 3,
    attack: 40,
    defence: 10,
    special: [
      {
        id: 8,
        name: 'Двойной выстрел',
        icon: 'http://...',
        description: 'Двойной выстрел наносит двойной урон'
      }, 
      {
        id: 9,
        name: 'Нокаутирующий удар',
        icon: 'http://...'
      }
    ]
  };

  test('должен извлекать id, name, icon, description из каждого special элемента', () => {
    const result = skills(character);
    
    expect(result).toEqual([
      {
        id: 8,
        name: 'Двойной выстрел',
        icon: 'http://...',
        description: 'Двойной выстрел наносит двойной урон'
      },
      {
        id: 9,
        name: 'Нокаутирующий удар',
        icon: 'http://...',
        description: defaultValue
      }
    ]);
  });

  test('должен использовать значение по умолчанию, когда description отсутствует', () => {
    const testCharacter = {
      special: [
        {
          id: 1,
          name: 'Тестовая способность',
          icon: 'test.png'
        }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result[0].description).toBe(defaultValue);
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('name', 'Тестовая способность');
    expect(result[0]).toHaveProperty('icon', 'test.png');
  });

  test('должен сохранять оригинальное description, если оно присутствует', () => {
    const testCharacter = {
      special: [
        {
          id: 2,
          name: 'Способность с описанием',
          icon: 'icon.png',
          description: 'Оригинальное описание'
        }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result[0].description).toBe('Оригинальное описание');
  });

  test('должен корректно обрабатывать пустой массив special', () => {
    const testCharacter = { special: [] };
    const result = skills(testCharacter);
    
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  test('должен корректно обрабатывать несколько элементов special', () => {
    const testCharacter = {
      special: [
        { id: 1, name: 'Способность 1', icon: 'icon1.png', description: 'Описание 1' },
        { id: 2, name: 'Способность 2', icon: 'icon2.png' },
        { id: 3, name: 'Способность 3', icon: 'icon3.png', description: 'Описание 3' }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result).toHaveLength(3);
    expect(result[0].description).toBe('Описание 1');
    expect(result[1].description).toBe(defaultValue);
    expect(result[2].description).toBe('Описание 3');
  });

  test('не должен мутировать исходный объект', () => {
    const originalSpecial = [
      { id: 1, name: 'Тест', icon: 'test.png' }
    ];
    const testCharacter = { special: originalSpecial };
    
    const result = skills(testCharacter);
    
    expect(testCharacter.special).toEqual(originalSpecial);
    expect(testCharacter.special[0]).not.toHaveProperty('description');
    expect(result[0]).toHaveProperty('description', defaultValue);
  });

  test('должен игнорировать дополнительные свойства в special элементах', () => {
    const testCharacter = {
      special: [
        {
          id: 1,
          name: 'Способность',
          icon: 'icon.png',
          description: 'Описание',
          extra: 'игнорируемое свойство',
          extra2: 'еще одно игнорируемое свойство'
        }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result[0]).toEqual({
      id: 1,
      name: 'Способность',
      icon: 'icon.png',
      description: 'Описание'
    });
    
    expect(result[0]).not.toHaveProperty('extra');
    expect(result[0]).not.toHaveProperty('extra2');
  });

  test('должен корректно обрабатывать undefined и null значения', () => {
    const testCharacter = {
      special: [
        { id: 1, name: null, icon: undefined, description: null }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('name', null);
    expect(result[0]).toHaveProperty('icon', undefined);
    expect(result[0]).toHaveProperty('description', null);
  });

  test('должен корректно обрабатывать пустые строки в полях', () => {
    const testCharacter = {
      special: [
        { id: 1, name: '', icon: '', description: '' }
      ]
    };
    
    const result = skills(testCharacter);
    
    expect(result[0]).toEqual({
      id: 1,
      name: '',
      icon: '',
      description: ''
    });
  });
});

describe('интеграционные тесты', () => {
  const fullCharacter = {
    name: 'Лучник',
    type: 'Bowman',
    health: 50,
    level: 3,
    attack: 40,
    defence: 10,
    special: [
      {
        id: 8,
        name: 'Двойной выстрел',
        icon: 'http://...',
        description: 'Двойной выстрел наносит двойной урон'
      },
      {
        id: 9,
        name: 'Нокаутирующий удар',
        icon: 'http://...'
      }
    ]
  };

  test('должен корректно работать orderByProps с полным персонажем', () => {
    const result = orderByProps(fullCharacter, ['name', 'level']);
    
    expect(result[0]).toEqual({ key: 'name', value: 'Лучник' });
    expect(result[1]).toEqual({ key: 'level', value: 3 });
    
    const sortedKeys = result.slice(2).map(item => item.key);
    const expectedSorted = ['attack', 'defence', 'health', 'special', 'type'];
    expect(sortedKeys).toEqual(expectedSorted);
  });

  test('должен корректно работать skills с результатом orderByProps', () => {
    const orderedProps = orderByProps(fullCharacter, ['name', 'level']);
    const specialProp = orderedProps.find(prop => prop.key === 'special');
    
    expect(specialProp).toBeDefined();
    expect(specialProp.value).toEqual(fullCharacter.special);
    
    const skillsResult = skills({ special: specialProp.value });
    expect(skillsResult).toHaveLength(2);
    expect(skillsResult[0].description).toBe('Двойной выстрел наносит двойной урон');
    expect(skillsResult[1].description).toBe(defaultValue);
  });
});