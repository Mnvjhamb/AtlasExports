import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import {
  useProducts,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  generateSlug,
} from '@/hooks/useProducts';
import {
  uploadProductImage,
  isValidImageFile,
  isValidFileSize,
} from '@/lib/storage';
import type { Product } from '@/lib/firestore';

// Fallback image
import equipmentImg from '@assets/generated_images/hydraulic_disc_harrow_product.png';

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  specifications: string;
  minOrderQuantity: number;
  unit: string;
  isFeatured: boolean;
  isActive: boolean;
  imageUrls: string[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  categoryId: '',
  specifications: '',
  minOrderQuantity: 1,
  unit: 'units',
  isFeatured: false,
  isActive: true,
  imageUrls: [],
};

export default function AdminProducts() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Product & { id: string }) | null
  >(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch data
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(false); // Get all products including inactive

  const { data: categories, isLoading: categoriesLoading } =
    useCategories(false);

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Filter products
  const filteredProducts = products?.filter((p) => {
    const matchesCategory =
      filterCategory === 'all' || p.categoryId === filterCategory;
    const matchesSearch = (p.name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleToggleActive = async (product: Product & { id: string }) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { isActive: !product.isActive },
      });
      toast({ title: 'Product status updated' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast({ title: 'Product deleted' });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: Product & { id: string }) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      specifications: product.specifications
        ? Object.entries(product.specifications)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')
        : '',
      minOrderQuantity: product.minOrderQuantity || 1,
      unit: product.unit || 'units',
      isFeatured: product.isFeatured || false,
      isActive: product.isActive,
      imageUrls: product.imageUrls || [],
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setShowDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!isValidImageFile(file)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a valid image file`,
          variant: 'destructive',
        });
        continue;
      }
      if (!isValidFileSize(file, 5)) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 5MB limit`,
          variant: 'destructive',
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = validFiles.map((file) =>
        uploadProductImage(file, editingProduct?.id)
      );
      const urls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
      toast({ title: `${urls.length} image(s) uploaded` });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const parseSpecifications = (text: string): Record<string, string> => {
    const specs: Record<string, string> = {};
    text.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        specs[key.trim()] = valueParts.join(':').trim();
      }
    });
    return specs;
  };

  const handleSave = async () => {
    if (!formData.name || !formData.categoryId) {
      toast({
        title: 'Missing fields',
        description: 'Name and category are required',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      slug: generateSlug(formData.name),
      specifications: parseSpecifications(formData.specifications),
      minOrderQuantity: formData.minOrderQuantity,
      unit: formData.unit,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      imageUrls: formData.imageUrls,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data: productData,
        });
        toast({ title: 'Product updated' });
      } else {
        await createProduct.mutateAsync(productData);
        toast({ title: 'Product created' });
      }
      setShowDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${
          editingProduct ? 'update' : 'create'
        } product`,
        variant: 'destructive',
      });
    }
  };

  const isLoading = productsLoading || categoriesLoading;
  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button
          onClick={handleAdd}
          data-testid="button-add-product"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
            >
              <SelectTrigger
                className="w-[200px]"
                data-testid="select-filter-category"
              >
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full"
                />
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <p className="text-muted-foreground">Failed to load products</p>
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrls?.[0] || equipmentImg}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isFeatured ? 'default' : 'secondary'}
                      >
                        {product.isFeatured ? 'Featured' : 'Regular'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.isActive}
                          onCheckedChange={() => handleToggleActive(product)}
                          data-testid={`switch-active-${product.id}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          data-testid={`button-edit-${product.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product.id)}
                          data-testid={`button-delete-${product.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={setShowDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Product name"
                  data-testid="input-product-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Product description..."
                className="min-h-[100px]"
                data-testid="input-product-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minOrderQuantity: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="e.g., pieces, kg, tons"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Specifications (one per line, format: Key: Value)</Label>
              <Textarea
                value={formData.specifications}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specifications: e.target.value,
                  }))
                }
                placeholder="Weight: 500kg&#10;Dimensions: 2m x 1m x 1m&#10;Material: Steel"
                className="min-h-[100px]"
                data-testid="input-product-specs"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Product Images</Label>
                {formData.imageUrls.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {formData.imageUrls.length} image
                    {formData.imageUrls.length !== 1 ? 's' : ''} uploaded
                  </span>
                )}
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                {formData.imageUrls.length === 0 ? (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-8 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Uploading images...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-foreground mb-1">
                          Click to upload images
                        </span>
                        <span className="text-xs text-muted-foreground">
                          You can select multiple images at once (max 5MB each)
                        </span>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                            <img
                              src={url}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors py-2 border border-border rounded-lg hover:bg-muted/50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Add more images</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
              {formData.imageUrls.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  First image will be used as the main product image. You can
                  reorder by removing and re-uploading.
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-testid="button-save-product"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
