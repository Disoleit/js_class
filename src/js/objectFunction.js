// сортированная таблица свойств

export function orderByProps(obj, [arg1, arg2]) {
    const priorityProps = [];
    priorityProps.push({ key: arg1, value: obj[arg1] });
    priorityProps.push({ key: arg2, value: obj[arg2] });
    const sortedObj = []
    for (const item in obj) {
        if (item === arg1 || item === arg2) {
            continue
        } else {
            sortedObj.push({ key: item, value: obj[item] });
        }
    }
    sortedObj.sort((a, b) => {
    const keyCompare = a.key.localeCompare(b.key);
    if (keyCompare !== 0) return keyCompare;
    })
    const sorted = priorityProps.concat(sortedObj)
    return sorted
}

// варианты атак

export const defaultValue = 'Описание недоступно'

export const skills = ({ special }) => {
    return special.map(({ id, name, icon, description = defaultValue }) => ({
        id,
        name,
        icon,
        description
    }));
}

