import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  FileText,
  Image as ImageIcon,
  Globe,
  Building2,
  Phone,
  Loader2,
  Upload,
  X,
  GripVertical,
  Plus,
  Trash2,
  Home,
  Users,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  useSiteContent,
  useUpdateSiteContent,
  defaultContent,
  type SiteContent,
  type HeroSlide,
  type TeamMember,
  type WhyChooseUsItem,
} from '@/hooks/useContent';
import {
  uploadImage,
  uploadVideo,
  isValidImageFile,
  isValidVideoFile,
  isValidFileSize,
} from '@/lib/storage';

const iconOptions = [
  'Award',
  'Users',
  'CheckCircle',
  'Target',
  'Shield',
  'Truck',
  'HeartHandshake',
  'Globe',
  'Zap',
  'ThumbsUp',
];

export default function AdminContent() {
  const { data: siteContent, isLoading, error } = useSiteContent();
  const updateContent = useUpdateSiteContent();
  const { toast } = useToast();

  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingTeamMember, setUploadingTeamMember] = useState<string | null>(
    null
  );

  // Load content from database
  useEffect(() => {
    if (siteContent) {
      setContent(siteContent);
      setHasChanges(false);
    }
  }, [siteContent]);

  const handleChange = (
    section: keyof SiteContent,
    field: string,
    value: any
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync(content);
      toast({ title: 'Content saved successfully' });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive',
      });
    }
  };

  const handleRevertToDefault = async () => {
    try {
      await updateContent.mutateAsync(defaultContent);
      setContent(defaultContent);
      toast({ title: 'Content reverted to defaults' });
      setHasChanges(false);
    } catch (error) {
      console.error('Error reverting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to revert content',
        variant: 'destructive',
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image file (PNG, JPG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidFileSize(file, 50)) {
      toast({
        title: 'File too large',
        description: 'Logo must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const url = await uploadImage(file, 'branding');
      handleChange('companyInfo', 'logoUrl', url);
      toast({ title: 'Logo uploaded successfully' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    handleChange('companyInfo', 'logoUrl', '');
  };

  // Hero slide management
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      title: 'New Slide',
      subtitle: 'Enter subtitle here',
      imageUrl: '',
      videoUrl: '',
      mediaType: 'image',
      order: content.heroSlides.length + 1,
    };
    setContent((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide],
    }));
    setHasChanges(true);
  };

  const handleRemoveSlide = (id: string) => {
    setContent((prev) => {
      const filtered = prev.heroSlides.filter((s) => s.id !== id);
      // Reorder remaining slides
      const reordered = filtered.map((slide, index) => ({
        ...slide,
        order: index + 1,
      }));
      return {
        ...prev,
        heroSlides: reordered,
      };
    });
    setHasChanges(true);
  };

  const handleMoveSlide = (id: string, direction: 'up' | 'down') => {
    setContent((prev) => {
      const slides = [...prev.heroSlides].sort((a, b) => a.order - b.order);
      const currentIndex = slides.findIndex((s) => s.id === id);

      if (currentIndex === -1) return prev;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= slides.length) return prev;

      // Swap orders
      const tempOrder = slides[currentIndex].order;
      slides[currentIndex].order = slides[newIndex].order;
      slides[newIndex].order = tempOrder;

      // Sort by order again
      const reordered = slides.sort((a, b) => a.order - b.order);

      return {
        ...prev,
        heroSlides: reordered,
      };
    });
    setHasChanges(true);
  };

  const handleSlideChange = (
    id: string,
    field: keyof HeroSlide,
    value: string | number
  ) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
    setHasChanges(true);
  };

  const handleSlideImageUpload = async (
    slideId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    setUploadingSlide(slideId);
    try {
      const url = await uploadImage(file, 'hero');
      handleSlideChange(slideId, 'imageUrl', url);
      handleSlideChange(slideId, 'mediaType', 'image');
      toast({ title: 'Image uploaded' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingSlide(null);
    }
  };

  const handleSlideVideoUpload = async (
    slideId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidVideoFile(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid video file (MP4, WebM, etc.)',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidFileSize(file, 200)) {
      toast({
        title: 'File too large',
        description: 'Video must be less than 200MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingSlide(slideId);
    try {
      const url = await uploadVideo(file, 'hero');
      handleSlideChange(slideId, 'videoUrl', url);
      handleSlideChange(slideId, 'mediaType', 'video');
      toast({ title: 'Video uploaded' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload video',
        variant: 'destructive',
      });
    } finally {
      setUploadingSlide(null);
    }
  };

  // Team member management
  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'New Member',
      role: 'Role',
      initials: 'NM',
    };
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        teamMembers: [...prev.about.teamMembers, newMember],
      },
    }));
    setHasChanges(true);
  };

  const handleRemoveTeamMember = (id: string) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        teamMembers: prev.about.teamMembers.filter((m) => m.id !== id),
      },
    }));
    setHasChanges(true);
  };

  const handleTeamMemberChange = (
    id: string,
    field: keyof TeamMember,
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        teamMembers: prev.about.teamMembers.map((m) =>
          m.id === id ? { ...m, [field]: value } : m
        ),
      },
    }));
    setHasChanges(true);
  };

  const handleTeamMemberImageUpload = async (
    memberId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    setUploadingTeamMember(memberId);
    try {
      const url = await uploadImage(file, 'team');
      handleTeamMemberChange(memberId, 'imageUrl', url);
      toast({ title: 'Image uploaded' });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingTeamMember(null);
    }
  };

  // Why Choose Us items management
  const handleAddWhyChooseUs = () => {
    const newItem: WhyChooseUsItem = {
      id: Date.now().toString(),
      icon: 'Award',
      title: 'New Feature',
      description: 'Description here',
    };
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        whyChooseUsItems: [...prev.about.whyChooseUsItems, newItem],
      },
    }));
    setHasChanges(true);
  };

  const handleRemoveWhyChooseUs = (id: string) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        whyChooseUsItems: prev.about.whyChooseUsItems.filter(
          (i) => i.id !== id
        ),
      },
    }));
    setHasChanges(true);
  };

  const handleWhyChooseUsChange = (
    id: string,
    field: keyof WhyChooseUsItem,
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        whyChooseUsItems: prev.about.whyChooseUsItems.map((i) =>
          i.id === id ? { ...i, [field]: value } : i
        ),
      },
    }));
    setHasChanges(true);
  };

  // CTA Features management
  const handleCtaFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(content.home.ctaFeatures || [])];
    newFeatures[index] = value;
    handleChange('home', 'ctaFeatures', newFeatures);
  };

  const handleAddCtaFeature = () => {
    const newFeatures = [...(content.home.ctaFeatures || []), 'New feature'];
    handleChange('home', 'ctaFeatures', newFeatures);
  };

  const handleRemoveCtaFeature = (index: number) => {
    const newFeatures = content.home.ctaFeatures.filter((_, i) => i !== index);
    handleChange('home', 'ctaFeatures', newFeatures);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Edit website content sections and settings
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={updateContent.isPending}
                data-testid="button-revert-content"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Revert to Default
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revert to Default Content?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset ALL content across all pages (Home, About,
                  Contact, Footer, etc.) to the original default values. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRevertToDefault}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Revert Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={handleSave}
            disabled={updateContent.isPending || !hasChanges}
            data-testid="button-save-content"
          >
            {updateContent.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {updateContent.isPending ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="company"
        className="space-y-6"
      >
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger
            value="company"
            className="gap-2"
          >
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger
            value="home"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Home Page
          </TabsTrigger>
          <TabsTrigger
            value="hero"
            className="gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Hero Carousel
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            About Page
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="gap-2"
          >
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            Social & Footer
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company">
          <div className="space-y-6">
            {/* Logo Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
                <CardDescription>
                  Upload your company logo (PNG, JPG, or WebP, max 50MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="border-2 border-dashed rounded-lg p-4 w-40 h-40 flex items-center justify-center bg-muted/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    {content.companyInfo.logoUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={content.companyInfo.logoUrl}
                          alt="Company Logo"
                          className="w-full h-full object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center cursor-pointer text-muted-foreground text-center"
                      >
                        {uploadingLogo ? (
                          <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">Upload Logo</span>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This logo will be displayed in the navigation bar and
                      footer.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recommended: Square image (e.g., 200x200px) or horizontal
                      logo with transparent background.
                    </p>
                    {content.companyInfo.logoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('logo-upload')?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Logo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={content.companyInfo.name}
                      onChange={(e) =>
                        handleChange('companyInfo', 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={content.companyInfo.tagline}
                      onChange={(e) =>
                        handleChange('companyInfo', 'tagline', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={content.companyInfo.description}
                      onChange={(e) =>
                        handleChange(
                          'companyInfo',
                          'description',
                          e.target.value
                        )
                      }
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Founded Year</Label>
                      <Input
                        value={content.companyInfo.foundedYear}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'foundedYear',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Countries Served</Label>
                      <Input
                        value={content.companyInfo.countriesServed}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'countriesServed',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={content.companyInfo.phone}
                        onChange={(e) =>
                          handleChange('companyInfo', 'phone', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone 2</Label>
                      <Input
                        value={content.companyInfo.phone2 || ''}
                        onChange={(e) =>
                          handleChange('companyInfo', 'phone2', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={content.companyInfo.email}
                        onChange={(e) =>
                          handleChange('companyInfo', 'email', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sales Email</Label>
                      <Input
                        value={content.companyInfo.salesEmail || ''}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'salesEmail',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={content.companyInfo.address}
                      onChange={(e) =>
                        handleChange('companyInfo', 'address', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={content.companyInfo.city}
                        onChange={(e) =>
                          handleChange('companyInfo', 'city', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={content.companyInfo.state}
                        onChange={(e) =>
                          handleChange('companyInfo', 'state', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={content.companyInfo.country}
                        onChange={(e) =>
                          handleChange('companyInfo', 'country', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        value={content.companyInfo.postalCode}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'postalCode',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Days</Label>
                      <Input
                        value={content.companyInfo.businessDays}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'businessDays',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Hours</Label>
                      <Input
                        value={content.companyInfo.businessHours}
                        onChange={(e) =>
                          handleChange(
                            'companyInfo',
                            'businessHours',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Home Page Tab */}
        <TabsContent value="home">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.home.categoriesTitle}
                    onChange={(e) =>
                      handleChange('home', 'categoriesTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={content.home.categoriesSubtitle}
                    onChange={(e) =>
                      handleChange('home', 'categoriesSubtitle', e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Products Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.home.featuredProductsTitle}
                    onChange={(e) =>
                      handleChange(
                        'home',
                        'featuredProductsTitle',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={content.home.featuredProductsSubtitle}
                    onChange={(e) =>
                      handleChange(
                        'home',
                        'featuredProductsSubtitle',
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clients Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.home.clientsTitle}
                    onChange={(e) =>
                      handleChange('home', 'clientsTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={content.home.clientsSubtitle}
                    onChange={(e) =>
                      handleChange('home', 'clientsSubtitle', e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call to Action Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.home.ctaTitle}
                    onChange={(e) =>
                      handleChange('home', 'ctaTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.home.ctaDescription}
                    onChange={(e) =>
                      handleChange('home', 'ctaDescription', e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Features List</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddCtaFeature}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {content.home.ctaFeatures?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <Input
                          value={feature}
                          onChange={(e) =>
                            handleCtaFeatureChange(index, e.target.value)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCtaFeature(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Badge Number</Label>
                    <Input
                      value={content.home.ctaBadgeNumber}
                      onChange={(e) =>
                        handleChange('home', 'ctaBadgeNumber', e.target.value)
                      }
                      placeholder="14+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Badge Text</Label>
                    <Input
                      value={content.home.ctaBadgeText}
                      onChange={(e) =>
                        handleChange('home', 'ctaBadgeText', e.target.value)
                      }
                      placeholder="Years of Excellence"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hero Carousel Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hero Carousel Slides</CardTitle>
                  <CardDescription>
                    Manage the homepage hero carousel slides
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddSlide}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {[...content.heroSlides]
                .sort((a, b) => a.order - b.order)
                .map((slide, index) => (
                  <div
                    key={slide.id}
                    className="border rounded-lg p-4 space-y-4 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Slide {index + 1}</span>
                        {index === 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            First
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Move Up Button */}
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveSlide(slide.id, 'up')}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Move Down Button */}
                        {index < content.heroSlides.length - 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveSlide(slide.id, 'down')}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSlide(slide.id)}
                          disabled={content.heroSlides.length <= 1}
                          title="Remove slide"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={slide.title}
                            onChange={(e) =>
                              handleSlideChange(
                                slide.id,
                                'title',
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Textarea
                            value={slide.subtitle}
                            onChange={(e) =>
                              handleSlideChange(
                                slide.id,
                                'subtitle',
                                e.target.value
                              )
                            }
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Media Type</Label>
                        <Select
                          value={slide.mediaType || 'image'}
                          onValueChange={(value: 'image' | 'video') =>
                            handleSlideChange(slide.id, 'mediaType', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>
                          {slide.mediaType === 'video'
                            ? 'Background Video'
                            : 'Background Image'}
                        </Label>
                        <div className="border-2 border-dashed rounded-lg p-4 h-[140px] flex items-center justify-center">
                          {slide.mediaType === 'video' ? (
                            <>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  handleSlideVideoUpload(slide.id, e)
                                }
                                className="hidden"
                                id={`slide-video-${slide.id}`}
                              />
                              {slide.videoUrl ? (
                                <div className="relative w-full h-full">
                                  <video
                                    src={slide.videoUrl}
                                    className="w-full h-full object-cover rounded"
                                    muted
                                    playsInline
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleSlideChange(
                                        slide.id,
                                        'videoUrl',
                                        ''
                                      );
                                      handleSlideChange(
                                        slide.id,
                                        'mediaType',
                                        'image'
                                      );
                                    }}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <label
                                  htmlFor={`slide-video-${slide.id}`}
                                  className="flex flex-col items-center cursor-pointer text-muted-foreground"
                                >
                                  {uploadingSlide === slide.id ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  ) : (
                                    <>
                                      <Upload className="h-8 w-8 mb-2" />
                                      <span className="text-sm">
                                        Upload Video
                                      </span>
                                      <span className="text-xs mt-1">
                                        (MP4, WebM, max 200MB)
                                      </span>
                                    </>
                                  )}
                                </label>
                              )}
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleSlideImageUpload(slide.id, e)
                                }
                                className="hidden"
                                id={`slide-image-${slide.id}`}
                              />
                              {slide.imageUrl ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSlideChange(
                                        slide.id,
                                        'imageUrl',
                                        ''
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <label
                                  htmlFor={`slide-image-${slide.id}`}
                                  className="flex flex-col items-center cursor-pointer text-muted-foreground"
                                >
                                  {uploadingSlide === slide.id ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  ) : (
                                    <>
                                      <Upload className="h-8 w-8 mb-2" />
                                      <span className="text-sm">
                                        Upload Image
                                      </span>
                                    </>
                                  )}
                                </label>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {slide.mediaType === 'video'
                            ? 'Upload a video file (MP4, WebM, max 200MB)'
                            : 'Leave empty to use default images'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Page Tab */}
        <TabsContent value="about">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.about.heroTitle}
                    onChange={(e) =>
                      handleChange('about', 'heroTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={content.about.heroSubtitle}
                    onChange={(e) =>
                      handleChange('about', 'heroSubtitle', e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.about.description}
                  onChange={(e) =>
                    handleChange('about', 'description', e.target.value)
                  }
                  className="min-h-[200px]"
                  placeholder="Company description... Use double line breaks for paragraphs."
                />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content.about.mission}
                    onChange={(e) =>
                      handleChange('about', 'mission', e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vision Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content.about.vision}
                    onChange={(e) =>
                      handleChange('about', 'vision', e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Why Choose Us</CardTitle>
                    <CardDescription>
                      Features displayed on the About page
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddWhyChooseUs}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={content.about.whyChooseUsTitle}
                      onChange={(e) =>
                        handleChange(
                          'about',
                          'whyChooseUsTitle',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Subtitle</Label>
                    <Input
                      value={content.about.whyChooseUsSubtitle}
                      onChange={(e) =>
                        handleChange(
                          'about',
                          'whyChooseUsSubtitle',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {content.about.whyChooseUsItems?.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 space-y-3 bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-3 gap-4 flex-1 mr-4">
                          <div className="space-y-2">
                            <Label>Icon</Label>
                            <Select
                              value={item.icon}
                              onValueChange={(v) =>
                                handleWhyChooseUsChange(item.id, 'icon', v)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map((icon) => (
                                  <SelectItem
                                    key={icon}
                                    value={icon}
                                  >
                                    {icon}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                handleWhyChooseUsChange(
                                  item.id,
                                  'title',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveWhyChooseUs(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) =>
                            handleWhyChooseUsChange(
                              item.id,
                              'description',
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CTA Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.about.ctaTitle}
                    onChange={(e) =>
                      handleChange('about', 'ctaTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={content.about.ctaSubtitle}
                    onChange={(e) =>
                      handleChange('about', 'ctaSubtitle', e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Leadership team displayed on the About page
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddTeamMember}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={content.about.teamTitle}
                    onChange={(e) =>
                      handleChange('about', 'teamTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Subtitle</Label>
                  <Input
                    value={content.about.teamSubtitle}
                    onChange={(e) =>
                      handleChange('about', 'teamSubtitle', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.about.teamMembers?.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 space-y-3 bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {member.name || 'New Member'}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            member.id,
                            'name',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            member.id,
                            'role',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Initials (2 letters)</Label>
                      <Input
                        value={member.initials}
                        maxLength={2}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            member.id,
                            'initials',
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Photo (optional)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleTeamMemberImageUpload(member.id, e)
                          }
                          className="hidden"
                          id={`team-member-image-${member.id}`}
                        />
                        {member.imageUrl ? (
                          <div className="relative">
                            <img
                              src={member.imageUrl}
                              alt={member.name}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleTeamMemberChange(
                                  member.id,
                                  'imageUrl',
                                  ''
                                )
                              }
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`team-member-image-${member.id}`}
                            className="flex flex-col items-center cursor-pointer text-muted-foreground"
                          >
                            {uploadingTeamMember === member.id ? (
                              <Loader2 className="h-8 w-8 animate-spin" />
                            ) : (
                              <>
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm">Upload Photo</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Page Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content.contact.title}
                  onChange={(e) =>
                    handleChange('contact', 'title', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={content.contact.subtitle}
                  onChange={(e) =>
                    handleChange('contact', 'subtitle', e.target.value)
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Urgent Assistance Title</Label>
                <Input
                  value={content.contact.urgentTitle}
                  onChange={(e) =>
                    handleChange('contact', 'urgentTitle', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Urgent Assistance Text</Label>
                <Textarea
                  value={content.contact.urgentText}
                  onChange={(e) =>
                    handleChange('contact', 'urgentText', e.target.value)
                  }
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social & Footer Tab */}
        <TabsContent value="social">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Links displayed in footer and contact sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={content.socialLinks.whatsapp}
                    onChange={(e) =>
                      handleChange('socialLinks', 'whatsapp', e.target.value)
                    }
                    placeholder="https://wa.me/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={content.socialLinks.linkedin}
                    onChange={(e) =>
                      handleChange('socialLinks', 'linkedin', e.target.value)
                    }
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={content.socialLinks.instagram}
                    onChange={(e) =>
                      handleChange('socialLinks', 'instagram', e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={content.socialLinks.facebook || ''}
                    onChange={(e) =>
                      handleChange('socialLinks', 'facebook', e.target.value)
                    }
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter / X</Label>
                  <Input
                    value={content.socialLinks.twitter || ''}
                    onChange={(e) =>
                      handleChange('socialLinks', 'twitter', e.target.value)
                    }
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>
                  Additional footer text and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Footer Description</Label>
                  <Textarea
                    value={content.footer.description}
                    onChange={(e) =>
                      handleChange('footer', 'description', e.target.value)
                    }
                    rows={3}
                    placeholder="Short description shown in footer..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input
                    value={content.footer.copyrightText}
                    onChange={(e) =>
                      handleChange('footer', 'copyrightText', e.target.value)
                    }
                    placeholder="All rights reserved."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
