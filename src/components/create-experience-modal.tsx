'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Plus } from 'lucide-react';

interface ExperienceFormData {
  title: string;
  description: string;
}

interface CreateExperienceModalProps {
  onExperienceCreated?: (experience: ExperienceFormData) => void;
  trigger?: React.ReactNode;
}

export function CreateExperienceModal({ onExperienceCreated, trigger }: CreateExperienceModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ExperienceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Call API to create experience
      console.log('Creating experience:', formData);
      
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onExperienceCreated?.(formData);
      
      // Reset form
      setFormData({
        title: '',
        description: ''
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error creating experience:', error);
      alert('Error al compartir experiencia. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Heart className="h-4 w-4 mr-2" />
      Compartir Experiencia
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Compartir Experiencia
          </DialogTitle>
          <DialogDescription>
            Comparte tu historia de altruismo y reciprocidad para inspirar a otros en nuestra comunidad.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Experiencia *</Label>
            <Input
              id="title"
              placeholder="Ej: El Regalo de Dar"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Comparte tu experiencia de altruismo o reciprocidad. ¿Qué aprendiste? ¿Cómo impactó tu vida? ¿Qué mensaje dejarías a otros?"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              required
            />
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
              {isSubmitting ? 'Compartiendo...' : 'Compartir Experiencia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}