'use client';

interface SearchParamValue {
  value: string | string[] | number | number[] | undefined;
  append?: boolean;
  remove?: boolean;
  joinWith?: string;
}

interface UpdateSearchParamsOptions {
  url: string;
  params: Record<string, SearchParamValue>;
  clearAll?: boolean;
}

export function updateSearchParams(options: UpdateSearchParamsOptions) {
  const { url, params, clearAll } = options;
  const searchParams = clearAll ? new URLSearchParams() : new URLSearchParams(window.location.search);

  if (clearAll) {
    window.history.pushState({}, '', url);
    return;
  }

  // Process each param
  Object.entries(params).forEach(([key, param]) => {
    // If removing a specific value from an array
    if (param.remove && Array.isArray(param.value)) {
      const currentValue = searchParams.get(key);
      if (currentValue) {
        const values = currentValue.split(param.joinWith || '+');
        const valueArray = param.value.map(v => v.toString());
        const newValues = values.filter(v => !valueArray.includes(v));
        if (newValues.length > 0) {
          searchParams.set(key, newValues.join(param.joinWith || '+'));
        } else {
          searchParams.delete(key);
        }
      }
      return;
    }

    // Clear existing values for this key unless appending
    if (!param.append) {
      searchParams.delete(key);
    }

    // Skip if value is undefined, null, empty string, or empty array
    if (
      param.value === undefined ||
      param.value === null ||
      param.value === "" ||
      (Array.isArray(param.value) && param.value.length === 0)
    ) {
      return;
    }

    // Handle array values
    if (Array.isArray(param.value)) {
      const value = param.value.map(v => v.toString()).join(param.joinWith || '+');
      if (param.append) {
        const currentValue = searchParams.get(key);
        if (currentValue) {
          searchParams.set(key, currentValue + (param.joinWith || '+') + value);
        } else {
          searchParams.set(key, value);
        }
      } else {
        searchParams.set(key, value);
      }
    } else {
      // Handle single values
      searchParams.set(key, param.value.toString());
    }
  });

  // Update URL
  const search = searchParams.toString();
  const newUrl = search ? `${url}?${search}` : url;
  window.history.pushState({}, '', newUrl);
}
