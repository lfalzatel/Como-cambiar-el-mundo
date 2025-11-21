'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Star, Clock } from 'lucide-react';
import { AttendeeManagement, sampleAttendees } from '@/components/attendee-management';
import { RatingDisplay, RatingComponent } from '@/components/rating';

const categories = [
  { value: 'Voluntariado', label: 'Voluntariado' },
  { value: 'Educación', label: 'Educación' },
  { value: 'Ayuda Social', label: 'Ayuda Social' },
  { value: 'Medio Ambiente', label: 'Medio Ambiente' },
  { value: 'Compañía', label: 'Compañía' },
  { value: 'Salud', label: 'Salud' },
  { value: 'Cultura', label: 'Cultura' },
  { value: 'Deportes', label: 'Deportes' },
  { value: 'Arte', label: 'Arte' },
  { value: 'Tecnología', label: 'Tecnología' },
  { value: 'Otro', label: 'Otro' }
];

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

interface EventCardProps {
  event: Event;
  onAttend?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  onRate?: (eventId: string, rating?: number, comment?: string) => void;
  onManageAttendees?: (eventId: string) => void;
}

function EventCard({ event, onAttend, onViewDetails, onRate, onManageAttendees }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <RatingDisplay 
        rating={rating} 
        count={event.ratingCount}
        size="sm"
      />
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          {event.category && (
            <Badge variant="secondary" className="bg-secondary/50">
              {event.category}
            </Badge>
          )}
          <div className="flex items-center">
            {renderStars(event.averageRating)}
            <span className="ml-1 text-xs text-muted-foreground">
              ({event.ratingCount})
            </span>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{event.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.place}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.attendeeCount} asistente{event.attendeeCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails?.(event.id)}
          >
            Ver Detalles
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onAttend?.(event.id)}
          >
            Asistir
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2">
          <RatingComponent
            averageRating={event.averageRating}
            totalRatings={event.ratingCount}
            onRate={(rating, comment) => onRate?.(event.id, rating, comment)}
            size="sm"
            showAverage={false}
            trigger={
              <Button size="sm" variant="ghost" className="flex-1 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Calificar
              </Button>
            }
          />
          <AttendeeManagement
            eventId={event.id}
            eventName={event.name}
            attendees={[]} // Now managed internally in the component
            trigger={
              <Button size="sm" variant="ghost" className="flex-1 text-xs">
                <Users className="h-3 w-3 mr-1" />
                Asistentes
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface EventListProps {
  events: Event[];
  loading?: boolean;
  onAttend?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  onRate?: (eventId: string, rating?: number, comment?: string) => void;
  onManageAttendees?: (eventId: string) => void;
}

export function EventList({ 
  events, 
  loading = false, 
  onAttend, 
  onViewDetails, 
  onRate,
  onManageAttendees
}: EventListProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-9 bg-muted rounded flex-1"></div>
                <div className="h-9 bg-muted rounded flex-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay eventos programados
        </h3>
        <p className="text-muted-foreground mb-4">
          Sé el primero en crear un evento para nuestra comunidad.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onAttend={onAttend}
          onViewDetails={onViewDetails}
          onRate={onRate}
          onManageAttendees={onManageAttendees}
        />
      ))}
    </div>
  );
}

// Sample data for demonstration
export const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Limpieza de Playa Comunitaria',
    date: '2024-12-15T09:00:00',
    place: 'Playa Norte, San Diego',
    description: 'Únete a nosotros para una jornada de limpieza de la playa y ayudar a proteger nuestro ecosistema marino. Proporcionaremos guantes, bolsas y refrigerios.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    attendeeCount: 25,
    averageRating: 4.8,
    ratingCount: 32,
    category: 'Voluntariado'
  },
  {
    id: '2',
    name: 'Taller de Lectura para Niños',
    date: '2024-12-18T15:00:00',
    place: 'Biblioteca Central',
    description: 'Comparte tu tiempo leyendo historias inspiradoras a niños de comunidades necesitadas. No se requiere experiencia previa, solo ganas de ayudar.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    attendeeCount: 12,
    averageRating: 4.9,
    ratingCount: 18,
    category: 'Educación'
  },
  {
    id: '3',
    name: 'Recolección de Alimentos',
    date: '2024-12-20T10:00:00',
    place: 'Centro Comunitario',
    description: 'Ayúdanos a recolectar alimentos para familias necesitadas en nuestra comunidad. Tu contribución puede marcar la diferencia.',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
    attendeeCount: 40,
    averageRating: 5.0,
    ratingCount: 27,
    category: 'Ayuda Social'
  },
  {
    id: '4',
    name: 'Jardín Comunitario',
    date: '2024-12-22T08:00:00',
    place: 'Parque Central',
    description: 'Ven a ayudar en nuestro jardín comunitario donde cultivamos vegetales frescos para familias locales. Aprende sobre agricultura sostenible.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    attendeeCount: 18,
    averageRating: 4.7,
    ratingCount: 15,
    category: 'Medio Ambiente'
  },
  {
    id: '5',
    name: 'Visita a Hogar de Ancianos',
    date: '2024-12-24T14:00:00',
    place: 'Hogar San José',
    description: 'Comparte navidad con nuestros ancianos. Lleva alegría y compañía a quienes más lo necesitan en esta fecha especial.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    attendeeCount: 30,
    averageRating: 4.9,
    ratingCount: 22,
    category: 'Compañía'
  },
  {
    id: '6',
    name: 'Clases de Inglés Gratuitas',
    date: '2024-12-26T18:00:00',
    place: 'Centro de Educación',
    description: 'Ofrece clases de inglés gratuitas a jóvenes y adultos que desean mejorar sus oportunidades laborales. Se requiere nivel intermedio.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
    attendeeCount: 22,
    averageRating: 4.6,
    ratingCount: 19,
    category: 'Educación'
  }
];