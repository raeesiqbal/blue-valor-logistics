type CalculatorQuoteDefaults = {
  equipmentType: string;
  weight: string;
  temperature: string;
  reeferMode: '' | 'continuous' | 'start-stop' | 'not-sure';
  freightDescription: string;
};

export function calculatorQuoteDefaults(search: string): CalculatorQuoteDefaults {
  const params = new URLSearchParams(search);
  const requested = params.get('equipment') ?? '';
  const equipmentType = ['reefer', 'dryvan', 'flatbed'].includes(requested) ? requested : '';
  const number = (key: string, allowNegative = false) => {
    const value = params.get(key)?.trim() ?? '';
    return value.length <= 30 && value !== '' && Number.isFinite(Number(value)) && (allowNegative || Number(value) >= 0)
      ? String(Number(value)) : '';
  };
  const weight = number('weight');
  const temperature = equipmentType === 'reefer' ? number('temp', true) : '';
  const requestedMode = (params.get('mode') ?? '').toLowerCase().replace(/\s+/g, '-');
  const reeferMode = equipmentType === 'reefer' && ['continuous', 'start-stop', 'not-sure'].includes(requestedMode)
    ? requestedMode as 'continuous' | 'start-stop' | 'not-sure' : '';
  const details: string[] = [];
  if (equipmentType === 'reefer' || equipmentType === 'dryvan') {
    const pallets = number('pallets');
    if (pallets !== '') details.push(`${pallets} pallets`);
    if (equipmentType === 'dryvan' && ['yes', 'no'].includes(params.get('stack') ?? '')) {
      details.push(`pallets stackable: ${params.get('stack') === 'yes' ? 'Yes' : 'No'}`);
    }
  }
  if (equipmentType === 'flatbed') {
    for (const [key, label] of [['length', 'long'], ['width', 'wide'], ['height', 'tall']]) {
      const value = number(key);
      if (value !== '') details.push(`${value} ft ${label}`);
    }
    if (params.get('tarps') === 'yes') details.push('tarps needed');
    if (params.get('tarps') === 'no') details.push('no tarps needed');
  }
  return {
    equipmentType,
    weight,
    temperature,
    reeferMode,
    freightDescription: details.length ? `From the load calculator: ${details.join(', ')}.` : '',
  };
}
