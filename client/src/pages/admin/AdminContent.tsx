import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import {
  useSiteContent,
  useUpdateSiteContent,
  defaultContent,
  type SiteContent,
  type HeroSlide,
} from '@/hooks/useContent';
import { uploadImage, isValidImageFile, isValidFileSize } from '@/lib/storage';

export default function AdminContent() {
  const { data: siteContent, isLoading, error } = useSiteContent();
  const updateContent = useUpdateSiteContent();
  const { toast } = useToast();

  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    value: string
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

  // Hero slide management
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      title: 'New Slide',
      subtitle: 'Enter subtitle here',
      imageUrl: '',
      order: content.heroSlides.length + 1,
    };
    setContent((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide],
    }));
    setHasChanges(true);
  };

  const handleRemoveSlide = (id: string) => {
    setContent((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((s) => s.id !== id),
    }));
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

    if (!isValidFileSize(file, 5)) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingSlide(slideId);
    try {
      const url = await uploadImage(file, 'hero');
      handleSlideChange(slideId, 'imageUrl', url);
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

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company Info
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Hero Carousel
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <FileText className="h-4 w-4" />
            About Page
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact Page
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Globe className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        {/* Company Info Tab */}
        <TabsContent value="company">
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
                        handleChange('companyInfo', 'salesEmail', e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address & Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        handleChange('companyInfo', 'postalCode', e.target.value)
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
                        handleChange('companyInfo', 'businessDays', e.target.value)
                      }
                      placeholder="Monday - Saturday"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <Input
                      value={content.companyInfo.businessHours}
                      onChange={(e) =>
                        handleChange('companyInfo', 'businessHours', e.target.value)
                      }
                      placeholder="9:00 AM - 6:00 PM IST"
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
                <Button onClick={handleAddSlide} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border rounded-lg p-4 space-y-4 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Slide {index + 1}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSlide(slide.id)}
                      disabled={content.heroSlides.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={slide.title}
                          onChange={(e) =>
                            handleSlideChange(slide.id, 'title', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Textarea
                          value={slide.subtitle}
                          onChange={(e) =>
                            handleSlideChange(slide.id, 'subtitle', e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 h-[140px] flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSlideImageUpload(slide.id, e)}
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
                                handleSlideChange(slide.id, 'imageUrl', '')
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
                                <span className="text-sm">Upload Image</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Leave empty to use default images
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
                <CardTitle>About Page Hero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.about.heroTitle}
                    onChange={(e) =>
                      handleChange('about', 'heroTitle', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
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
                  placeholder="Company description..."
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
                <CardTitle>Why Choose Us</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.about.whyChooseUs}
                  onChange={(e) =>
                    handleChange('about', 'whyChooseUs', e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <Input
                      value={content.about.foundedYear}
                      onChange={(e) =>
                        handleChange('about', 'foundedYear', e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Countries Served</Label>
                    <Input
                      value={content.about.countriesServed}
                      onChange={(e) =>
                        handleChange('about', 'countriesServed', e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

        {/* Social Links Tab */}
        <TabsContent value="social">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
