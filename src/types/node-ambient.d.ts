declare var process: {
  env: Record<string, string | undefined>;
  cwd?: () => string;
  platform?: string;
  version?: string;
};

declare var require: (id: string) => any;
declare var Buffer: {
  from(data: string | Uint8Array, encoding?: string): { toString(encoding?: string): string };
};

declare module "node:vm" {
  export type Context = Record<string, unknown>;
  export interface RunningScriptOptions {
    timeout?: number;
    displayErrors?: boolean;
  }
  export class Script {
    constructor(code: string, options?: { filename?: string; timeout?: number });
    runInContext(contextifiedObject: Context, options?: RunningScriptOptions): unknown;
    runInNewContext(contextObject?: Context, options?: RunningScriptOptions): unknown;
  }
  export function createContext(sandbox?: Context): Context;
  export function runInNewContext(code: string, contextObject?: Context, options?: RunningScriptOptions): unknown;
}

declare module "node:child_process" {
  export interface SpawnSyncOptionsWithStringEncoding {
    input?: string;
    encoding: "utf8" | "utf-8" | "ascii";
    timeout?: number;
    windowsHide?: boolean;
    cwd?: string;
    env?: Record<string, string | undefined>;
  }
  export interface SpawnSyncReturns<T> {
    pid: number;
    output: Array<T | null>;
    stdout: T;
    stderr: T;
    status: number | null;
    signal: string | null;
    error?: Error;
  }
  export function spawnSync(
    command: string,
    args: ReadonlyArray<string>,
    options: SpawnSyncOptionsWithStringEncoding
  ): SpawnSyncReturns<string>;
}

declare module "node:test" {
  export interface TestContext {
    name: string;
  }
  export function describe(name: string, fn: () => void | Promise<void>): void;
  export function it(name: string, fn: (t: TestContext) => void | Promise<void>): void;
  export function test(name: string, fn: (t: TestContext) => void | Promise<void>): void;
  export function before(fn: () => void | Promise<void>): void;
  export function after(fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
}

declare module "node:assert" {
  function assert(value: unknown, message?: string | Error): asserts value;
  namespace assert {
    function ok(value: unknown, message?: string | Error): asserts value;
    function strictEqual<T>(actual: unknown, expected: T, message?: string | Error): asserts actual is T;
    function notStrictEqual(actual: unknown, expected: unknown, message?: string | Error): void;
    function deepStrictEqual<T>(actual: unknown, expected: T, message?: string | Error): asserts actual is T;
    function throws(block: () => unknown, message?: string | RegExp | Error): void;
    function rejects(block: (() => Promise<unknown>) | Promise<unknown>, message?: string | RegExp | Error): Promise<void>;
  }
  export default assert;
}

declare module "node:fs" {
  const fs: {
    readFileSync(path: string, encoding: string): string;
    writeFileSync(path: string, data: string, encoding?: string): void;
    existsSync(path: string): boolean;
  };
  export default fs;
  export const readFileSync: (path: string, encoding: string) => string;
  export const writeFileSync: (path: string, data: string, encoding?: string) => void;
  export const existsSync: (path: string) => boolean;
}

declare module "node:path" {
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(p: string): string;
    basename(p: string, ext?: string): string;
  };
  export default path;
  export const join: (...paths: string[]) => string;
  export const resolve: (...paths: string[]) => string;
  export const dirname: (p: string) => string;
  export const basename: (p: string, ext?: string) => string;
}

declare module "zod" {
  export interface ZodFormattedError {
    _errors: string[];
    [key: string]: unknown;
  }
  export interface SafeParseSuccess<T> {
    success: true;
    data: T;
  }
  export interface SafeParseError {
    success: false;
    error: {
      message: string;
      format: () => ZodFormattedError;
      issues?: unknown[];
    };
  }
  export type SafeParseReturnType<T> = SafeParseSuccess<T> | SafeParseError;

  export interface ZodType<T = any> {
    _output: T;
    min(n: number, message?: string): ZodType<T>;
    max(n: number, message?: string): ZodType<T>;
    default<D extends T>(val: D): ZodType<T>;
    optional(): ZodType<T | undefined>;
    nullable(): ZodType<T | null>;
    parse(data: unknown): T;
    safeParse(data: unknown): SafeParseReturnType<T>;
  }

  export namespace z {
    type infer<T extends ZodType<any>> = T["_output"];
  }

  export interface ZodNamespace {
    string(): ZodType<string>;
    number(): ZodType<number>;
    boolean(): ZodType<boolean>;
    any(): ZodType<any>;
    unknown(): ZodType<unknown>;
    array<T extends ZodType<any>>(schema: T): ZodType<Array<T["_output"]>>;
    enum<const T extends readonly [string, ...string[]]>(values: T): ZodType<T[number]>;
    record<V extends ZodType<any>>(valueType: V): ZodType<Record<string, V["_output"]>>;
    object<S extends Record<string, ZodType<any>>>(
      shape: S
    ): ZodType<{ [K in keyof S]: S[K]["_output"] }>;
  }

