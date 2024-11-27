import { useRouter, useSearchParams } from "next/navigation";

interface ParamConfig {
  value: string | string[] | number | undefined;
  joinWith?: string;
}

interface UpdateSearchParamsConfig {
  url: string;
  params: Record<string, ParamConfig>;
  clearAll?: boolean;
}

export const updateSearchParams = ({
  url,
  params,
  clearAll = false,
}: UpdateSearchParamsConfig): void => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(
    clearAll ? undefined : searchParams.toString()
  );

  // Clear all existing params if clearAll is true
  if (clearAll) {
    newSearchParams.delete("*");
  }

  // Update or remove parameters based on their values
  Object.entries(params).forEach(([key, config]) => {
    if (config.value === undefined || config.value === "") {
      newSearchParams.delete(key);
    } else if (Array.isArray(config.value)) {
      if (config.value.length > 0) {
        newSearchParams.set(
          key,
          config.value.join(config.joinWith || ",")
        );
      } else {
        newSearchParams.delete(key);
      }
    } else {
      newSearchParams.set(key, config.value.toString());
    }
  });

  // Construct the new URL
  const search = newSearchParams.toString();
  const newUrl = `${url}${search ? `?${search}` : ""}`;

  // Update the URL
  router.push(newUrl);
};
