import { assetUrl } from '../../lib/api';
import { firstProductImage } from '../../lib/productImages';
import { cn } from '../../lib/format';
import ProductVisual from './ProductVisual';

export default function ProductImage({ product, className = '', imgClassName = '' }) {
  const image = firstProductImage(product);

  if (image) {
    return (
      <img
        src={assetUrl(image)}
        alt={product.name}
        loading="lazy"
        className={cn('h-full w-full object-cover', className, imgClassName)}
      />
    );
  }

  return (
    <ProductVisual
      category={product?.category?.slug || product?.categorySlug || ''}
      seed={product?.name || ''}
      alt={`${product?.name || 'Product'} illustrative visual`}
      className={cn('h-full w-full', className)}
    />
  );
}
