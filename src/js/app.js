export function healthStatus(char) {
    if (char.health > 50) {
        return "healthy"
    } else if (char.health <= 50 && char.health > 15) {
        return "wounded"
    } else if (char.health <= 15) {
        return "critical"
    } else return "error"
}

export function healthStatistic(chars) {
    return chars.sort((a, b) => b.health - a.health);
}