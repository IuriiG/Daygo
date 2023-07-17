export class EventEmitter<T> {
    private listeners: Map<T, Set<(...args: any[]) => void>> = new Map();

    public on(event: T, fn: (...args: any[]) => void): () => void {
        let scope = this.listeners.get(event);

        if (!scope) {
            scope = new Set();
            this.listeners.set(event, scope);
        }

        scope.add(fn);

        return () => scope?.delete(fn);
    }

    public emit(event: T, ...args: any[]): void {
        const scope = this.listeners.get(event);

        if (!scope) return;
        setTimeout(() => {
            scope.forEach((fn) => fn(...args));
        }, 0);
    }

    public dispose(): void {
        this.listeners.clear();
    }
}
