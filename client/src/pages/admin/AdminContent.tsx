import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, FileText, Image, Users, Globe } from "lucide-react";

// todo: remove mock functionality - replace with CMS content
const initialContent = {
  hero: {
    title: "Premium Exports from Punjab",
    subtitle: "Delivering quality agricultural equipment and commodities to the world",
  },
  about: `The Atlas Exports is a premier B2B export company based in Punjab, India, specializing in agricultural equipment, agro commodities, furniture, marble & granite, and PVC/WPC products. Founded in 2010, we have grown to become one of the region's most trusted exporters, serving clients across 25+ countries.

Our headquarters in Ludhiana, the industrial hub of Punjab, gives us direct access to quality manufacturing facilities and agricultural produce. We work closely with farmers, manufacturers, and artisans to source the finest products that meet international quality standards.`,
  mission: "To bridge global markets with Punjab's finest products, delivering exceptional quality and value while fostering sustainable business relationships that benefit all stakeholders.",
  vision: "To become the most trusted name in agricultural and industrial exports from India, setting benchmarks for quality, reliability, and customer satisfaction in the international trade community.",
  whyChooseUs: "With over 14 years of experience in international trade, we offer quality-assured products, competitive pricing, end-to-end logistics support, and dedicated account managers for each client.",
  clientsIntro: "We're proud to partner with leading businesses across the globe. Here are some of the companies that trust The Atlas Exports for their sourcing needs.",
  socialLinks: {
    whatsapp: "https://wa.me/919876543210",
    linkedin: "https://linkedin.com/company/theatlasexports",
    instagram: "https://instagram.com/theatlasexports",
  },
};

export default function AdminContent() {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Saving content:", content);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({ title: "Content saved successfully" });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Edit website content sections and settings
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} data-testid="button-save-content">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="hero" className="gap-2">
            <Image className="h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <FileText className="h-4 w-4" />
            About Us
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Globe className="h-4 w-4" />
            Social Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main banner text displayed on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                  data-testid="input-hero-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Textarea
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                  data-testid="input-hero-subtitle"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
                <CardDescription>Company description and history</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.about}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, about: e.target.value }))
                  }
                  className="min-h-[200px]"
                  data-testid="input-about"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mission Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.mission}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, mission: e.target.value }))
                  }
                  className="min-h-[100px]"
                  data-testid="input-mission"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vision Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.vision}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, vision: e.target.value }))
                  }
                  className="min-h-[100px]"
                  data-testid="input-vision"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content.whyChooseUs}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, whyChooseUs: e.target.value }))
                  }
                  className="min-h-[100px]"
                  data-testid="input-why-choose"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients Section</CardTitle>
              <CardDescription>
                Introduction text for the Our Clients section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content.clientsIntro}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, clientsIntro: e.target.value }))
                }
                className="min-h-[100px]"
                data-testid="input-clients-intro"
              />
            </CardContent>
          </Card>
        </TabsContent>

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
                    setContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, whatsapp: e.target.value },
                    }))
                  }
                  placeholder="https://wa.me/..."
                  data-testid="input-whatsapp"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={content.socialLinks.linkedin}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                    }))
                  }
                  placeholder="https://linkedin.com/..."
                  data-testid="input-linkedin"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={content.socialLinks.instagram}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                    }))
                  }
                  placeholder="https://instagram.com/..."
                  data-testid="input-instagram"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
