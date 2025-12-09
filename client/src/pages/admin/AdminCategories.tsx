import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  generateSlug,
} from '@/hooks/useProducts';
import {
  uploadCategoryImage,
  isValidImageFile,
  isValidFileSize,
} from '@/lib/storage';
import type { Category } from '@/lib/firestore';

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
}

const initialFormData: CategoryFormData = {
  name: '',
  description: '',
  imageUrl: '',
  isActive: true,
};

export default function AdminCategories() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    (Category & { id: string }) | null
  >(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch categories
  const { data: categories, isLoading, error } = useCategories(false);

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleToggleActive = async (category: Category & { id: string }) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        data: { isActive: !category.isActive },
      });
      toast({ title: 'Category status updated' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update category status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast({ title: 'Category deleted' });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (category: Category & { id: string }) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      isActive: category.isActive ?? true,
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setShowDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidFileSize(file, 50)) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadCategoryImage(file, editingCategory?.id);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast({ title: 'Image uploaded' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Category name is required', variant: 'destructive' });
      return;
    }

    const categoryData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl,
      slug: generateSlug(formData.name),
      isActive: formData.isActive,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: categoryData,
        });
        toast({ title: 'Category updated' });
      } else {
        await createCategory.mutateAsync(categoryData);
        toast({ title: 'Category created' });
      }
      setShowDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${
          editingCategory ? 'update' : 'create'
        } category`,
        variant: 'destructive',
      });
    }
  };

  const isSaving = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button
          onClick={handleAdd}
          data-testid="button-add-category"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <p className="text-muted-foreground">Failed to load categories</p>
            </div>
          ) : categories && categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="p-2 rounded bg-muted">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {category.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => handleToggleActive(category)}
                          data-testid={`switch-category-${category.id}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                          data-testid={`button-delete-category-${category.id}`}
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
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No categories yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first category to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showDialog}
        onOpenChange={setShowDialog}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter category name"
                data-testid="input-category-name"
              />
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
                placeholder="Category description"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="category-image-upload"
                />
                {formData.imageUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Category"
                      className="w-32 h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, imageUrl: '' }))
                      }
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="category-image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload image
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="category-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="category-active">Active</Label>
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
              data-testid="button-save-category"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? 'Update' : 'Create'} Category
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Products in this
              category will not be deleted but will have no category assigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? (
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
