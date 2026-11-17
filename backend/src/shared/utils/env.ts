import envConfig from '../../config/env/index.ts';

/** Single place to read configuration values from. */
export default class Env {
  /**
   * Get a setting by name, e.g. Env.get<string>('DATABASE_URL').
   * Looks in the active environment config first, then in the raw environment variables.
   * Returns undefined when the setting is missing or blank.
   */
  static get<T = string>(key: string): T | undefined {
    const config: Record<string, unknown> = { ...envConfig };
    const value = config[key] ?? process.env[key];
    return value === undefined || value === '' ? undefined : (value as T);
  }
}