  export const z: ZodNamespace;
  export default z;
}

declare module "react" {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P) => any;
  export type FormEvent<T = any> = any;
  export type ChangeEvent<T = any> = any;
  export type MouseEvent<T = any> = any;
  export type KeyboardEvent<T = any> = any;
  export type CSSProperties = Record<string, any>;
  export interface RefObject<T> {
    current: T;
  }
  export interface Context<T> {
    Provider: any;
    Consumer: any;
  }
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useState<T = undefined>(): [T | undefined, (value: T | undefined | ((prev: T | undefined) => T | undefined)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<unknown>): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<unknown>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<unknown>): T;
  export function useRef<T>(initialValue: T): RefObject<T>;
  export function useRef<T>(initialValue: T | null): RefObject<T | null>;
  export function useContext<T>(context: Context<T>): T;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function use<T>(usable: Promise<T> | Context<T>): T;
  export const Suspense: any;
  export const Fragment: any;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    useRef: typeof useRef;
    useContext: typeof useContext;
    createContext: typeof createContext;
    use: typeof use;
    Suspense: any;
    Fragment: any;
    ReactNode?: any;
    FC?: any;
  };
  export default React;
}

declare module "react/jsx-runtime" {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
  }
}

declare module "react/jsx-dev-runtime" {
  export const Fragment: any;
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: boolean, source?: any, self?: any): any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element {}
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "next" {
  export type NextConfig = Record<string, any>;
  export type Metadata = Record<string, any>;
}

declare module "next/link" {
  const Link: any;
  export default Link;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
    refresh: () => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
}

declare module "next/server" {
  export class NextRequest extends Request {
    nextUrl: URL;
    cookies: any;
  }
  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    cookies: any;
  }
}

declare module "lucide-react" {
  export const Play: any;
  export const RotateCcw: any;
  export const Sparkles: any;
  export const HelpCircle: any;
  export const Bug: any;
  export const CheckCircle2: any;
  export const XCircle: any;
  export const Terminal: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const BookOpen: any;
  export const Code2: any;
  export const Clock: any;
  export const Send: any;
  export const Eye: any;
  export const Layers: any;
  export const ChevronRight: any;
  export const ChevronDown: any;
  export const ChevronLeft: any;
  export const ShieldAlert: any;
  export const Shield: any;
  export const ShieldCheck: any;
  export const Lightbulb: any;
  export const Shuffle: any;
  export const Trophy: any;
  export const FileCode2: any;
  export const AlertTriangle: any;
  export const AlertCircle: any;
  export const RefreshCw: any;
  export const Check: any;
  export const Search: any;
  export const Filter: any;
  export const PlusCircle: any;
  export const ToggleLeft: any;
  export const ToggleRight: any;
  export const Flame: any;
  export const Zap: any;
  export const Target: any;
  export const Brain: any;
  export const Award: any;
  export const BarChart3: any;
  export const TrendingUp: any;
  export const Lock: any;
  export const Unlock: any;
  export const User: any;
  export const LogOut: any;
  export const Settings: any;
  export const Sun: any;
  export const Moon: any;
  export const Menu: any;
  export const X: any;
  export const Copy: any;
  export const Trash2: any;
  export const Edit: any;
  export const ExternalLink: any;
  export const Info: any;
  export const Loader2: any;
}

declare module "@monaco-editor/react" {
  const Editor: any;
  export default Editor;
}

declare module "openai" {
  export class OpenAI {
    constructor(config?: Record<string, unknown>);
    chat: {
      completions: {
        create(params: Record<string, unknown>): Promise<any>;
      };
    };
  }
  export default OpenAI;
}

declare module "ts-fsrs" {
  export enum Rating {
    Manual = 0,
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
  }
  export enum State {
    New = 0,
    Learning = 1,
    Review = 2,
    Relearning = 3,
  }
  export interface Card {
    due: Date;
    stability: number;
    difficulty: number;
    elapsed_days: number;
    scheduled_days: number;
    reps: number;
    lapses: number;
    state: State;
    last_review?: Date;
  }
  export function createEmptyCard(now?: Date): Card;
  export class FSRS {
    constructor(params?: Record<string, unknown>);
    repeat(card: Card, now: Date): Record<number, { card: Card }>;
  }
}

declare module "clsx" {
  export type ClassValue = any;
  export function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}

declare module "tailwind-merge" {
  export function twMerge(...classLists: string[]): string;
}

declare module "@supabase/ssr" {
  export function createBrowserClient(...args: any[]): any;
  export function createServerClient(...args: any[]): any;
}

declare module "@supabase/supabase-js" {
  export function createClient(...args: any[]): any;
}

