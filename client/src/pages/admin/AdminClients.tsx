import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Upload,
  X,
  Loader2,
  Users,
  Globe,
} from 'lucide-react';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/hooks/useClients';
import { uploadImage, isValidImageFile, isValidFileSize } from '@/lib/storage';
import type { Client } from '@/lib/firestore';

interface ClientFormData {
  name: string;
  country: string;
  logoUrl: string;
  website: string;
  order: number;
  isActive: boolean;
}

const initialFormData: ClientFormData = {
  name: '',
  country: '',
  logoUrl: '',
  website: '',
  order: 0,
  isActive: true,
};

export default function AdminClients() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<
    (Client & { id: string }) | null
  >(null);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch all clients (including inactive)
  const { data: clients, isLoading, error } = useClients(false);

  // Mutations
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  // Stats
  const activeCount = clients?.filter((c) => c.isActive).length || 0;
  const totalCount = clients?.length || 0;

  const handleToggleActive = async (client: Client & { id: string }) => {
    try {
      await updateClient.mutateAsync({
        id: client.id,
        data: { isActive: !client.isActive },
      });
      toast({ title: 'Client status updated' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update client status',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteClient.mutateAsync(deleteId);
      toast({ title: 'Client deleted' });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (client: Client & { id: string }) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      country: client.country || '',
      logoUrl: client.logoUrl || '',
      website: client.website || '',
      order: client.order || 0,
      isActive: client.isActive ?? true,
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({
      ...initialFormData,
      order: (clients?.length || 0) + 1,
    });
    setShowDialog(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (JPG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidFileSize(file, 2)) {
      toast({
        title: 'File too large',
        description: 'Logo must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file, 'clients');
      setFormData((prev) => ({ ...prev, logoUrl: url }));
      toast({ title: 'Logo uploaded' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload logo',
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
      toast({ title: 'Client name is required', variant: 'destructive' });
      return;
    }

    if (!formData.country.trim()) {
      toast({ title: 'Country is required', variant: 'destructive' });
      return;
    }

    const clientData = {
      name: formData.name.trim(),
      country: formData.country.trim(),
      logoUrl: formData.logoUrl,
      website: formData.website.trim(),
      order: formData.order,
      isActive: formData.isActive,
    };

    try {
      if (editingClient) {
        await updateClient.mutateAsync({
          id: editingClient.id,
          data: clientData,
        });
        toast({ title: 'Client updated' });
      } else {
        await createClient.mutateAsync(clientData);
        toast({ title: 'Client created' });
      }
      setShowDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingClient ? 'update' : 'create'} client`,
        variant: 'destructive',
      });
    }
  };

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client showcase for the homepage
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalCount}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Visible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <p className="text-muted-foreground">Failed to load clients</p>
            </div>
          ) : clients && clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className={!client.isActive ? 'opacity-50' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {client.logoUrl ? (
                            <AvatarImage
                              src={client.logoUrl}
                              alt={client.name}
                            />
                          ) : null}
                          <AvatarFallback className="bg-muted">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{client.name}</span>
                          {client.website && (
                            <a
                              href={client.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs text-primary hover:underline"
                            >
                              {client.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.country}</TableCell>
                    <TableCell>{client.order || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={client.isActive}
                          onCheckedChange={() => handleToggleActive(client)}
                          data-testid={`switch-client-${client.id}`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {client.isActive ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(client)}
                          data-testid={`button-edit-client-${client.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(client.id)}
                          data-testid={`button-delete-client-${client.id}`}
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
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No clients yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first client to showcase on the homepage
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add Client'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Client/Company Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Company Name Ltd."
                data-testid="input-client-name"
              />
            </div>

            <div className="space-y-2">
              <Label>Country *</Label>
              <Input
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
                placeholder="United States"
                data-testid="input-client-country"
              />
            </div>

            <div className="space-y-2">
              <Label>Website (optional)</Label>
              <Input
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
                placeholder="https://example.com"
                data-testid="input-client-website"
              />
            </div>

            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                data-testid="input-client-order"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo (optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="client-logo-upload"
                />
                {formData.logoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.logoUrl}
                      alt="Client logo"
                      className="w-24 h-24 object-contain rounded border bg-white p-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, logoUrl: '' }))
                      }
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="client-logo-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                  >
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload logo
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Max 2MB, PNG or JPG
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="client-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="client-active">Visible on homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              data-testid="button-save-client"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingClient ? 'Update' : 'Create'} Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClient.isPending ? (
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

