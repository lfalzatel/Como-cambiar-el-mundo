'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Plus, Mail, Phone, X, UserMinus } from 'lucide-react';

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  eventId: string;
  createdAt: string;
}

// Global attendees storage (in real app, this would be in a database)
let globalAttendees: Attendee[] = [
  {
    id: '1',
    name: 'Ana María López',
    email: 'ana.lopez@email.com',
    phone: '+1 555-0123',
    eventId: '1',
    createdAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: '',
    phone: '+1 555-0124',
    eventId: '1',
    createdAt: '2024-12-01T11:30:00Z'
  },
  {
    id: '3',
    name: 'Sofía Martínez',
    email: 'sofia.m@email.com',
    phone: '',
    eventId: '1',
    createdAt: '2024-12-01T14:20:00Z'
  },
  {
    id: '4',
    name: 'Diego Hernández',
    email: 'diego.h@email.com',
    phone: '+1 555-0125',
    eventId: '1',
    createdAt: '2024-12-02T09:15:00Z'
  },
  {
    id: '5',
    name: 'Lucía Gómez',
    email: '',
    phone: '',
    eventId: '1',
    createdAt: '2024-12-02T16:45:00Z'
  },
  {
    id: '6',
    name: 'Roberto Silva',
    email: 'roberto.s@email.com',
    phone: '+1 555-0126',
    eventId: '1',
    createdAt: '2024-12-02T10:30:00Z'
  },
  {
    id: '7',
    name: 'María González',
    email: 'maria.g@email.com',
    phone: '+1 555-0127',
    eventId: '1',
    createdAt: '2024-12-02T14:15:00Z'
  },
  {
    id: '8',
    name: 'José Pérez',
    email: '',
    phone: '+1 555-0128',
    eventId: '1',
    createdAt: '2024-12-02T18:00:00Z'
  },
  {
    id: '9',
    name: 'Carmen Díaz',
    email: 'carmen.d@email.com',
    phone: '+1 555-0129',
    eventId: '1',
    createdAt: '2024-12-02T20:30:00Z'
  },
  {
    id: '10',
    name: 'Antonio Ruiz',
    email: '',
    phone: '+1 555-0130',
    eventId: '1',
    createdAt: '2024-12-03T08:45:00Z'
  },
  {
    id: '11',
    name: 'Laura Sánchez',
    email: 'laura.s@email.com',
    phone: '+1 555-0131',
    eventId: '1',
    createdAt: '2024-12-03T10:15:00Z'
  },
  {
    id: '12',
    name: 'Miguel Ángel',
    email: 'miguel.a@email.com',
    phone: '+1 555-0132',
    eventId: '1',
    createdAt: '2024-12-03T12:00:00Z'
  },
  {
    id: '13',
    name: 'Patricia Morales',
    email: '',
    phone: '+1 555-0133',
    eventId: '1',
    createdAt: '2024-12-03T14:30:00Z'
  },
  {
    id: '14',
    name: 'Francisco Jiménez',
    email: 'francisco.j@email.com',
    phone: '+1 555-0134',
    eventId: '1',
    createdAt: '2024-12-03T16:45:00Z'
  },
  {
    id: '15',
    name: 'Isabel Torres',
    email: 'isabel.t@email.com',
    phone: '+1 555-0135',
    eventId: '1',
    createdAt: '2024-12-03T18:00:00Z'
  },
  {
    id: '16',
    name: 'David Castro',
    email: 'david.c@email.com',
    phone: '+1 555-0136',
    eventId: '1',
    createdAt: '2024-12-03T20:15:00Z'
  },
  {
    id: '17',
    name: 'Elena Vargas',
    email: 'elena.v@email.com',
    phone: '+1 555-0137',
    eventId: '1',
    createdAt: '2024-12-03T20:15:00Z'
  },
  {
    id: '18',
    name: 'Ricardo Mendoza',
    email: 'ricardo.m@email.com',
    phone: '+1 555-0138',
    eventId: '1',
    createdAt: '2024-12-04T08:30:00Z'
  },
  {
    id: '19',
    name: 'Teresa Herrera',
    email: '',
    phone: '+1 555-0139',
    eventId: '1',
    createdAt: '2024-12-04T10:00:00Z'
  },
  {
    id: '20',
    name: 'Alberto Ramírez',
    email: 'alberto.r@email.com',
    phone: '+1 555-0140',
    eventId: '1',
    createdAt: '2024-12-04T12:15:00Z'
  },
  {
    id: '21',
    name: 'Sandra Navarro',
    email: 'sandra.n@email.com',
    phone: '+1 555-0141',
    eventId: '1',
    createdAt: '2024-12-04T14:30:00Z'
  },
  {
    id: '22',
    name: 'Luis Ortega',
    email: '',
    phone: '+1 555-0142',
    eventId: '1',
    createdAt: '2024-12-04T16:45:00Z'
  },
  {
    id: '23',
    name: 'Claudia Rojas',
    email: 'claudia.r@email.com',
    phone: '+1 555-0143',
    eventId: '1',
    createdAt: '2024-12-04T18:30:00Z'
  },
  {
    id: '24',
    name: 'Jorge Flores',
    email: 'jorge.f@email.com',
    phone: '+1 555-0144',
    eventId: '1',
    createdAt: '2024-12-04T20:00:00Z'
  },
  {
    id: '25',
    name: 'Mónica Guerrero',
    email: '',
    phone: '+1 555-0145',
    eventId: '1',
    createdAt: '2024-12-05T08:00:00Z'
  }
];

