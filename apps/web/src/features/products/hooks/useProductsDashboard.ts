"use client";

import type { Product } from "@zii/types";
import { useReducer } from "react";
import { usePosProducts } from "../../pos/hooks/usePosProducts";
import { useProductMutations } from "./useProductMutations";

interface ProductsDashboardState {
  search: string;
  filterType: string;
  page: number;
  isFormModalOpen: boolean;
  selectedProduct: Product | null;
  productToDelete: Product | null;
}

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_FILTER_TYPE"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "OPEN_ADD_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: Product }
  | { type: "CLOSE_FORM_MODAL" }
  | { type: "SET_DELETE_PRODUCT"; payload: Product | null };

const initialState: ProductsDashboardState = {
  search: "",
  filterType: "all",
  page: 1,
  isFormModalOpen: false,
  selectedProduct: null,
  productToDelete: null,
};

function productsReducer(
  state: ProductsDashboardState,
  action: Action,
): ProductsDashboardState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "OPEN_ADD_MODAL":
      return { ...state, selectedProduct: null, isFormModalOpen: true };
    case "OPEN_EDIT_MODAL":
      return { ...state, selectedProduct: action.payload, isFormModalOpen: true };
    case "CLOSE_FORM_MODAL":
      return { ...state, isFormModalOpen: false, selectedProduct: null };
    case "SET_DELETE_PRODUCT":
      return { ...state, productToDelete: action.payload };
    default:
      return state;
  }
}

export function useProductsDashboard() {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const { products, totalCount, isLoading, refetch } = usePosProducts(
    state.search,
    state.filterType,
  );

  const { deleteMutation } = useProductMutations();

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = products.slice(
    (state.page - 1) * ITEMS_PER_PAGE,
    state.page * ITEMS_PER_PAGE,
  );

  const setSearch = (search: string) =>
    dispatch({ type: "SET_SEARCH", payload: search });
  const setFilterType = (filterType: string) =>
    dispatch({ type: "SET_FILTER_TYPE", payload: filterType });
  const setPage = (page: number) =>
    dispatch({ type: "SET_PAGE", payload: page });
  const setIsFormModalOpen = (isOpen: boolean) => {
    if (!isOpen) dispatch({ type: "CLOSE_FORM_MODAL" });
  };

  const handleOpenAddModal = () => dispatch({ type: "OPEN_ADD_MODAL" });
  const handleOpenEditModal = (product: Product) =>
    dispatch({ type: "OPEN_EDIT_MODAL", payload: product });
  const handleDeleteProduct = (product: Product) =>
    dispatch({ type: "SET_DELETE_PRODUCT", payload: product });
  const setProductToDelete = (product: Product | null) =>
    dispatch({ type: "SET_DELETE_PRODUCT", payload: product });

  const confirmDelete = () => {
    if (!state.productToDelete) return;
    deleteMutation.mutate(state.productToDelete.id, {
      onSuccess: () => {
        dispatch({ type: "SET_DELETE_PRODUCT", payload: null });
        refetch();
      },
    });
  };

  return {
    search: state.search,
    setSearch,
    filterType: state.filterType,
    setFilterType,
    page: state.page,
    setPage,
    totalPages,
    isFormModalOpen: state.isFormModalOpen,
    setIsFormModalOpen,
    selectedProduct: state.selectedProduct,
    productToDelete: state.productToDelete,
    setProductToDelete,
    products: paginatedProducts,
    totalCount,
    isLoading,
    deleteMutation,
    handleOpenAddModal,
    handleOpenEditModal,
    handleDeleteProduct,
    confirmDelete,
    refetch,
  };
}
