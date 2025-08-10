import { useEffect, useState } from "react";

const usePaginatedQuery = (useGetQuery: any, params: {}, limit: number) => {
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: currentPageData, isLoading, isFetching, refetch } = useGetQuery({ ...params, limit, offset });

  useEffect(() => {
    if (currentPageData) {
      setItems((prev) => [...prev, ...currentPageData]);
    }
  }, [currentPageData]);

  const loadMore = (): void => {
    if (!isFetching && !isLoading && currentPageData.length === limit) {
      setOffset((prev) => prev + limit);
    }
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    setItems([]);
    setOffset(0);
    refetch();
  };

  return {
    items,
    isLoading,
    isFetching,
    refreshing,
    onRefresh,
    loadMore,
  };
};

export default usePaginatedQuery;
