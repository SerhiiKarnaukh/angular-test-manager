export function flattenApiErrors(data: Record<string, unknown>): string[] {
  const messages: string[] = [];

  for (const property of Object.keys(data)) {
    const value = data[property];
    if (Array.isArray(value)) {
      messages.push(...value.map(String));
    } else if (value != null) {
      messages.push(String(value));
    }
  }

  return messages;
}
