export const createEffect = (effect: () => void) => {
    let task: Promise<void> | null = null;
    return () => {
        if (task) return;
        task = Promise.resolve().then(() => {
            effect();
            task = null;
        });
    }
}