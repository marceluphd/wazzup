export function validateStringLength(text: string, limit: number): string {
  let errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = `* Cannot be more than ${limit} characters`;
  } else if (text.trim().length <= 0) {
    errorMessage = '* Cannot be empty';
  } else {
    errorMessage = '';
  }
  return errorMessage;
}

export function generateMessage(from: string, body: string): object {
  return {
    from,
    body,
    createdAt: new Date()
  };
}

export function generateLocationMessage(
  from: string,
  lat: string,
  lng: string
): object {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: new Date()
  };
}

export function isRealString(str: string): boolean {
  return typeof str === 'string' && str.trim().length > 0;
}
