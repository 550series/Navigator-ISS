export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateRequired(value: unknown, fieldName: string): void {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(`${fieldName} 不能为空`, fieldName);
  }
}

export function validateNumber(value: unknown, fieldName: string, options?: { min?: number; max?: number }): void {
  if (typeof value !== "number" || isNaN(value)) {
    throw new ValidationError(`${fieldName} 必须是数字`, fieldName);
  }
  if (options?.min !== undefined && value < options.min) {
    throw new ValidationError(`${fieldName} 不能小于 ${options.min}`, fieldName);
  }
  if (options?.max !== undefined && value > options.max) {
    throw new ValidationError(`${fieldName} 不能大于 ${options.max}`, fieldName);
  }
}

export function validateString(value: unknown, fieldName: string, options?: { minLength?: number; maxLength?: number }): void {
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} 必须是字符串`, fieldName);
  }
  if (options?.minLength !== undefined && value.length < options.minLength) {
    throw new ValidationError(`${fieldName} 长度不能小于 ${options.minLength}`, fieldName);
  }
  if (options?.maxLength !== undefined && value.length > options.maxLength) {
    throw new ValidationError(`${fieldName} 长度不能大于 ${options.maxLength}`, fieldName);
  }
}

export function validateEnum<T extends string>(value: unknown, fieldName: string, allowedValues: T[]): asserts value is T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(`${fieldName} 必须是以下之一: ${allowedValues.join(", ")}`, fieldName);
  }
}

export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.error(`Failed to save to localStorage: ${key}`);
    return false;
  }
}
