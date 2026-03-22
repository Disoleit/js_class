import { healthStatus, healthStatistic } from "../app.js"

test.each([
  [{ name: 'Маг', health: 90 }, "healthy"],
  [{ name: 'Воин', health: 50 }, "wounded"],
  [{ name: 'Лучник', health: 30 }, "wounded"],
  [{ name: 'Лекарь', health: 16 }, "wounded"],
  [{ name: 'Вор', health: 15 }, "critical"],
  [{ name: 'Паладин', health: 0 }, "critical"]
])("healthStatus for %o should return %s", (char, expected) => {
  expect(healthStatus(char)).toEqual(expected);
});

test("healthStatistic", () => {
    const chars = [
        {name: 'мечник', health: 10},
        {name: 'маг', health: 100},
        {name: 'лучник', health: 80},
    ]

    const sortedChars = [
        {name: 'маг', health: 100},
        {name: 'лучник', health: 80},
        {name: 'мечник', health: 10},
    ]
    expect(healthStatistic(chars)).toEqual(sortedChars) 
});