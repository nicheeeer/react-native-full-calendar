import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash';

interface IProps<T> {
  data: T;
}
export const useIsEqual = <T>({ data }: IProps<T>) => {
  const dataRef = useRef(data);

  const memoizationData: T = useMemo(() => {
    const updatedData = { ...dataRef.current, ...data };

    if (isEqual(dataRef.current, updatedData)) {
      return dataRef.current;
    } else {
      dataRef.current = updatedData;
      return updatedData;
    }
  }, [data]);

  return memoizationData;
};
