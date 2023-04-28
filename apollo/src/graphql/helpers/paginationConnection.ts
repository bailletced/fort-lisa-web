export const DEFAULT_PAGINATION_AMOUNT = 50;

export const generateArgumentsForConnection = (
  args: {
    after?: string | null | undefined;
    before?: string | null | undefined;
    first?: number | null | undefined;
    last?: number | null | undefined;
  },
  cursorWithKey: { key: string; value: string } | null
) => {
  const params: {
    skip: number;
    take: number;
    cursor?: Record<string, string>;
  } = {
    skip: 0,
    take: args.after
      ? (args.first as number) ?? DEFAULT_PAGINATION_AMOUNT
      : args.before
      ? (args.last as number) * -1 ?? DEFAULT_PAGINATION_AMOUNT
      : DEFAULT_PAGINATION_AMOUNT,
  };
  if (cursorWithKey) {
    params["cursor"] = { [cursorWithKey.key as string]: cursorWithKey.value };
  }
  return params;
};

export const extractIdFromCursor = (args: {
  after?: string | null | undefined;
  before?: string | null | undefined;
  first?: number | null | undefined;
  last?: number | null | undefined;
}): string =>
  Buffer.from(args.after ?? args.before ?? "", "utf8").toString("utf8");
