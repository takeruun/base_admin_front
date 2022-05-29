import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useProduct } from 'src/hooks/useProduct';
import { useCategory } from 'src/hooks/useCategory';
import { SelectSearchOrderItemFormInputType } from './types';

export const useDialogSelectSearchOrderItem = (
  selectedProductIds: number[]
) => {
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const { getCategories, categories } = useCategory();
  const { getProductsSearch, totalProductCount, products } = useProduct();
  const { register, setValue, getValues } =
    useForm<SelectSearchOrderItemFormInputType>({
      defaultValues: {
        categoryId: 0,
        name: ''
      }
    });

  const [selectedProducts, setSelectedProducts] =
    useState<number[]>(selectedProductIds);

  const handlePageChange = (_event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value));
  };

  const handleSelectOneProduct = (_, productId: number) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handleCreateOrderItem = (addOrderItem) => {
    selectedProducts.forEach((productId) => {
      const product = products.find(
        (p) => p.id == productId && !selectedProductIds.includes(productId)
      );
      if (product) {
        addOrderItem({
          name: product.name,
          productId: product.id,
          price: product.price,
          taxRate: 10,
          quantity: 1,
          otherPerson: false,
          productType: product.productType,
          discountAmount: 0,
          discountRate: 0
        });
      }
    });
  };

  const store = {
    selectedProducts,
    page,
    limit,
    categories,
    totalProductCount,
    products,

    register,
    setValue,
    getValues,

    getCategories,
    getProductsSearch,
    handlePageChange,
    handleLimitChange,
    handleSelectOneProduct,
    handleCreateOrderItem
  };

  return store;
};
