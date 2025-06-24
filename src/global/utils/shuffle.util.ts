export function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]; // 원본을 수정하지 않도록 복사
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}