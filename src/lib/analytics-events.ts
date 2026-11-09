const quoteEquipment = new Set(['reefer', 'dryvan', 'flatbed']);

export function trackQuoteRequest(equipment: string) {
  window.dispatchEvent(new CustomEvent('blue-valor-conversion', {
    detail: { name: 'quote_request', equipment: quoteEquipment.has(equipment) ? equipment : 'not set' },
  }));
}

/** A rejected email submission must never produce a conversion event. */
export async function submitTrackedQuote<T>(submission: Promise<T>, equipment: string): Promise<T> {
  const result = await submission;
  trackQuoteRequest(equipment);
  return result;
}

export function trackContactRequest() {
  window.dispatchEvent(new CustomEvent('blue-valor-conversion', {
    detail: { name: 'contact_request' },
  }));
}
