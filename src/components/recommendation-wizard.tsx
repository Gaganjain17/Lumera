'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getJewelryRecommendation, type JewelryRecommendationOutput } from '@/ai/flows/jewelry-recommendation';
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

const formSchema = z.object({
  userPreferences: z.string().min(10, 'Please describe your style preferences in a bit more detail.'),
  colorPalette: z.string().min(3, 'Please enter at least one color.'),
  browsingHistory: z.string().optional(),
  previouslyViewedItems: z.string().optional(),
});

export default function RecommendationWizard() {
  const [recommendation, setRecommendation] = useState<JewelryRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: '',
      colorPalette: '',
      browsingHistory: 'User has been browsing rings and necklaces pages.',
      previouslyViewedItems: 'User looked at "Solitaire Diamond Ring" and "Gold Hoop Earrings".'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await getJewelryRecommendation({
        userPreferences: values.userPreferences,
        colorPalette: values.colorPalette,
        browsingHistory: values.browsingHistory || 'Not available',
        previouslyViewedItems: values.previouslyViewedItems || 'Not available',
      });
      setRecommendation(result);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: "Sorry, we couldn't generate recommendations at this time. Please try again later.",
      })
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  
  if (recommendation) {
    return (
      <Card className="bg-background/70 backdrop-blur-sm border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Your Personal Recommendations</CardTitle>
          </div>
          <CardDescription>Based on your style, here are some pieces we think you'll adore.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground/90">{recommendation.recommendation}</p>
          <Button onClick={() => setRecommendation(null)} className="mt-6 w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-border/60 shadow-lg">
      <CardHeader>
        <CardTitle>Style Profile</CardTitle>
        <CardDescription>Help us understand your taste.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your personal style</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'I love minimalist, modern designs' or 'Classic and timeless pieces'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorPalette"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite colors to wear</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'gold, white, emerald green'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Get My Recommendations'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
