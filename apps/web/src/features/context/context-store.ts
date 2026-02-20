import { TeamContext } from "../../types/analysis";
import { fetchContext, saveContext } from "./context-api";

type Listener = (context: TeamContext | null) => void;

export class ContextStore {
  private value: TeamContext | null = null;
  private readonly listeners = new Set<Listener>();

  get(): TeamContext | null {
    return this.value;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async bootstrap(): Promise<void> {
    this.value = await fetchContext();
    this.emit();
  }

  async set(context: TeamContext): Promise<void> {
    this.value = await saveContext(context);
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener(this.value));
  }
}
