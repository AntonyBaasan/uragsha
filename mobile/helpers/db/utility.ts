export interface QueryParam {
  condition: string;
  // tslint:disable-next-line: prefer-array-literal
  params: Array<string>;
}
export const buildDateCondition = (
  startDay?: string,
  endDay?: string,
): QueryParam => {
  if (startDay != null && endDay != null) {
    return {
      condition: 'where day>=? and day<=?',
      params: [startDay, endDay],
    };
  }
  if (startDay != null) {
    return {
      condition: 'where day>=?',
      params: [startDay],
    };
  }
  if (endDay != null) {
    return {
      condition: 'where day<=?',
      params: [endDay],
    };
  }
  return {
    condition: '',
    params: [],
  };
};
