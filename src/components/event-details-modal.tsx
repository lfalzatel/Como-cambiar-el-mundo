'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarDays, MapPin, Users, Star, Image, Share2, X } from 'lucide-react';

export interface Event {
  id: string;
  name: string;
  date: string;
  place: string;
  description: string;
  imageUrl?: string;
  attendeeCount: number;
  averageRating: number;
  ratingCount: number;
  category?: string;
}

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttend: (eventId: string) => void;
  onRate: (eventId: string) => void;
}

export function EventDetailsModal({ event, open, onOpenChange, onAttend, onRate }: EventDetailsModalProps) {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="ml-1 text-sm text-muted-foreground">({event.ratingCount} reseñas)</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl pr-4">{event.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {event.category && (
                  <Badge variant="secondary" className="mb-2">
                    {event.category}
                  </Badge>
                )}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = `https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=300&fit=crop&auto=format`;
                }}
              />
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium">{event.place}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium">{event.attendeeCount} asistente{event.attendeeCount !== 1 ? 's' : ''} confirmados</span>
            </div>
          </div>

          {/* Rating */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Calificación del Evento</h4>
            {renderStars(event.averageRating)}
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Descripción del Evento</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => onAttend(event.id)}
              className="flex-1"
              size="lg"
            >
              <Users className="h-4 w-4 mr-2" />
              Inscribirse
            </Button>
            <Button
              onClick={() => onRate(event.id)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <Star className="h-4 w-4 mr-2" />
              Calificar
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.name,
                    text: `Únete a este evento de altruismo: ${event.name}`,
                    url: window.location.href
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert('Enlace copiado al portapapeles');
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}