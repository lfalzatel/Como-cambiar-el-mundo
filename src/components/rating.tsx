'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  averageRating: number;
  totalRatings: number;
  userRating?: number;
  onRate?: (rating: number, comment?: string) => void;
  showAverage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  trigger?: React.ReactNode;
}

export function RatingComponent({
  averageRating,
  totalRatings,
  userRating,
  onRate,
  showAverage = true,
  size = 'md',
  readonly = false,
  trigger
}: RatingComponentProps) {
  const [open, setOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (rating: number) => {
    if (readonly) return;
    
    if (onRate) {
      // If onRate is provided, open dialog for detailed rating
      setSelectedRating(rating);
      setOpen(true);
    } else {
      // Otherwise, just handle simple rating
      setSelectedRating(rating);
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to submit rating
      console.log('Submitting rating:', { rating: selectedRating, comment });
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onRate?.(selectedRating, comment);
      
      // Reset form
      setComment('');
      setOpen(false);
      
      alert('¡Gracias por tu calificación!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error al enviar calificación. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} transition-colors ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-200'
            } ${interactive && !readonly ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && handleStarClick(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Star className="h-4 w-4 mr-1" />
      Calificar
    </Button>
  );

  if (readonly) {
    return (
      <div className="flex items-center gap-2">
        {renderStars(averageRating)}
        {showAverage && (
          <span className="text-sm font-medium text-foreground">
            {averageRating.toFixed(1)}
            {totalRatings > 0 && (
              <span className="text-muted-foreground ml-1">
                ({totalRatings})
              </span>
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {renderStars(hoveredRating || selectedRating || averageRating, true)}
        {showAverage && (
          <span className="text-sm font-medium text-foreground">
            {averageRating.toFixed(1)}
            {totalRatings > 0 && (
              <span className="text-muted-foreground ml-1">
                ({totalRatings})
              </span>
            )}
          </span>
        )}
        {onRate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  Calificar Experiencia
                </DialogTitle>
                <DialogDescription>
                  Comparte tu opinión y ayuda a otros a conocer más sobre esta experiencia.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecciona tu calificación</Label>
                  <div className="flex justify-center py-4">
                    {renderStars(selectedRating, true)}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {selectedRating === 1 && 'Malo'}
                    {selectedRating === 2 && 'Regular'}
                    {selectedRating === 3 && 'Bueno'}
                    {selectedRating === 4 && 'Muy Bueno'}
                    {selectedRating === 5 && 'Excelente'}
                    {selectedRating === 0 && 'Selecciona una calificación'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comentario (opcional)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Comparte tu experiencia..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitRating}
                  disabled={isSubmitting || selectedRating === 0}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Calificación'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

// Quick rating component for inline use
interface QuickRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function QuickRating({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  readonly = false 
}: QuickRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (readonly) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} cursor-pointer transition-colors ${
            star <= (hoveredRating || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ))}
    </div>
  );
}

// Rating display component for showing ratings in a card
interface RatingDisplayProps {
  rating: number;
  count: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingDisplay({ 
  rating, 
  count, 
  size = 'sm', 
  showCount = true 
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}