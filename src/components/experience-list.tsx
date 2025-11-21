'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star, MessageCircle, Share2 } from 'lucide-react';
import { RatingComponent } from '@/components/rating';

export interface Experience {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  averageRating: number;
  ratingCount: number;
  author?: string;
  category?: string;
}

interface ExperienceListProps {
  experiences: Experience[];
  loading?: boolean;
  onRate?: (experienceId: string, rating?: number, comment?: string) => void;
}

export function ExperienceList({ experiences, loading = false, onRate }: ExperienceListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    if (diffDays <= 30) return `Hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Inspirador': return 'border-green-500 text-green-700';
      case 'Transformador': return 'border-blue-500 text-blue-700';
      case 'Conmovedor': return 'border-purple-500 text-purple-700';
      default: return 'border-primary text-primary';
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
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
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay experiencias compartidas aún
        </h3>
        <p className="text-muted-foreground mb-4">
          Sé el primero en compartir tu experiencia de altruismo y reciprocidad.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {experiences.map((experience) => (
        <Card key={experience.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              {experience.category && (
                <Badge 
                  variant="outline" 
                  className={`${getCategoryColor(experience.category)}`}
                >
                  {experience.category}
                </Badge>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{experience.averageRating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-muted-foreground">({experience.ratingCount})</span>
              </div>
            </div>
            <CardTitle className="text-lg line-clamp-2">{experience.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {experience.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
              {experience.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {experience.ratingCount} comentario{experience.ratingCount !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(experience.createdAt)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <RatingComponent
                averageRating={experience.averageRating}
                totalRatings={experience.ratingCount}
                onRate={(rating, comment) => onRate?.(experience.id, rating, comment)}
                size="sm"
                showAverage={false}
                trigger={
                  <Button size="sm" variant="outline" className="flex-1">
                    <Star className="h-3 w-3 mr-1" />
                    Calificar
                  </Button>
                }
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: experience.title,
                      text: `Lee esta inspiradora experiencia: ${experience.title}`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }
                }}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Compartir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Sample data for demonstration
export const sampleExperiences: Experience[] = [
  {
    id: '1',
    title: 'El Regalo de Dar',
    description: 'Compartir mi tiempo en el comedor comunitario me ha enseñado el verdadero significado de la generosidad. Cada sábado, durante los últimos seis meses, he tenido el privilegio de servir comidas a personas que han pasado por momentos difíciles. Las sonrisas y las historias de gratitud que he recibido han transformado mi perspectiva de la vida. Aprendí que dar no es solo sobre lo que ofreces, sino sobre lo que recibes a cambio: conexión humana, propósito y una profunda sensación de pertenencia.',
    createdAt: '2024-12-19T10:00:00Z',
    averageRating: 4.9,
    ratingCount: 28,
    author: 'María García',
    category: 'Inspirador'
  },
  {
    id: '2',
    title: 'Pequeños Actos, Grandes Cambios',
    description: 'Todo comenzó con una simple decisión: ayudar a mi vecino mayor con sus compras. Este pequeño gesto se convirtió en una cadena de bondad que ha unido a nuestra comunidad de maneras inesperadas. Ahora organizamos visitas semanales, compartimos comidas y creamos una red de apoyo mutua. Lo que empezó como un simple acto de amabilidad se ha transformado en un movimiento comunitario que ha mejorado la vida de muchos. La reciprocidad es contagiosa, y he sido testigo de cómo pequeños actos pueden generar cambios masivos.',
    createdAt: '2024-12-15T14:30:00Z',
    averageRating: 4.7,
    ratingCount: 35,
    author: 'Carlos Rodríguez',
    category: 'Transformador'
  },
  {
    id: '3',
    title: 'La Fuerza de la Comunidad',
    description: 'Cuando mi familia enfrentó una crisis económica, nunca imaginé que nuestra comunidad nos levantaría de tantas formas. Desde comida compartida hasta apoyo emocional, cada vecino aportó lo que podía. Esta experiencia me enseñó que la verdadera riqueza está en las conexiones humanas que construimos. Hoy, en lugar de sentirme deudora, me siento parte de una red de apoyo que me fortalece y me da la seguridad de que nunca estoy sola. La solidaridad no es una palabra vacía, es una fuerza tangible que puede transformar tragedias en oportunidades de crecimiento.',
    createdAt: '2024-12-10T09:15:00Z',
    averageRating: 4.8,
    ratingCount: 42,
    author: 'Ana Sofía López',
    category: 'Conmovedor'
  },
  {
    id: '4',
    title: 'Más Allá de las Fronteras',
    description: 'Como voluntaria en un refugio para inmigrantes, he descubierto que el altruismo no conoce fronteras. Cada historia que escucho, cada vida que toco, me recuerda nuestra humanidad compartida. Aprendí idiomas nuevos, probé comidas diferentes, y sobre todo, aprendí que la empatía es el idioma universal que todos entendemos. El acto de dar tiempo y amor a extraños me ha devuelto una perspectiva más amplia del mundo y un profundo aprecio por la diversidad que nos enriquece.',
    createdAt: '2024-12-08T16:45:00Z',
    averageRating: 5.0,
    ratingCount: 56,
    author: 'Diego Hernández',
    category: 'Inspirador'
  }
];