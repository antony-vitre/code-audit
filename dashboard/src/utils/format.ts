export const formatDate = (
  val?: string,
  options?: Intl.DateTimeFormatOptions,
) => {
  return val
    ? Number.isNaN(new Date(val).getTime())
      ? String(val)
      : new Intl.DateTimeFormat(
          'fr-FR',
          options || {
            day: '2-digit',
            month: '2-digit',
          },
        ).format(new Date(val))
    : '-';
};

export const formatDuration = (time: number | undefined) => {
  const value = Number(time || 0);
  return value
    ? value < 1000
      ? `${value} ms`
      : `${(value / 1000).toFixed(1)} s`
    : '-';
};
