'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarDays, MapPin, Image, Plus } from 'lucide-react';

interface EventFormData {
  name: string;
  date: string;
  place: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface CreateEventModalProps {
  onEventCreated?: (event: EventFormData) => void;
  trigger?: React.ReactNode;
}

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

export function CreateEventModal({ onEventCreated, trigger }: CreateEventModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    place: '',
    description: '',
    imageUrl: '',
    category: 'Voluntariado'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.date || !formData.place || !formData.description) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to create event
      console.log('Creating event:', formData);
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onEventCreated?.(formData);
      
      // Reset form
      setFormData({
        name: '',
        date: '',
        place: '',
        description: '',
        imageUrl: '',
        category: 'Voluntariado'
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error al crear el evento. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Crear Nuevo Evento
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Crear Nuevo Evento
          </DialogTitle>
          <DialogDescription>
            Organiza un nuevo evento de altruismo y reciprocidad para nuestra comunidad.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Evento *</Label>
            <Input
              id="name"
              placeholder="Ej: Limpieza de Playa Comunitaria"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha y Hora *</Label>
            <Input
              id="date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="place">Lugar *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="place"
                placeholder="Ej: Playa Norte, San Diego"
                value={formData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe el propósito del evento, actividades plannedas, y lo que los participantes deben esperar..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Si no proporcionas una imagen, se usará una imagen predeterminada según la categoría.
            </p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Evento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}