interface AttendeeFormData {
  name: string;
  email: string;
  phone: string;
}

interface AttendeeManagementProps {
  eventId: string;
  eventName: string;
  attendees: Attendee[];
  onAttendeeAdded?: (attendee: AttendeeFormData) => void;
  onAttendeeRemoved?: (attendeeId: string) => void;
  trigger?: React.ReactNode;
}

export function AttendeeManagement({ 
  eventId, 
  eventName, 
  attendees, 
  onAttendeeAdded, 
  onAttendeeRemoved,
  trigger 
}: AttendeeManagementProps) {
  const [open, setOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AttendeeFormData>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get attendees for this specific event
  const eventAttendees = globalAttendees.filter(attendee => attendee.eventId === eventId);

  const handleInputChange = (field: keyof AttendeeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAttendee: Attendee = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventId: eventId,
        createdAt: new Date().toISOString()
      };
      
      // Add to global attendees
      globalAttendees.push(newAttendee);
      
      onAttendeeAdded?.(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: ''
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding attendee:', error);
      alert('Error al agregar asistente. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este asistente?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from global attendees
      const index = globalAttendees.findIndex(a => a.id === attendeeId);
      if (index > -1) {
        globalAttendees.splice(index, 1);
      }
      
      onAttendeeRemoved?.(attendeeId);
    } catch (error) {
      console.error('Error removing attendee:', error);
      alert('Error al eliminar asistente. Por favor intenta nuevamente.');
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Users className="h-4 w-4 mr-2" />
      Gestionar Asistentes
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Gestión de Asistentes
          </DialogTitle>
          <DialogDescription>
            {eventName} - {eventAttendees.length} asistente{eventAttendees.length !== 1 ? 's' : ''} registrado{eventAttendees.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Attendee Button */}
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nuevo Asistente
            </Button>
          )}

          {/* Add Attendee Form */}
          {showAddForm && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Nuevo Asistente</CardTitle>
                <CardDescription>
                  Ingresa los datos del nuevo asistente al evento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      placeholder="Ej: María García"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo (opcional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? 'Agregando...' : 'Agregar Asistente'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Attendees List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Asistentes Registrados ({eventAttendees.length})</h4>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Total: {eventAttendees.length}
              </Badge>
            </div>
            
            {eventAttendees.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay asistentes registrados aún.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Agrega el primer asistente usando el botón de arriba.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[400px] rounded-md border">
                <div className="p-4 space-y-3">
                  {eventAttendees.map((attendee) => (
                    <Card key={attendee.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-foreground truncate">
                            {attendee.name}
                          </h5>
                          <div className="flex flex-col gap-1 mt-1">
                            {attendee.email && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{attendee.email}</span>
                              </div>
                            )}
                            {attendee.phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>{attendee.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAttendee(attendee.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}