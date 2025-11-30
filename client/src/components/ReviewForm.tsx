import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useCreateReview } from '@/hooks/useReviews';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().min(1, 'Company name is required'),
  country: z.string().optional(),
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function ReviewForm() {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const createReview = useCreateReview();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      country: '',
      rating: 0,
      comment: '',
    },
  });

  const selectedRating = form.watch('rating');

  const onSubmit = async (data: FormData) => {
    try {
      await createReview.mutateAsync({
        clientName: data.name,
        company: data.company,
        country: data.country || '',
        rating: data.rating,
        content: data.comment,
        email: data.email,
      });

      toast({
        title: 'Review Submitted!',
        description: 'Thank you! Your review will be published after approval.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          Your feedback helps us serve you better. Reviews are published after
          approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Smith"
                        {...field}
                        data-testid="input-review-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        {...field}
                        data-testid="input-review-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Company Name"
                        {...field}
                        data-testid="input-review-company"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Country"
                        {...field}
                        data-testid="input-review-country"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => field.onChange(star)}
                          className="p-1"
                          data-testid={`button-rating-${star}`}
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              star <= (hoveredRating || selectedRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience working with us..."
                      className="min-h-[100px]"
                      {...field}
                      data-testid="input-review-comment"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={createReview.isPending}
              data-testid="button-review-submit"
            >
              {createReview.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
