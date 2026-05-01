function convertSecondsToTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3).padStart(6, "0");
    return `${minutes}:${remainingSeconds}`;
}

export {
    convertSecondsToTime
};